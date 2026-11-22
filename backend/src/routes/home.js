import express from "express";
import arcjetProtect from "../middleware/arcjet.js";
import {
  getBestSellers,
  getNewestProducts,
  getBudgetPicks,
  getCategoryProducts,
} from "../controllers/home.js";

const router = express.Router();

router.use(arcjetProtect);

router.get("/best-sellers", getBestSellers);
router.get("/newest", getNewestProducts);
router.get("/budget-picks", getBudgetPicks);
router.get("/category/:id", getCategoryProducts);

export default router;