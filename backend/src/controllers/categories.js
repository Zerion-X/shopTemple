import { pool } from "../lib/db.js";

async function createCategory(name, imageUrl, imagePublicId) {
    const [result] = await pool.execute(
            "INSERT INTO categories (name, image_url, image_public_id) VALUES (?, ?, ?)",
            [name, imageUrl, imagePublicId]
        );

    return result;
}

async function getCategory() {
    const [categories] = await pool.execute(
        "SELECT category_id, name, image_url FROM categories"
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

async function selectCatbyId(categoryid) {
    const [rows] = await pool.execute(
        "SELECT * FROM categories WHERE category_id = ?",
        [categoryid]
        );

    return rows;
}

async function updateCat(setClause, values) {
    await pool.execute(
        `UPDATE categories
         SET ${setClause}
         WHERE category_id = ?`,
         values
    );
}

async function getUpdatedCatbyId(categoryId) {
    const [updatedRows] = await pool.execute(
            `SELECT
                category_id,
                name,
                image_url
                FROM categories
                WHERE category_id = ?`,
            [categoryId]
        );
    
    return updatedRows;
}

async function selectImagePublicId (categoryId) {
    const [rows] = await pool.execute(
            "SELECT image_public_id FROM categories WHERE category_id = ?",
            [categoryId]
        );

    return rows;
}

async function deleteCatbyId (categoryId) {
    await pool.execute(
        "DELETE FROM categories WHERE category_id = ?",
        [categoryId]
    );
}

async function checkDuplicateNameForUpdate(name, categoryId) {
    const [rows] = await pool.execute(
        `SELECT category_id
         FROM categories
         WHERE name = ? AND category_id != ?
         LIMIT 1`,
        [name, categoryId]
    );

    return rows.length > 0;
}

export { createCategory, getCategory, checkDuplicateNames, selectCatbyId, updateCat, getUpdatedCatbyId, selectImagePublicId, deleteCatbyId, checkDuplicateNameForUpdate };