import express from "express"
import Joi from "joi"
import { auth } from "../middleware/auth.js";
import isAdmin from "../middleware/admin.js"
import arcjetProtect from "../middleware/arcjet.js";
import { validateBrandId } from "../lib/brandValidation.js";
import { validateCategoryId } from "../lib/categoryValidation.js";
import { pool } from "../lib/db.js";
const router = express.Router();

router.get("/", arcjetProtect, async (req, res) => {
    try {
        const [products] = await pool.execute("SELECT * FROM products");
        res.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/", arcjetProtect, auth, isAdmin, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const { name, description, price, category_id, brand_id } = req.body;
    if (!(await validateCategoryId(category_id))) {
        return res.status(400).json({ error: "Invalid category_id" });
    }
    if (!(await validateBrandId(brand_id))) {
        return res.status(400).json({ error: "Invalid brand_id" });
    }
    try {
        const [result] = await pool.execute(
            "INSERT INTO products (name, description, price, category_id, brand_id) VALUES (?, ?, ?, ?, ?)",
            [name, description, price, category_id, brand_id]
        );
        const productId = result.insertId;
        const [rows] = await pool.execute(
            "SELECT * FROM products WHERE product_id = ?",
            [productId]
        );
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.put("/:id", arcjetProtect, auth, isAdmin, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const { name, description, price, category_id, brand_id } = req.body;
    if (!(await validateCategoryId(category_id))) {
        return res.status(400).json({ error: "Invalid category_id" });
    }
    if (!(await validateBrandId(brand_id))) {
        return res.status(400).json({ error: "Invalid brand_id" });
    }
    const productId = req.params.id;
    try {
        await pool.execute(
            "UPDATE products SET name = ?, description = ?, price = ?, category_id = ?, brand_id = ? WHERE product_id = ?",
            [name, description, price, category_id, brand_id, productId]
        );
        const [rows] = await pool.execute(
            "SELECT * FROM products WHERE product_id = ?",
            [productId]
        );
        res.json(rows[0]);
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.patch("/:id", arcjetProtect, auth, isAdmin, async (req, res) => {
    const productId = req.params.id;

    const { error } = validateUpdate(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const fieldsToUpdate = req.body;
    
    const setClause = Object.keys(fieldsToUpdate)
        .map((field) => `${field} = ?`)
        .join(", ");

    const values = Object.values(fieldsToUpdate);
    values.push(productId);

    if (fieldsToUpdate.category_id && !(await validateCategoryId(fieldsToUpdate.category_id))) {
        return res.status(400).json({ error: "Invalid category_id" });
    }
    if (fieldsToUpdate.brand_id && !(await validateBrandId(fieldsToUpdate.brand_id))) {
        return res.status(400).json({ error: "Invalid brand_id" });
    }

    try {
        await pool.execute(
            `UPDATE products SET ${setClause} WHERE product_id = ?`,
            values
        );
        const [rows] = await pool.execute(
            "SELECT * FROM products WHERE product_id = ?",
            [productId]
        );
        res.json(rows[0]);
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.delete("/:id", arcjetProtect, auth, isAdmin, async (req, res) => {
    const productId = req.params.id;
    try {
        await pool.execute("DELETE FROM products WHERE product_id = ?", [productId]);
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

function validate(req) {
  const schema = Joi.object({
    name: Joi.string()
      .max(255)
      .required(),

    description: Joi.string()
      .allow(null, '')
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
            .allow(null, '')
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
