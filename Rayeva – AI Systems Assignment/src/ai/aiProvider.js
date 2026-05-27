import genAI from "../config/aiConfig.js";

/**
 * Generic function to generate structured JSON from AI
 * @param {string} systemPrompt - Instruction for the AI
 * @param {string} userPrompt - Current task input
 * @returns {Promise<object>} - Parsed JSON object
 */
const generateJSON = async (
  systemPrompt,
  userPrompt,
  modelName = "gemini-1.5-flash",
) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Gemini API Key is missing");
    }

    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: systemPrompt,
    });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const response = result.response;
    const text = response.text();
    const parsedData = JSON.parse(text);

    return {
      success: true,
      data: parsedData,
      raw: text,
      usage: result.usageMetadata,
    };
  } catch (error) {
    console.error("AI Service Error:", error.message);
    return {
      success: false,
      error: error.message,
    };
  }
};

export { generateJSON };
