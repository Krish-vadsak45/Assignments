import { generateJSON } from "../ai/aiProvider.js";
import AIRequestLog from "../models/AIRequestLog.js";
import { CATEGORIES } from "../utils/categories.js";

/**
 * Service to generate categories and metadata for a product
 * @param {string} title
 * @param {string} description
 */
const generateCategoryData = async (title, description) => {
  const systemPrompt = `
You are an intelligent categorization AI for a sustainable e-commerce platform.
Your response must be a strictly valid JSON object. Do not include any explanation or markdown formatting outside the JSON.
  `;

  const userPrompt = `
Analyze the following product and generate categorization data.

Product Title: "${title}"
Product Description: "${description}"

Requirements:
1. Assign a "primary_category" strictly from this allowed list: [${CATEGORIES.join(", ")}].
2. Suggest a specific "sub_category".
3. Generate 5-10 "seo_tags" relevant to the product.
4. Identify applicable "sustainability_filters" ONLY from this list: ["plastic-free", "compostable", "vegan", "recycled", "reusable", "biodegradable"]. If none apply, return an empty array.

Return EXACTLY this JSON structure:
{
  "primary_category": "Category Name",
  "sub_category": "Sub Category Name",
  "seo_tags": ["tag1", "tag2"],
  "sustainability_filters": ["filter1", "filter2"]
}
  `;

  const logEntry = new AIRequestLog({
    endpoint: "category-generation",
    prompt: userPrompt,
    provider: "gemini",
  });

  try {
    const aiResponse = await generateJSON(systemPrompt, userPrompt);

    // Log raw response
    if (aiResponse.raw) {
      logEntry.responseRaw = aiResponse.raw;
    }

    if (!aiResponse.success) {
      logEntry.status = "failed";
      logEntry.error = aiResponse.error;
      await logEntry.save();
      throw new Error(`AI generation failed: ${aiResponse.error}`);
    }

    const data = aiResponse.data;
    logEntry.responseParsed = data;
    logEntry.status = "success";

    // Basic Validation of the AI output
    if (!CATEGORIES.includes(data.primary_category)) {
      // Fallback or Error? Ideally we might retry or pick "Other"
      // For this assignment, we'll flag it or default if close enough.
      // Strict requirement says: "Enforce category validation".
      // Let's check for case-insensitive match or throw error.
      const match = CATEGORIES.find(
        (c) => c.toLowerCase() === data.primary_category.toLowerCase(),
      );
      if (match) {
        data.primary_category = match;
      } else {
        // Create a warning but maybe allow saving with a flag or throw?
        // User requirement: "Enforce category validation (must match predefined list)"
        // We will throw an error to trigger a retry or manual review in a real app.
        // Here, we'll log the error.
        throw new Error(
          `AI returned invalid category: ${data.primary_category}. Allowed: ${CATEGORIES.join(", ")}`,
        );
      }
    }

    await logEntry.save();
    return data;
  } catch (error) {
    logEntry.status = "failed";
    logEntry.error = error.message;
    await logEntry.save();
    throw error;
  }
};

export { generateCategoryData };
