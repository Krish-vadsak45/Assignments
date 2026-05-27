import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  // AI Generated Meta-data
  category: {
    type: String,
    required: true,
    index: true,
  },
  subCategory: {
    type: String,
  },
  seoTags: [
    {
      type: String,
    },
  ],
  sustainabilityFilters: [
    {
      type: String,
      enum: [
        "plastic-free",
        "compostable",
        "vegan",
        "recycled",
        "reusable",
        "biodegradable",
      ],
    },
  ],
  // Impact Factors (Snapshot data for calculations)
  impactMetrics: {
    plasticSavedFactor: { type: Number, default: 0.1 }, // e.g. 0.1kg per unit
    carbonAvoidedFactor: { type: Number, default: 0.5 }, // e.g. 0.5kg per unit
    isLocallySourced: { type: Boolean, default: false },
  },
  aiProcessingStatus: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Product", productSchema);
