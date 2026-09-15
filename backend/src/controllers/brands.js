import { pool } from "../lib/db.js";

async function getBrands() {
    const [brands] = await pool.execute("SELECT brand_id, name, image_url FROM brands");

    return brands;
}

async function createBrand(name, imageUrl, imagePublicId) {
    const [result] = await pool.execute(
        "INSERT INTO brands (name, image_url, image_public_id) VALUES (?, ?, ?)",
        [name, imageUrl, imagePublicId]
    );

    return result;
}

async function selectBrandbyId(brandId) {
    const [rows] = await pool.execute(
        "SELECT * FROM brands WHERE brand_id = ?",
        [brandId]
    );

    return rows;
}

async function updateBrands(setClause, values) {
    await pool.execute(
        `UPDATE brands
         SET ${setClause}
         WHERE brand_id = ?`,
         values
    );
}

async function getUpdateBrandbyId(brandId) {
    const [updatedRows] = await pool.execute(
        `SELECT
            brand_id,
            name,
            image_url
            FROM brands
            WHERE brand_id = ?`,
        [brandId]
    );

    return updatedRows;
}

async function selectImagePublicId (brandId) {
    const [rows] = await pool.execute(
        "SELECT image_public_id FROM brands WHERE brand_id = ?",
        [brandId]
    );

    return rows;
}

async function deleteBrandbyId (brandId) {
    await pool.execute(
        "DELETE FROM brands WHERE brand_id = ?",
        [brandId]
    );
}

async function checkDuplicateNames(name) {
    const [rows] = await pool.execute(
        `SELECT name
         FROM brands
         WHERE name = ?
         LIMIT 1`,
        [name]
    );

    return rows.length > 0;
}

async function checkDuplicateNameForUpdate(name, brandId) {
    const [rows] = await pool.execute(
        `SELECT brand_id
         FROM brands
         WHERE name = ? AND brand_id != ?
         LIMIT 1`,
        [name, brandId]
    );

    return rows.length > 0;
}

export { getBrands, createBrand, selectBrandbyId, updateBrands, getUpdateBrandbyId, selectImagePublicId, deleteBrandbyId, checkDuplicateNames, checkDuplicateNameForUpdate };