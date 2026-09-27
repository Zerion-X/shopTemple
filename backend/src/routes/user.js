import express from "express";
import Joi from "joi";
import arcjetProtect from "../middleware/arcjet.js";
import { auth } from "../middleware/auth.js";
import { 
    getCurrentUser, 
    updateUser, 
    deleteUserById, 
    emailExistsForOtherUser,
    getCurrentUserForPUT
} from "../controllers/user.js";

const router = express.Router();

router.get("/", arcjetProtect, auth, async (req, res) => {
    const users = await getCurrentUser(req.user.user_id);

    if ( users.length === 0)    return res.status(404).send("User not found");

    res.json(users[0]);
});

router.put("/", arcjetProtect, auth, async (req, res) => {
    const { error } = validate(req.body);

    if (error)  return res.status(400).send(error.details[0].message);

    const users = await getCurrentUserForPUT(req.user.user_id);
    const user = users[0];

    const email = req.body.email ?? user.email;
    
    const password = req.body.password ?? user.password;
    
    const full_name = req.body.full_name ?? user.full_name;
    
    const address = req.body.address ?? user.address;

    if (await emailExistsForOtherUser(email, req.user.user_id))  return res.status(400).send("Email already exists");

    await updateUser(req.user.user_id, email, password, full_name, address);

    const rows = await getCurrentUser(req.user.user_id);

    res.json(rows[0]);

});

router.delete("/",arcjetProtect, auth, async (req, res) => {
    await deleteUserById(req.user.user_id);

    res.status(204).send()
});

function validate(req) {
    let schema;

    schema = Joi.object({
        email: Joi.string().min(5).max(255).email(),
        password: Joi.string().min(8).max(1024),
        full_name: Joi.string().min(3).max(50),
        address: Joi.string().min(10).max(500).allow(null, "")
    });

    return schema.validate(req);
}

export default router;
export { validate };