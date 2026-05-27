import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import impactRoutes from "./routes/impactRoutes.js";
import { errorHandler } from "./utils/errorMiddleware.js";

// Initialize Express
const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors());

// Database Connection
connectDB();

// Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/impact", impactRoutes);

// Health Check
app.get("/", (req, res) => {
  res.send("Rayeva AI Backend is running...");
});

// Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
