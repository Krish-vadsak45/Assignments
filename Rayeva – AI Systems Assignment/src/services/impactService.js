import { generateJSON } from "../ai/aiProvider.js";
import AIRequestLog from "../models/AIRequestLog.js";
import { calculateImpact } from "../utils/impactCalculator.js";

/**
 * Generate a human-readable impact report using AI
 * @param {Object} orderData - The order object with items
 */
const generateImpactReport = async (orderData) => {
  // 1. Perform deterministic calculations (Business Logic)
  const metrics = calculateImpact(orderData.items);

  // 2. Prepare AI Prompt
  const systemPrompt = `
You are a sustainability impact reporter. 
Your goal is to take raw environmental usage data and convert it into a valid JSON summary.
Do not recalculate the numbers. Use the provided totals.
  `;

  const userPrompt = `
Generate a friendly impact report for the following order metrics:

- Total Plastic Saved: ${metrics.plasticSavedKg} kg
- Total Carbon Avoided: ${metrics.carbonAvoidedKg} kg
- Locally Sourced Items: ${metrics.locallySourcedCount}

Output valid JSON strictly in this format:
{
  "plastic_saved_kg": ${metrics.plasticSavedKg}, 
  "carbon_avoided_kg": ${metrics.carbonAvoidedKg},
  "local_sourcing_summary": "Short text about supporting local artisans if applicable, else empty string",
  "impact_statement": "A single sentence summary celebrating the customer's impact (e.g. 'Your order kept 2.5kg of plastic out of the ocean!')"
}
  `;

  const logEntry = new AIRequestLog({
    endpoint: "impact-generation",
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

    // Verify AI didn't hallucinate numbers (Optional but good practice)
    // We treat the AI's "plastic_saved_kg" as display value, but we trust our calculated "metrics" more.
    // However, the requirement says "AI only formats narrative summary".
    // So we should merge our calculated metrics with the AI's narrative to be safe.

    const finalReport = {
      plasticSavedKg: metrics.plasticSavedKg, // Trust our math
      carbonAvoidedKg: metrics.carbonAvoidedKg, // Trust our math
      localSourcingSummary: data.local_sourcing_summary,
      impactStatement: data.impact_statement,
      generatedAt: new Date(),
    };

    await logEntry.save();
    return finalReport;
  } catch (error) {
    logEntry.status = "failed";
    logEntry.error = error.message;
    await logEntry.save();
    throw error;
  }
};

export { generateImpactReport };
