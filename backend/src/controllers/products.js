import { pool } from "../lib/db.js";

async function getProducts() {
    const [products] = await pool.execute(`
        SELECT
            product_id,
            name,
            description,
            price,
            created_at,
            brand_id,
            category_id,
            image_url
        FROM products
        `);
    
    return products;
};

async function validateCategoryId(category_id) {
    const [categories] = await pool.execute(
        "SELECT category_id FROM categories WHERE category_id = ?",
        [category_id]
    );

    return categories.length > 0;
}

async function validateBrandId(brand_id) {
    const [brands] = await pool.execute(
        "SELECT brand_id FROM brands WHERE brand_id = ?",
        [brand_id]
    );

    return brands.length > 0;
}

async function createProduct(name, description, price, category_id, brand_id, imageUrl, imagePublicId) {
    const [result] = await pool.execute(`
        INSERT INTO products (
                              name,
                              description,
                              price,
                              category_id,
                              brand_id,
                              image_url,
                              image_public_id
                            ) 
                            VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, description, price, category_id, brand_id, imageUrl, imagePublicId]
    );

    return result;
}

async function selectProductbyId(productId) {
    const [rows] = await pool.execute(
            "SELECT * FROM products WHERE product_id = ?",
            [productId]
        );

    return rows;
}

async function updateProductbyId(name, description, price, category_id, brand_id, imageUrl, imagePublicId, productId) {
    await pool.execute(
        "UPDATE products SET name = ?, description = ?, price = ?, category_id = ?, brand_id = ?, image_url = ?, image_public_id = ? WHERE product_id = ?",
        [name, description, price, category_id, brand_id, imageUrl, imagePublicId, productId]
    );
}

async function updateProducts(setClause, values) {
    await pool.execute(
        `UPDATE products SET ${setClause} WHERE product_id = ?`,
        values
    );   
}

async function selectImagePublicId(productId) {
    const [rows] = await pool.execute(
            "SELECT image_public_id FROM products WHERE product_id = ?",
            [productId]
        );
    
    return rows;
}

async function deleteProductbyId(productId) {
    await pool.execute(
        "DELETE FROM products WHERE product_id = ?", 
        [productId]
    );
}

async function checkDuplicateNames(name) {
    const [rows] = await pool.execute(
        `SELECT name
         FROM products
         WHERE name = ?
         LIMIT 1`,
        [name]
    );

    return rows.length > 0;
}

async function checkDuplicateNameForUpdate(name, productId) {
    const [rows] = await pool.execute(
        `SELECT product_id
         FROM products
         WHERE name = ? AND product_id != ?
         LIMIT 1`,
        [name, productId]
    );

    return rows.length > 0;
}

export { 
    getProducts,
    validateCategoryId, 
    validateBrandId,  
    createProduct, 
    selectProductbyId, 
    updateProductbyId,
    updateProducts, 
    selectImagePublicId,
    deleteProductbyId, 
    checkDuplicateNameForUpdate,
    checkDuplicateNames 
};