import express from "express"
import Joi from "joi"
import { emailExists, createUser  } from "../controllers/signup.js"
import { authenticateUser } from "../controllers/login.js";
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
        
        if (await emailExists(email))  return res.status(400).send("Email already exists");

        const user = await createUser(full_name, email, password);

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
        const user = await authenticateUser(email, password);

        if (!user) return res.status(400).send("Invalid email or password");

        res.status(200).json({
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