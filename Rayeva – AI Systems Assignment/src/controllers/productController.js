import Product from "../models/Product.js";
import { generateCategoryData } from "../services/categoryService.js";
import asyncHandler from "../utils/asyncHandler.js";

// @desc    Analyze product and generate metadata (Preview only, does not save to DB)
// @route   POST /api/categories/analyze
// @access  Public
const analyzeProduct = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    res.status(400);
    throw new Error("Please provide product title and description");
  }

  const aiResult = await generateCategoryData(title, description);

  res.json({
    success: true,
    data: aiResult,
  });
});

// @desc    Create new product with AI categorization
// @route   POST /api/categories/create-product
// @access  Public
const createProductWithAI = asyncHandler(async (req, res) => {
  const { title, description, price } = req.body;

  if (!title || !description || !price) {
    res.status(400);
    throw new Error("Please provide title, description, and price");
  }

  // 1. Call AI Service
  const aiResult = await generateCategoryData(title, description);

  // 2. Create Product
  const product = await Product.create({
    name: title,
    description,
    price,
    category: aiResult.primary_category,
    subCategory: aiResult.sub_category,
    seoTags: aiResult.seo_tags,
    sustainabilityFilters: aiResult.sustainability_filters,
    aiProcessingStatus: "completed",
  });

  res.status(201).json({
    success: true,
    product,
  });
});

export { analyzeProduct, createProductWithAI };
