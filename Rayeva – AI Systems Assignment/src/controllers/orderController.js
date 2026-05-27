import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { generateImpactReport } from "../services/impactService.js";
import asyncHandler from "../utils/asyncHandler.js";

// @desc    Create new order and generate impact report
// @route   POST /api/impact/create-order
// @access  Public
const createOrder = asyncHandler(async (req, res) => {
  const { items, totalAmount } = req.body;

  if (!items || !items.length) {
    res.status(400);
    throw new Error("No items in order");
  }

  // 1. Hydrate items with product impact metrics (Simulating a real checkout fetch)
  // In a real app, we'd fetch products by ID from DB to get the factors.
  // For this assignment, we'll try to fetch if productId is valid, or rely on request if testing.
  // Let's implement fetching from DB to be "production-ready".

  const hydratedItems = [];

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) {
      throw new Error(`Product not found: ${item.productId}`);
    }

    hydratedItems.push({
      productId: product._id,
      productName: product.name,
      quantity: item.quantity,
      plasticSavedFactor: product.impactMetrics
        ? product.impactMetrics.plasticSavedFactor
        : 0,
      carbonAvoidedFactor: product.impactMetrics
        ? product.impactMetrics.carbonAvoidedFactor
        : 0,
      isLocallySourced: product.impactMetrics
        ? product.impactMetrics.isLocallySourced
        : false,
    });
  }

  // 2. Create the Order object (but don't save yet, or save pending)
  const order = new Order({
    items: hydratedItems,
    totalAmount,
    status: "pending",
  });

  // 3. Generate Impact Report
  // We pass the hydrated items which contain the factors
  try {
    const impactReport = await generateImpactReport({ items: hydratedItems });
    order.impactReport = impactReport;

    // 4. Save Order
    await order.save();

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    // If AI fails, we still might want to save the order but without the report?
    // Requirement says "Store structured output in Product/Order".
    // "Proper error handling if AI returns invalid JSON".
    // We'll save the order with a warning.
    console.error(
      "Impact report generation failed, saving order without report.",
      error,
    );
    order.status = "completed_no_report";
    await order.save();

    res.status(201).json({
      success: true,
      message: "Order created but impact report generation failed",
      order,
    });
  }
});

export { createOrder };
