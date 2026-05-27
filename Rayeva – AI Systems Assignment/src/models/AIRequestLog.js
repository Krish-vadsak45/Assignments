import mongoose from "mongoose";

const aiRequestLogSchema = new mongoose.Schema({
  endpoint: {
    type: String,
    required: true,
  },
  prompt: {
    type: String,
    required: true,
  },
  provider: {
    type: String,
    default: "gemini",
  },
  responseRaw: {
    type: String,
  },
  responseParsed: {
    type: mongoose.Schema.Types.Mixed,
  },
  tokensUsed: {
    type: Number,
  },
  status: {
    type: String,
    enum: ["success", "failed"],
    default: "success",
  },
  error: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("AIRequestLog", aiRequestLogSchema);
