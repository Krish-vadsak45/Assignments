import express from "express";
import {
  analyzeProduct,
  createProductWithAI,
} from "../controllers/productController.js";

const router = express.Router();

router.post("/analyze", analyzeProduct);
router.post("/create-product", createProductWithAI);

export default router;
