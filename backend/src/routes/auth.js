import express from "express"
import Joi from "joi"
import { emailExists, createUser  } from "../controllers/signup.js"
import { authenticateUser } from "../controllers/login.js";
import { generateAuthToken } from "../utils/jwt.js";
const router = express.Router();


router.post('/signup', async (req, res) => {
    try {
        const {error} = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const {full_name, email, password} = req.body;
        
        if (await emailExists(email))  return res.status(400).send("Email already exists");

        const { user, userId } = await createUser(full_name, email, password);

        const token = generateAuthToken(userId, user.role);

        res
            .header("x-auth-token", token)
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

router.post('/login', async (req, res) => {
    const { error } = validate(req.body, false);
    if (error) return res.status(400).send(error.details[0].message);

    const {email, password} = req.body;

    try {
        const { user, userId } = await authenticateUser(email, password);

        if (!user) return res.status(401).send("Invalid email or password");

        const token = generateAuthToken(userId, user.role);

        res
            .header("x-auth-token", token)
            .json({
                user_id: user.user_id,
                full_name: user.full_name,
                email: user.email
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