import { pool } from "../lib/db.js";

async function getWishlist(user_id) {
    const [items] = await pool.execute(
        `SELECT p.*, w.created_at AS wishlisted_at
         FROM wishlist w
         JOIN products p ON p.product_id = w.product_id
         WHERE w.user_id = ?
         ORDER BY w.created_at DESC`,
        [user_id]
    );

    return items;
};

async function getWishlistProductIds(user_id) {
    const [rows] = await pool.execute(
        `SELECT product_id FROM wishlist WHERE user_id = ?`,
        [user_id]
    );

    return rows.map((row) => row.product_id);
};

async function addToWishlist(user_id, product_id) {
    await pool.execute(
        `INSERT INTO wishlist (user_id, product_id)
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE user_id = user_id`,
        [user_id, product_id]
    );
};

async function removeFromWishlist(user_id, product_id) {
    await pool.execute(
        `DELETE FROM wishlist WHERE user_id = ? AND product_id = ?`,
        [user_id, product_id]
    );
};

export {
    getWishlist,
    getWishlistProductIds,
    addToWishlist,
    removeFromWishlist
};