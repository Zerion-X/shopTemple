import express from "express";
import { auth } from "../middleware/auth.js";
import isAdmin from "../middleware/admin.js"
import arcjetProtect from "../middleware/arcjet.js";

import {
  createOrderFromCart,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
} from '../controllers/orders.js';

const router = express.Router();

router.use(arcjetProtect);
router.use(auth);

router.post('/', createOrderFromCart);

router.get('/my-orders', getUserOrders);

router.get('/', isAdmin, getAllOrders);

router.get('/:id', getOrderById);

router.patch('/:id/status', isAdmin, updateOrderStatus);

export default router;
