
import { pool } from "../lib/db.js";

async function getCartByUserId(userId) {
  const [rows] = await pool.execute(
    `
      SELECT
        c.cart_id,
        c.updated_at,
        ci.product_id,
        ci.quantity,
        p.name,
        p.description,
        p.price,
        p.image_url
      FROM carts c
      LEFT JOIN cart_items ci
        ON c.cart_id = ci.cart_id
      LEFT JOIN products p
        ON ci.product_id = p.product_id
      WHERE c.user_id = ?
    `,
    [userId]
  );

  if (rows.length === 0) {
    return {
      cart_id: null,
      updated_at: null,
      items: []
    };
  }

  const items = rows
    .filter(row => row.product_id !== null)
    .map(row => ({
      product_id: row.product_id,
      name: row.name,
      description: row.description,
      price: row.price,
      image_url: row.image_url,
      quantity: row.quantity
    }));

  return {
    cart_id: rows[0].cart_id,
    updated_at: rows[0].updated_at,
    items
  };
}

async function validateProductId(productId) {
  const [rows] = await pool.execute(
    "SELECT product_id FROM products WHERE product_id = ?",
    [productId]
  );

  return rows.length > 0;
}

async function getOrCreateCart(userId) {
  const [result] = await pool.execute(
    `
      INSERT INTO carts (user_id)
      VALUES (?)
      ON DUPLICATE KEY UPDATE
        cart_id = LAST_INSERT_ID(cart_id)
    `,
    [userId]
  );

  return result.insertId;
}

async function addCartItem(cartId, productId, quantity) {
  const [result] = await pool.execute(
    `
      INSERT INTO cart_items (cart_id, product_id, quantity)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
        quantity = quantity + ?
    `,
    [cartId, productId, quantity, quantity]
  );

  return result;
}

async function checkCartItem(userId, productId) {
  const [rows] = await pool.execute(
    `
      SELECT ci.product_id
      FROM cart_items ci
      JOIN carts c
        ON ci.cart_id = c.cart_id
      WHERE c.user_id = ? AND ci.product_id = ?
    `,
    [userId, productId]
  );

  return rows.length > 0;
}

async function updateCartItem(userId, productId, quantity) {
  const [result] = await pool.execute(
    `
      UPDATE cart_items ci
      JOIN carts c
        ON ci.cart_id = c.cart_id
      SET ci.quantity = ?
      WHERE c.user_id = ? AND ci.product_id = ?
    `,
    [quantity, userId, productId]
  );

  return result;
}

async function deleteCartItem(userId, productId) {
  const [result] = await pool.execute(
    `
      DELETE ci
      FROM cart_items ci
      JOIN carts c
        ON ci.cart_id = c.cart_id
      WHERE c.user_id = ? AND ci.product_id = ?
    `,
    [userId, productId]
  );

  return result;
}

async function clearCart(userId) {
  const [result] = await pool.execute(
    `
      DELETE ci
      FROM cart_items ci
      JOIN carts c
        ON ci.cart_id = c.cart_id
      WHERE c.user_id = ?
    `,
    [userId]
  );

  return result;
}

async function touchCart(userId) {
  await pool.execute(
    `
      UPDATE carts
      SET updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `,
    [userId]
  );
}

export {
  getCartByUserId,
  validateProductId,
  getOrCreateCart,
  addCartItem,
  checkCartItem,
  updateCartItem,
  deleteCartItem,
  clearCart,
  touchCart
};
