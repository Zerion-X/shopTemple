import { pool } from "./db.js";

export default async function validateproductId(product_id) {
    const [products] = await pool.execute(
        "SELECT product_id FROM products WHERE product_id = ?",
        [product_id]
    );

    return products.length > 0;
}