import { pool } from "../lib/db.js";

async function createCategory(name) {
    const [result] = await pool.execute(
        `INSERT INTO categories (name)
         VALUES (?)`,
        [name]
    );

    return result.insertId;
}

async function getCategory() {
    const [categories] = await pool.execute(
        "SELECT * FROM categories"
    );

    return categories;
}

async function checkDuplicateNames(name) {
    const [rows] = await pool.execute(
        `SELECT name
         FROM categories
         WHERE name = ?
         LIMIT 1`,
        [name]
    );

    return rows.length > 0;
}

export { createCategory, getCategory, checkDuplicateNames };