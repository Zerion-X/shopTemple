import { pool } from "../lib/db.js";
const createOrderFromCart = async (req, res) => {
  const userId = req.user.user_id;
  const { shipping_address } = req.body;

  if (!shipping_address || shipping_address.trim() === '') {
    return res.status(400).json({ message: 'َAddress is required!' });
  }

  const connection = await pool.getConnection();

  try {

    await connection.beginTransaction();

    const [cartItems] = await connection.execute(
      `SELECT ci.product_id, ci.quantity, p.price, p.name 
       FROM cart_items ci
       JOIN carts c ON ci.cart_id = c.cart_id
       JOIN products p ON ci.product_id = p.product_id
       WHERE c.user_id = ?`,
      [userId]
    );

    if (cartItems.length === 0) {
      await connection.rollback();
      return res.status(400).json({ message: 'Cart is empty!' });
    }

    const totalAmount = cartItems.reduce((acc, item) => {
      return acc + (Number(item.price) * item.quantity);
    }, 0);

    const [orderResult] = await connection.execute(
      `INSERT INTO orders (user_id, total_amount, shipping_address, status) 
       VALUES (?, ?, ?, 'pending')`,
      [userId, totalAmount, shipping_address]
    );

    const orderId = orderResult.insertId;

    const orderItemsValues = cartItems.map(item => [
      orderId,
      item.product_id,
      item.quantity,
      item.price
    ]);

    await connection.query(
      `INSERT INTO order_items (order_id, product_id, quantity, price_per_unit) 
       VALUES ?`,
      [orderItemsValues]
    );

    await connection.execute(
      `DELETE ci FROM cart_items ci
       JOIN carts c ON ci.cart_id = c.cart_id
       WHERE c.user_id = ?`,
      [userId]
    );

    await connection.commit();

    return res.status(201).json({
      message: 'Order registered successfully.',
      order_id: orderId,
      total_amount: totalAmount
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error creating order:', error);
    return res.status(500).json({ message: 'Error creating order!' });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

const ORDER_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

const getUserOrders = async (req, res) => {
  const userId = req.user.user_id;

  try {
    const [orders] = await pool.execute(
      `SELECT o.order_id, o.total_amount, o.shipping_address, o.status, o.created_at,
              (SELECT COUNT(*) FROM order_items oi WHERE oi.order_id = o.order_id) AS items_count
       FROM orders o
       WHERE o.user_id = ?
       ORDER BY o.created_at DESC`,
      [userId]
    );

    return res.status(200).json({
      orders: orders.map((order) => ({
        ...order,
        total_amount: Number(order.total_amount),
      })),
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return res.status(500).json({ message: "Error fetching orders!" });
  }
};

const getOrderById = async (req, res) => {
  const orderId = Number(req.params.id);
  const user = req.user;

  if (!Number.isInteger(orderId) || orderId <= 0) {
    return res.status(400).json({ message: "Invalid order id!" });
  }

  try {
    const [orders] = await pool.execute(
      `SELECT order_id, user_id, total_amount, shipping_address, status, created_at
       FROM orders
       WHERE order_id = ?`,
      [orderId]
    );

    if (orders.length === 0) {
      return res.status(404).json({ message: "Order not found!" });
    }

    const order = orders[0];

    if (user.role !== "admin" && Number(order.user_id) !== Number(user.user_id)) {
      return res.status(403).json({ message: "You are not allowed to see this order!" });
    }

    const [items] = await pool.execute(
      `SELECT oi.product_id, oi.quantity, oi.price_per_unit, p.name, p.image_url
       FROM order_items oi
       JOIN products p ON oi.product_id = p.product_id
       WHERE oi.order_id = ?`,
      [orderId]
    );

    return res.status(200).json({
      order: {
        ...order,
        total_amount: Number(order.total_amount),
        items: items.map((item) => ({
          ...item,
          price_per_unit: Number(item.price_per_unit),
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return res.status(500).json({ message: "Error fetching order!" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const [orders] = await pool.execute(
      `SELECT o.order_id, o.total_amount, o.shipping_address, o.status, o.created_at,
              u.user_id, u.full_name, u.email
       FROM orders o
       JOIN users u ON o.user_id = u.user_id
       ORDER BY o.created_at DESC`
    );

    return res.status(200).json({
      orders: orders.map((order) => ({
        ...order,
        total_amount: Number(order.total_amount),
      })),
    });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    return res.status(500).json({ message: "Error fetching orders!" });
  }
};

const updateOrderStatus = async (req, res) => {
  const orderId = Number(req.params.id);
  const { status } = req.body;

  if (!Number.isInteger(orderId) || orderId <= 0) {
    return res.status(400).json({ message: "Invalid order id!" });
  }

  if (!status || !ORDER_STATUSES.includes(status)) {
    return res.status(400).json({ message: "Invalid order status!" });
  }

  try {
    const [result] = await pool.execute(
      `UPDATE orders SET status = ? WHERE order_id = ?`,
      [status, orderId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Order not found!" });
    }

    return res.status(200).json({ message: "Order status was updated" });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({ message: "Error updating order status!" });
  }
};

export { createOrderFromCart, getUserOrders, getOrderById, getAllOrders, updateOrderStatus };

