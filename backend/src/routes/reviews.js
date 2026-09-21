import express from "express";
import Joi from "joi";
import isAdmin from "../middleware/admin.js";
import { auth } from "../middleware/auth.js";
import arcjetProtect from "../middleware/arcjet.js";
import {
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
} from "../controllers/reviews.js";

const router = express.Router();

router.get("/", arcjetProtect, async (_, res) => {
    const reviews = await getReviews();

    res.json(reviews);
});

router.get("/product/:product_id", arcjetProtect, async (req, res) => {
    const productId = req.params.product_id;

    if (!(await validateProductId(productId)))  return res.status(404).json({ error: "Product not found" });

    const reviews = await getReviewsByProductId(productId);

    res.json(reviews);
});

router.get("/user", arcjetProtect, auth, async (req, res) => {
    const reviews = await getReviewsByUserId(req.user.user_id);

    res.json(reviews);
});

router.get("/:review_id", arcjetProtect, async (req, res) => {
    const review_id = req.params.review_id;

    const reviews = await getReviewById(review_id);

    if (reviews.length === 0) {
        return res.status(404).json({ error: "Review not found" });
    }

    res.json(reviews);
});

router.post("/", arcjetProtect, auth, async (req, res) => {
    const { error } = validate(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const { rating, comment, product_id } = req.body;

    if (!(await validateProductId(product_id))) return res.status(400).json({ error: "Invalid product_id" });

    let result;

    try {
        
        result = await createReview(rating, comment, product_id, req.user.user_id);

    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                error: "You have already reviewed this product"
            });
        }

        throw error;
    }

    const reviewId = result.insertId;

    const rows = await selectReviewById(reviewId);

    res.status(201).json(rows[0]);
});

router.patch("/:product_id", arcjetProtect, auth, async (req, res) => {
    const productId = req.params.product_id;

    if (!(await validateProductId(productId)))  return res.status(400).json({ error: "Invalid product_id" });

    const reviewsId = await findReviewIdByUserAndProduct(req.user.user_id, productId);

    if (reviewsId === null) return res.status(404).json({ error: "Review not found" });

    
    const { error } = validateUpdate(req.body);
    
    if (error)  return res.status(400).send(error.details[0].message);
    
    const fieldsToUpdate = { ...req.body };

    if (fieldsToUpdate.rating === undefined && fieldsToUpdate.comment === undefined) 
        return res.status(400).json({ error: "No fields to update" });
    
    const setClause = Object.keys(fieldsToUpdate)
    .map( (field) => `${field} = ?`)
        .join(", ");
    
        const values = Object.values(fieldsToUpdate);
    values.push(req.user.user_id);
    values.push(productId);
    
    await updateReviewsBySetClause(setClause, values);
    
    const rows = await selectReviewById(reviewsId);
    
    res.json(rows[0]);
});

router.delete("/:product_id", arcjetProtect, auth, async (req, res) => {
    const productId = req.params.product_id;

    if (!(await validateProductId(productId)))  return res.status(400).json({ error: "Invalid product_id" });

    const reviewId = await findReviewIdByUserAndProduct(req.user.user_id, productId);

    if (reviewId === null) return res.status(404).json({ error: "Review not found"});

    await deleteReview(req.user.user_id, productId);

    res.status(204).send();

});

router.delete("/admin/:id", arcjetProtect, auth, isAdmin, async (req, res) => {
    const reviewId = req.params.id;

    const reviews = await selectReviewById(reviewId);

    if (reviews.length === 0) return res.status(404).json({ error: "Review not found" });

    await adminDeleteReview(reviewId);

    res.status(204).send();
});


function validate(req) {
    const schema = Joi.object({
        rating: Joi.number()
            .integer()
            .min(1)
            .max(5)
            .required(),

        comment: Joi.string()
            .trim()
            .min(3)
            .max(500)
            .required(),

        product_id: Joi.number()
                .integer()
                .positive()
                .required(),
    });

    return schema.validate(req);
}

function validateUpdate(req) {
    const schema = Joi.object({
        rating: Joi.number()
            .integer()
            .min(1)
            .max(5)
            .optional(),

        comment: Joi.string()
            .trim()
            .min(3)
            .max(500)
            .optional(),
    });

    return schema.validate(req);
}

export default router;
export { validate };
