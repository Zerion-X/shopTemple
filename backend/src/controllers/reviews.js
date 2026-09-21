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

router.get("/product/:product_id", arcjetProtect, async (req, res) => {
    const productId = req.params.product_id;

    if (!(await validateProductId(productId))) {
        return res.status(404).json({
            error: "Product not found"
        });
    }

    const reviews = await getReviewsByProductId(productId);

    res.json(reviews);
});

router.get("/user", arcjetProtect, auth, async (req, res) => {
    const reviews = await getReviewsByUserId(req.user.user_id);

    res.json(reviews);
});

router.get("/:review_id", arcjetProtect, async (req, res) => {
    const reviewId = req.params.review_id;

    const reviews = await getReviewById(reviewId);

    if (reviews.length === 0) {
        return res.status(404).json({
            error: "Review not found"
        });
    }

    res.json(reviews[0]);
});

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