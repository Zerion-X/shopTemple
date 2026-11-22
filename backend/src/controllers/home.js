import { pool } from "../lib/db.js";

const BUDGET_MAX = 25;

const cache = new Map();
const withCache = async (key, ttlMs, fetcher) => {
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return hit.data;

  const data = await fetcher();
  if (cache.size > 200) cache.clear();
  cache.set(key, { data, expires: Date.now() + ttlMs });
  return data;
};

const sendCached = (res, products) => {
  res.set("Cache-Control", "public, max-age=60");
  return res.status(200).json(products);
};

const getBestSellers = async (req, res) => {
  try {
    const products = await withCache("best-sellers", 5 * 60 * 1000, async () => {
      const [rows] = await pool.execute(
        `SELECT p.product_id, p.name, p.description, p.price, p.image_url,
                SUM(oi.quantity) AS total_sold
         FROM order_items oi
         JOIN orders o ON oi.order_id = o.order_id
         JOIN products p ON oi.product_id = p.product_id
         WHERE o.status <> 'cancelled'
         GROUP BY p.product_id
         ORDER BY total_sold DESC
         LIMIT 16`
      );
      return rows;
    });
    return sendCached(res, products);
  } catch (error) {
    console.error("Error fetching best sellers:", error);
    return res.status(500).json({ message: "Error fetching best sellers!" });
  }
};

const getNewestProducts = async (req, res) => {
  try {
    const products = await withCache("newest", 2 * 60 * 1000, async () => {
      const [rows] = await pool.execute(
        `SELECT product_id, name, description, price, image_url
         FROM products
         ORDER BY product_id DESC
         LIMIT 12`
      );
      return rows;
    });
    return sendCached(res, products);
  } catch (error) {
    console.error("Error fetching newest products:", error);
    return res.status(500).json({ message: "Error fetching newest products!" });
  }
};

const getBudgetPicks = async (req, res) => {
  try {
    const products = await withCache("budget", 5 * 60 * 1000, async () => {
      const [rows] = await pool.execute(
        `SELECT product_id, name, description, price, image_url
         FROM products
         WHERE price <= ?
         ORDER BY product_id DESC
         LIMIT 12`,
        [BUDGET_MAX]
      );
      return rows;
    });
    return sendCached(res, products);
  } catch (error) {
    console.error("Error fetching budget picks:", error);
    return res.status(500).json({ message: "Error fetching budget picks!" });
  }
};

const getCategoryProducts = async (req, res) => {
  const categoryId = Number(req.params.id);

  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    return res.status(400).json({ message: "Invalid category id!" });
  }

  try {
    const products = await withCache(`category-${categoryId}`, 2 * 60 * 1000, async () => {
      const [rows] = await pool.execute(
        `SELECT product_id, name, description, price, image_url
         FROM products
         WHERE category_id = ?
         ORDER BY product_id DESC
         LIMIT 12`,
        [categoryId]
      );
      return rows;
    });
    return sendCached(res, products);
  } catch (error) {
    console.error("Error fetching category products:", error);
    return res.status(500).json({ message: "Error fetching category products!" });
  }
};

export { getBestSellers, getNewestProducts, getBudgetPicks, getCategoryProducts };