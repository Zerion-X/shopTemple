import express from "express";
import Joi from "joi";
import { createCategory, getCategory, checkDuplicateNames, selectCatbyId, updateCat, getUpdatedCatbyId, selectImagePublicId, deleteCatbyId } from "../controllers/categories.js";
import { auth } from "../middleware/auth.js";
import isAdmin from "../middleware/admin.js"
import upload from "../middleware/upload.js";
import { uploadToCloudinary } from "../lib/cloudinaryUpload.js";
import cloudinary from "../lib/cloudinary.js";
import arcjetProtect from "../middleware/arcjet.js";
const router = express.Router();

router.get("/", arcjetProtect, async (req, res) => {
    
    const categories = await getCategory();
    
    res.json(categories);
});

router.post("/", arcjetProtect, auth, isAdmin, upload.single("image"), async (req, res) => {
    const { error } = validate(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    const { name } = req.body;

    if (await checkDuplicateNames(name)) return res.status(409).send("Such name already exists");

    let imageUrl = null;
    let imagePublicId = null;

    if (req.file) {

        const result = await uploadToCloudinary(
            req.file.buffer,
            "shop-temple/categories"
        );

        imageUrl = result.secure_url;
        imagePublicId = result.public_id;
    }

    const result = await createCategory(name, imageUrl, imagePublicId);
        
    const categoryId = result.insertId;
    const rows = await selectCatbyId(categoryId);
    
    res.status(201).json(rows[0]);
});

router.patch("/:id", arcjetProtect, auth, isAdmin, upload.single("image"), async (req, res) => {
    const categoryId = req.params.id;

    const rows = await selectCatbyId(categoryId)
        
    if (rows.length === 0)  return res.status(404).json({ error: "category not found" });
        
    const category = rows[0];

    if (Object.keys(req.body).length > 0) {
        const { error } = validateUpdate(req.body);

        if (error)  return res.status(400).json({ error: error.details[0].message });   
    
    }

    const fieldsToUpdate = {};

    if (req.body.name !== undefined) {
        fieldsToUpdate.name = req.body.name;
    }

    let oldImagePublicId = null;

    if (req.file) {
        const result = await uploadToCloudinary(
            req.file.buffer,
            "shop-temple/categories"
        );

        fieldsToUpdate.image_url = result.secure_url;
        fieldsToUpdate.image_public_id = result.public_id;

        oldImagePublicId = category.image_public_id;
    }

    if (Object.keys(fieldsToUpdate).length === 0)   return res.status(400).json({ error: "No fields to update" });
        

    const setClause = Object.keys(fieldsToUpdate)
        .map(field => `${field} = ?`)
        .join(", ");

    const values = Object.values(fieldsToUpdate);
    values.push(categoryId);

    await updateCat(setClause, values);

    if (oldImagePublicId)   await cloudinary.uploader.destroy(oldImagePublicId);
        

    const updatedRows = await getUpdatedCatbyId(categoryId)
    
    return res.json(updatedRows[0]);
});

router.delete("/:id", arcjetProtect, auth, isAdmin, async (req, res) => {

    const categoryId = req.params.id;

    const rows = await selectImagePublicId(categoryId);

    if (rows.length === 0)  return res.status(404).json({ error: "category not found" });
        

    const category = rows[0];

    if (category.image_public_id) {
        await cloudinary.uploader.destroy(
            category.image_public_id
        );
    }

    await deleteCatbyId(categoryId);

    return res.status(204).send();
});

function validate(req) {
  let schema;
  
  schema = Joi.object({
      name: Joi.string().min(3).max(45).required()
  });

  return schema.validate(req);
}

function validateUpdate(req) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(45)
    });

    return schema.validate(req);
}

export default router;
export { validate };
