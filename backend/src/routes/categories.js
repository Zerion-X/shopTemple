import express from "express"
import Joi from "joi"
import { createCategory, getCategory, checkDuplicateNames } from "../controllers/categories.js";
import { auth } from "../middleware/auth.js";
import isAdmin from "../middleware/admin.js"
import arcjetProtect from "../middleware/arcjet.js";
const router = express.Router();

router.get("/", arcjetProtect, auth, async (req, res) => {
    const categories = await getCategory();
    
    res.json(categories);
});

router.post("/", arcjetProtect, auth, isAdmin, async (req, res) => {
    const { error } = validate(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const { name } = req.body;

    if (await checkDuplicateNames(name)) return res.status(409).send("Such name already exists");
    
    const id = await createCategory(name);

    res.status(201).json({ id, name });
});

function validate(req) {
  let schema;
  
  schema = Joi.object({
      name: Joi.string().min(3).max(45).required()
  });

  return schema.validate(req);
}

export default router;
export { validate };