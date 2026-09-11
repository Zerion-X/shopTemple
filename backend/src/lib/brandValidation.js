import { pool } from "./db.js";

export default async function validateBrandId(brand_id) {
    const [brands] = await pool.execute(
        "SELECT brand_id FROM brands WHERE brand_id = ?",
        [brand_id]
    );

    return brands.length > 0;
}