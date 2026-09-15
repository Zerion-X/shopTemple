import express from "express";
import Joi from "joi";
import { auth } from "../middleware/auth.js";
import isAdmin from "../middleware/admin.js"
import arcjetProtect from "../middleware/arcjet.js";
import upload from "../middleware/upload.js";
import { uploadToCloudinary } from "../lib/cloudinaryUpload.js";
import cloudinary from "../lib/cloudinary.js";
import { 
    getBrands, 
    createBrand, 
    selectBrandbyId, 
    updateBrands, 
    getUpdateBrandbyId, 
    selectImagePublicId, 
    deleteBrandbyId, 
    checkDuplicateNames, 
    checkDuplicateNameForUpdate 
} from "../controllers/brands.js";

const router = express.Router();

router.get("/", arcjetProtect, async (req, res) => {
    const brands = await getBrands();
    
    res.json(brands);
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
            "shop-temple/brands"
        );

        imageUrl = result.secure_url;
        imagePublicId = result.public_id;
    }

    const result = await createBrand(name, imageUrl, imagePublicId);
        
    const brandId = result.insertId;
    
    const rows = await selectBrandbyId(brandId);
    
    res.status(201).json(rows[0]);

});

router.patch("/:id", arcjetProtect, auth, isAdmin, upload.single("image"), async (req, res) => {
    const brandId = req.params.id;

    const rows = await selectBrandbyId(brandId);

    if (rows.length === 0)  return res.status(404).json({ error: "Brand not found" });
    
    const brand = rows[0];

    if (Object.keys(req.body).length > 0) {
        const { error } = validateUpdate(req.body);

        if (error)  return res.status(400).json({ error: error.details[0].message });

    }

    const fieldsToUpdate = {};

    if (req.body.name !== undefined) {
        if (await checkDuplicateNameForUpdate(req.body.name, brandId)) {
            return res.status(409).json({ error: "Such name already exists" });
        }

        fieldsToUpdate.name = req.body.name;
    }

    let oldImagePublicId = null;

    if (req.file) {
        const result = await uploadToCloudinary(
            req.file.buffer,
            "shop-temple/brands"
        );

        fieldsToUpdate.image_url = result.secure_url;
        fieldsToUpdate.image_public_id = result.public_id;

        oldImagePublicId = brand.image_public_id;
    }

    if (Object.keys(fieldsToUpdate).length === 0)   return res.status(400).json({ error: "No fields to update" });
    
    const setClause = Object.keys(fieldsToUpdate)
        .map(field => `${field} = ?`)
        .join(", ");

    const values = Object.values(fieldsToUpdate);
    values.push(brandId);

    await updateBrands(setClause, values)

    if (oldImagePublicId) {
        await cloudinary.uploader.destroy(oldImagePublicId);
    }

    const updatedRows = await getUpdateBrandbyId(brandId);

    return res.json(updatedRows[0]);

});

router.delete("/:id", arcjetProtect, auth, isAdmin, async (req, res) => {
    const brandId = req.params.id;

    const rows = await selectImagePublicId(brandId);

    if (rows.length === 0)  return res.status(404).json({ error: "Brand not found" });
    
    const brand = rows[0];

    if (brand.image_public_id) {
        await cloudinary.uploader.destroy(
            brand.image_public_id
        );
    }

    await deleteBrandbyId(brandId);

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