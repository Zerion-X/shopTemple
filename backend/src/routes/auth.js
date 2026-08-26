import express from "express"
import Joi from "joi"
import bcrypt from "bcrypt"
import {pool} from "../lib/db.js"
const router = express.Router();


function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(8).max(1024).required(),
    full_name: Joi.string().min(3).max(50).required()
  });

  return schema.validate(req);
}

router.post('/signup', async (req, res) => {
    try {
        const {error} = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const {full_name, email, password} = req.body;

        const normalizedEmail = email.trim().toLowerCase();

        const [users] = await pool.execute(
        "SELECT user_id FROM users WHERE email = ? LIMIT 1",
        [normalizedEmail]
        );

        if (users.length > 0) {
        return res.status(400).send("Email already exists");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [result] = await pool.execute(
        `INSERT INTO users (full_name, email, password)
        VALUES (?, ?, ?)`,
        [full_name, normalizedEmail, hashedPassword]
        );

        const userId = result.insertId;

        const [rows] = await pool.execute(
            `SELECT full_name, email, created_at
            FROM users
            WHERE user_id = ?`,
            [userId]
        );

        const user = rows[0];

        res.status(201).json({
        full_name: user.full_name,
        email: user.email,
        createdAt: user.created_at,
        });

    } catch (error) {
        console.error("Error during signup:", error.message);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/login', async (req, res) => {
    const {email, password} = req.body;

    try {
        const normalizedEmail = email.trim().toLowerCase();

        const [users] = await pool.execute(
            "SELECT user_id, password, full_name, email, role, created_at FROM users WHERE email = ? LIMIT 1",
            [normalizedEmail]
        );

        if (users.length === 0) {
            return res.status(400).send("Invalid email or password");
        }

        const user = users[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send("Invalid email or password");
        }

        res.status(201).json({
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        createdAt: user.created_at,
        });

    } catch (error) {
        console.error("Error during login:", error.message);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/logout', async (_, res) => {
    res.status(200).send("Logged out successfully");
    // needs to be implemented with JWT or session management for proper logout functionality
});


export default router;