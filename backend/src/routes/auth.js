import express from "express"
import Joi from "joi"
import { emailExists, createUser  } from "../controllers/signup.js"
import { authenticateUser } from "../controllers/login.js";
import { generateAuthToken } from "../lib/utils.js";
import { auth } from "../middleware/auth.js";
import arcjetProtect from "../middleware/arcjet.js";
import { pool } from "../lib/db.js";
const router = express.Router();

router.get("/me", arcjetProtect, auth, async (req, res) => {
    const [users] = await pool.execute(
        `SELECT
            user_id,
            full_name,
            email,
            role,
            created_at
        FROM users
        WHERE user_id = ?
        LIMIT 1`,
        [req.user.user_id]
    );

    if (users.length === 0)  return res.status(404).send("User not found");
    
    res.json(users[0]);
});


router.post('/signup',arcjetProtect, async (req, res) => {
    try {
        const {error} = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const {full_name, email, password} = req.body;
        
        if (await emailExists(email))  return res.status(400).send("Email already exists");

        const user = await createUser(full_name, email, password);

        generateAuthToken(user, res);

        res
            .status(201)
            .json({
                user_id: user.user_id,
                full_name: user.full_name,
                email: user.email
            });

    } catch (error) {
        console.error("Error during signup:", error.message);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/login', arcjetProtect, async (req, res) => {
    const { error } = validate(req.body, false);
    if (error) return res.status(400).send(error.details[0].message);

    const {email, password} = req.body;

    try {
        const result = await authenticateUser(email, password);

        if (!result) return res.status(401).send("Invalid email or password");

        const user = result;

        generateAuthToken(user, res);

        res.json({
                user_id: user.user_id,
                full_name: user.full_name,
                email: user.email
            });

    } catch (error) {
        console.error("Error during login:", error.message);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/logout', arcjetProtect, async (_, res) => {
    res.cookie("jwt", "", {maxAge : 0});
    res.status(200).send("Logged out successfully");
});


function validate(req, mode=true) { // mode=true -> signup | mode=false -> login
    let schema;
    
    if (mode) {
        schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(8).max(1024).required(),
        full_name: Joi.string().min(3).max(50).required()
        });
   }
    else {
        schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(8).max(1024).required(),
        });
    }

  return schema.validate(req);
}

export default router;