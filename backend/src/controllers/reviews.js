import { pool } from "../lib/db.js";

async function validateProductId(product_id) {
    const [products] = await pool.execute(
        "SELECT product_id FROM products WHERE product_id = ?",
        [product_id]
    );

    return products.length > 0;
}

async function getReviews() {
    const [reviews] = await pool.execute(`
        SELECT
            review_id,
            rating,
            comment,
            created_at,
            product_id,
            user_id
        FROM reviews
    `);

    return reviews;
}

async function createReview(rating, comment, product_id, user_id) {
    const [result] = await pool.execute(
        `INSERT INTO reviews
            (rating, comment, product_id, user_id)
         VALUES (?, ?, ?, ?)`,
        [rating, comment, product_id, user_id]
    );

    return result;
}

async function selectReviewById(review_id) {
    const [rows] = await pool.execute(
        "SELECT * FROM reviews WHERE review_id = ?",
        [review_id]
    );

    return rows;
}

async function updateReviewsBySetClause(setClause, values) {
    await pool.execute(
        `UPDATE reviews SET ${setClause}
         WHERE user_id = ? AND product_id = ?`,
         values
    );
};

async function deleteReview(user_id, product_id) {
    await pool.execute(
        `DELETE FROM reviews
         WHERE user_id = ? AND product_id = ?`,
        [user_id, product_id]
    );
}

async function findReviewIdByUserAndProduct(user_id, product_id) {
    const [rows] = await pool.execute(
        `SELECT review_id
         FROM reviews
         WHERE user_id = ? AND product_id = ?`,
        [user_id, product_id]
    );

    return rows.length > 0 ? rows[0].review_id : null;
}

async function adminDeleteReview(review_id) {
    await pool.execute(
        `DELETE FROM reviews
         WHERE review_id = ?`,
         [review_id]
    );
}

async function getReviewsByProductId(product_id) {
    const [reviews] = await pool.execute(`
        SELECT
            review_id,
            rating,
            comment,
            created_at,
            product_id,
            user_id
        FROM reviews
        WHERE product_id = ?`,
        [product_id]
    );    

    return reviews;
}

async function getReviewsByUserId(user_id) {
    const [reviews] = await pool.execute(`
        SELECT
            review_id,
            rating,
            comment,
            created_at,
            product_id,
            user_id
        FROM reviews
        WHERE user_id = ?`,
        [user_id]
    );    

    return reviews;
}

async function getReviewById(review_id) {
    const [reviews] = await pool.execute(`
        SELECT
            review_id,
            rating,
            comment,
            created_at,
            product_id,
            user_id
        FROM reviews
        WHERE review_id = ?`,
        [review_id]
    );    

    return reviews;
}

export {
    validateProductId,
    getReviews,
    createReview,
    selectReviewById,
    deleteReview,
    findReviewIdByUserAndProduct,
    adminDeleteReview, 
    updateReviewsBySetClause,
    getReviewsByProductId,
    getReviewsByUserId,
    getReviewById
};