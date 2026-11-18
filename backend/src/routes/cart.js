
import express from "express";
import Joi from "joi";
import { auth } from "../middleware/auth.js";
import arcjetProtect from "../middleware/arcjet.js";
import {
  getCartByUserId,
  validateProductId,
  getOrCreateCart,
  addCartItem,
  checkCartItem,
  updateCartItem,
  deleteCartItem,
  clearCart,
  touchCart
} from "../controllers/cart.js";

const router = express.Router();

router.get("/", arcjetProtect, auth, async (req, res) => {
  const userId = req.user.user_id;

  const cart = await getCartByUserId(userId);

  res.json(cart);
});

router.post("/items", arcjetProtect, auth, async (req, res) => {
  const { error } = validateAddItem(req.body);

  if (error)  return res.status(400).json({ error: error.details[0].message });
  
  const { product_id, quantity = 1 } = req.body;
  const userId = req.user.user_id;

  if (!(await validateProductId(product_id)))  return res.status(404).json({ error: "Product not found" });
  
  const cartId = await getOrCreateCart(userId);

  await addCartItem(cartId, product_id, quantity);
  await touchCart(userId);

  const cart = await getCartByUserId(userId);

  res.status(200).json(cart);
});

router.patch("/items/:product_id", arcjetProtect, auth, async (req, res) => {
  const productId = req.params.product_id;
  const userId = req.user.user_id;

  const { error: idError } = validateProductParam(productId);

  if (idError)  return res.status(400).json({ error: "Invalid product_id" });
  
  const { error } = validateQuantity(req.body);

  if (error) return res.status(400).json({ error: error.details[0].message });
  
  const { quantity } = req.body;

  if (!(await checkCartItem(userId, productId)))  return res.status(404).json({ error: "Cart item not found" });
  
  await updateCartItem(userId, productId, quantity);
  await touchCart(userId);

  const cart = await getCartByUserId(userId);

  res.json(cart);
});

router.delete("/items/:product_id", arcjetProtect, auth, async (req, res) => {
  const productId = req.params.product_id;
  const userId = req.user.user_id;

  const { error } = validateProductParam(productId);

  if (error)  return res.status(400).json({ error: "Invalid product_id" });
  
  const result = await deleteCartItem(userId, productId);

  if (result.affectedRows === 0)  return res.status(404).json({ error: "Cart item not found" });
  
  await touchCart(userId);

  res.status(204).send();
});

router.delete("/", arcjetProtect, auth, async (req, res) => {
  const userId = req.user.user_id;

  await clearCart(userId);
  await touchCart(userId);

  res.status(204).send();
});

function validateAddItem(req) {
  const schema = Joi.object({
    
    product_id: Joi.number().integer().positive().required(),

    quantity: Joi.number()
      .integer()
      .min(1)
      .max(1000)
      .optional()

  });

  return schema.validate(req);
}

function validateQuantity(req) {
  const schema = Joi.object({
    
    quantity: Joi.number()
      .integer()
      .min(1)
      .max(1000)
      .required()
      
  });

  return schema.validate(req);
}

function validateProductParam(productId) {
  const schema = Joi.number()
    .integer()
    .positive()
    .required();

  return schema.validate(productId);
}

export default router;

export {
  validateAddItem,
  validateQuantity
};
