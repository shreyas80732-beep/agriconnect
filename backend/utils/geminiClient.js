const { GoogleGenerativeAI } = require('@google/generative-ai');

if (!process.env.GEMINI_API_KEY) {
  console.warn('WARNING: GEMINI_API_KEY is not set. Gemini-powered routes will fail.');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// gemini-1.5-flash was retired; gemini-2.5-flash is the current
// generally-available lightweight model and handles both text and
// multimodal (image) input, so one model covers both use cases here.
const textModel = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });
const visionModel = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });

/**
 * Send a plain text prompt to Gemini and return the raw text response.
 */
async function generateText(prompt) {
  const result = await textModel.generateContent(prompt);
  return result.response.text();
}

/**
 * Send a prompt + image (base64) to Gemini Vision for multimodal analysis.
 * @param {string} prompt
 * @param {string} base64Data - raw base64 (no data: prefix)
 * @param {string} mimeType - e.g. 'image/jpeg'
 */
async function generateFromImage(prompt, base64Data, mimeType) {
  const result = await visionModel.generateContent([
    prompt,
    {
      inlineData: {
        data: base64Data,
        mimeType,
      },
    },
  ]);
  return result.response.text();
}

/**
 * Attempts to parse a Gemini text response as JSON.
 * Strips markdown code fences if present.
 */
function safeParseJSON(rawText) {
  try {
    const cleaned = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    return null;
  }
}

module.exports = { generateText, generateFromImage, safeParseJSON };
