import { pool } from "./db.js";

export default async function validateCategoryId(category_id) {
    const [categories] = await pool.execute(
        "SELECT category_id FROM categories WHERE category_id = ?",
        [category_id]
    );

    return categories.length > 0;
}