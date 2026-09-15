import express from "express";
import Joi from "joi";
import { auth } from "../middleware/auth.js";
import isAdmin from "../middleware/admin.js";
import arcjetProtect from "../middleware/arcjet.js";
import upload from "../middleware/upload.js";
import { uploadToCloudinary } from "../lib/cloudinaryUpload.js";
import cloudinary from "../lib/cloudinary.js";
import {
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
} from "../controllers/products.js";

const router = express.Router();

router.get("/", arcjetProtect, async (req, res) => {
    const products = await getProducts();

    res.json(products);
});

router.post("/", arcjetProtect, auth, isAdmin, upload.single("image"), async (req, res) => {
    const { error } = validate(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const { name, description, price, category_id, brand_id } = req.body;

    if (await checkDuplicateNames(name)) {
        return res.status(409).json({ error: "Such name already exists" });
    }

    if (!(await validateCategoryId(category_id))) {
        return res.status(400).json({ error: "Invalid category_id" });
    }

    if (!(await validateBrandId(brand_id))) {
        return res.status(400).json({ error: "Invalid brand_id" });
    }

    let imageUrl = null;
    let imagePublicId = null;

    if (req.file) {
        const result = await uploadToCloudinary(
            req.file.buffer,
            "shop-temple/products"
        );

        imageUrl = result.secure_url;
        imagePublicId = result.public_id;
    }

    const result = await createProduct(
        name,
        description,
        price,
        category_id,
        brand_id,
        imageUrl,
        imagePublicId
    );

    const productId = result.insertId;

    const rows = await selectProductbyId(productId);

    res.status(201).json(rows[0]);
});

router.put("/:id", arcjetProtect, auth, isAdmin, upload.single("image"), async (req, res) => {
    const productId = req.params.id;

    const products = await selectProductbyId(productId);

    if (products.length === 0) {
        return res.status(404).json({ error: "Product not found" });
    }

    const product = products[0];

    const { error } = validate(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const { name, description, price, category_id, brand_id } = req.body;

    if (await checkDuplicateNameForUpdate(name, productId)) {
        return res.status(409).json({ error: "Such name already exists" });
    }

    if (!(await validateCategoryId(category_id))) {
        return res.status(400).json({ error: "Invalid category_id" });
    }

    if (!(await validateBrandId(brand_id))) {
        return res.status(400).json({ error: "Invalid brand_id" });
    }

    let imageUrl = product.image_url;
    let imagePublicId = product.image_public_id;

    if (req.file) {
        const result = await uploadToCloudinary(
            req.file.buffer,
            "shop-temple/products"
        );

        imageUrl = result.secure_url;
        imagePublicId = result.public_id;
    }

    await updateProductbyId(
        name,
        description,
        price,
        category_id,
        brand_id,
        imageUrl,
        imagePublicId,
        productId
    );

    if (req.file && product.image_public_id) {
        await cloudinary.uploader.destroy(product.image_public_id);
    }

    const rows = await selectProductbyId(productId);

    res.json(rows[0]);
});

router.patch("/:id", arcjetProtect, auth, isAdmin, upload.single("image"), async (req, res) => {
    const productId = req.params.id;

    const products = await selectProductbyId(productId);

    if (products.length === 0) {
        return res.status(404).json({ error: "Product not found" });
    }

    const product = products[0];

    const { error } = validateUpdate(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const fieldsToUpdate = { ...req.body };

    if (Object.keys(fieldsToUpdate).length === 0 && !req.file) {
        return res.status(400).json({ error: "No fields to update" });
    }

    if (fieldsToUpdate.name !== undefined) {
        if (await checkDuplicateNameForUpdate(fieldsToUpdate.name, productId)) {
            return res.status(409).json({ error: "Such name already exists" });
        }
    }

    if (fieldsToUpdate.category_id !== undefined && !(await validateCategoryId(fieldsToUpdate.category_id))) {
        return res.status(400).json({ error: "Invalid category_id" });
    }

    if (fieldsToUpdate.brand_id !== undefined && !(await validateBrandId(fieldsToUpdate.brand_id))) {
        return res.status(400).json({ error: "Invalid brand_id" });
    }

    let oldImagePublicId = null;

    if (req.file) {
        const result = await uploadToCloudinary(
            req.file.buffer,
            "shop-temple/products"
        );

        fieldsToUpdate.image_url = result.secure_url;
        fieldsToUpdate.image_public_id = result.public_id;

        oldImagePublicId = product.image_public_id;
    }

    const setClause = Object.keys(fieldsToUpdate)
        .map((field) => `${field} = ?`)
        .join(", ");

    const values = Object.values(fieldsToUpdate);
    values.push(productId);

    await updateProducts(setClause, values);

    if (oldImagePublicId) {
        await cloudinary.uploader.destroy(oldImagePublicId);
    }

    const rows = await selectProductbyId(productId);

    res.json(rows[0]);
});

router.delete("/:id", arcjetProtect, auth, isAdmin, async (req, res) => {
    const productId = req.params.id;

    const rows = await selectImagePublicId(productId);

    if (rows.length === 0) {
        return res.status(404).json({ error: "Product not found" });
    }

    const product = rows[0];

    if (product.image_public_id) {
        await cloudinary.uploader.destroy(product.image_public_id);
    }

    await deleteProductbyId(productId);

    res.status(204).send();
});

function validate(req) {
    const schema = Joi.object({
        name: Joi.string()
            .max(255)
            .required(),

        description: Joi.string()
            .allow(null, "")
            .optional(),

        price: Joi.number()
            .positive()
            .precision(2)
            .required(),

        category_id: Joi.number()
            .integer()
            .positive()
            .required(),

        brand_id: Joi.number()
            .integer()
            .positive()
            .required()
    });

    return schema.validate(req);
}

function validateUpdate(req) {
    const schema = Joi.object({
        name: Joi.string()
            .max(255)
            .optional(),

        description: Joi.string()
            .allow(null, "")
            .optional(),

        price: Joi.number()
            .positive()
            .precision(2)
            .optional(),

        category_id: Joi.number()
            .integer()
            .positive()
            .optional(),

        brand_id: Joi.number()
            .integer()
            .positive()
            .optional()
    });

    return schema.validate(req);
}

export default router;
