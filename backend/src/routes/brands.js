import express from "express";
import Joi from "joi";
import { auth } from "../middleware/auth.js";
import isAdmin from "../middleware/admin.js"
import arcjetProtect from "../middleware/arcjet.js";
import { pool } from "../lib/db.js";
const router = express.Router();

router.get("/", arcjetProtect, async (req, res) => {
    try {
        const [brands] = await pool.execute("SELECT * FROM brands");
        res.json(brands);
    } catch (error) {
        console.error("Error fetching brands:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/", arcjetProtect, auth, isAdmin, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const { name } = req.body;

    try {
        const [result] = await pool.execute(
            "INSERT INTO brands (name) VALUES (?)",
            [name]
        );
        res.status(201).json({ id: result.insertId, name });
    } catch (error) {
        console.error("Error creating brand:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

function validate(req) {
  let schema;
  
  schema = Joi.object({
      name: Joi.string().min(3).max(45).required()
  });

  return schema.validate(req);
}

export default router;