import express from "express";
import Joi from "joi";
import arcjetProtect from "../middleware/arcjet.js";
import { auth } from "../middleware/auth.js";
import { requireUser } from "../middleware/requireUser.js";
import {
    getWishlist,
    getWishlistProductIds,
    addToWishlist,
    removeFromWishlist
} from "../controllers/wishlist.js";

const router = express.Router();

router.use(arcjetProtect, auth, requireUser);

router.get("/", async (req, res) => {
    const items = await getWishlist(req.user.user_id);

    res.json(items);
});

router.get("/ids", async (req, res) => {
    const ids = await getWishlistProductIds(req.user.user_id);

    res.json(ids);
});

router.post("/:productId", async (req, res) => {
    const { error, value: productId } = validateProductId(req.params.productId);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        await addToWishlist(req.user.user_id, productId);
    } catch (err) {
        if (err.code === "ER_NO_REFERENCED_ROW_2") {
            return res.status(404).send("Product not found");
        }
        throw err;
    }

    res.status(201).json({ product_id: productId });
});

router.delete("/:productId", async (req, res) => {
    const { error, value: productId } = validateProductId(req.params.productId);
    if (error) return res.status(400).send(error.details[0].message);

    await removeFromWishlist(req.user.user_id, productId);

    res.status(204).send();
});

function validateProductId(id) {
    return Joi.number().integer().positive().required().validate(id);
}

export default router;