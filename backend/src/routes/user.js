import express from "express";
import Joi from "joi";
import arcjetProtect from "../middleware/arcjet.js";
import { auth } from "../middleware/auth.js";
import { 
    getCurrentUser, 
    updateUser, 
    deleteUserById, 
    getCurrentUserForPUT,
    getAllUsers
} from "../controllers/user.js";

const router = express.Router();

router.get("/", arcjetProtect, auth, async (req, res) => {
    const users = await getAllUsers();

    res.json(users);
});

router.put("/:id", arcjetProtect, auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const targetId = req.params.id;

    const users = await getCurrentUserForPUT(targetId);
    const user = users[0];
    if (!user) return res.status(404).send("User not found");

    const full_name = req.body.full_name ?? user.full_name;
    const address = req.body.address ?? user.address;
    const password = req.body.password ?? user.password;

    await updateUser(targetId, password, full_name, address);

    const rows = await getCurrentUser(targetId);
    res.json(rows[0]);
});

router.delete("/:id",arcjetProtect, auth, async (req, res) => {
    await deleteUserById(req.params.id);

    res.status(204).send()
});

function validate(req) {
    let schema;

    schema = Joi.object({
        password: Joi.string().min(8).max(1024),
        full_name: Joi.string().min(3).max(50),
        address: Joi.string().min(10).max(500).allow(null, "")
    });

    return schema.validate(req);
}

export default router;
export { validate };