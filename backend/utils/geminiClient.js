const { GoogleGenerativeAI } = require('@google/generative-ai');

if (!process.env.GEMINI_API_KEY) {
  console.warn('WARNING: GEMINI_API_KEY is not set. Gemini-powered routes will fail.');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const PRIMARY_MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
const FALLBACK_MODELS = [
  'gemini-3.1-flash-lite-preview',
  'gemini-3.1-flash-lite',
  'gemini-flash-latest',
];

/**
 * Send a plain text prompt to Gemini with fast failover.
 */
async function generateText(prompt) {
  const candidateModels = [
    PRIMARY_MODEL,
    ...FALLBACK_MODELS,
  ];

  for (const m of candidateModels) {
    try {
      const textModel = genAI.getGenerativeModel({ model: m });
      const withTimeout = Promise.race([
        textModel.generateContent(prompt),
        new Promise((_, reject) => setTimeout(() => reject(new Error(`Timeout on ${m}`)), 5000)),
      ]);
      const res = await withTimeout;
      return res.response.text();
    } catch (err) {
      console.warn(`Text model ${m} issue (${err.message}). Trying fallback...`);
    }
  }

  throw new Error('All text models failed.');
}

/**
 * Send a prompt + image (base64) to Gemini Vision with fast failover.
 * @param {string} prompt
 * @param {string} base64Data - raw base64 (no data: prefix)
 * @param {string} mimeType - e.g. 'image/jpeg'
 */
async function generateFromImage(prompt, base64Data, mimeType) {
  const payload = [
    prompt,
    {
      inlineData: {
        data: base64Data,
        mimeType: mimeType || 'image/jpeg',
      },
    },
  ];

  // Prioritize verified fast multimodal models so disease diagnosis completes in ~2s
  const candidateModels = [
    'gemini-3.1-flash-lite-preview',
    PRIMARY_MODEL,
    'gemini-3.1-flash-lite',
    'gemini-flash-latest',
  ];

  for (const m of candidateModels) {
    try {
      const visionModel = genAI.getGenerativeModel({ model: m });
      const withTimeout = Promise.race([
        visionModel.generateContent(payload),
        new Promise((_, reject) => setTimeout(() => reject(new Error(`Timeout on ${m}`)), 6000)),
      ]);
      const res = await withTimeout;
      return res.response.text();
    } catch (err) {
      console.warn(`Vision model ${m} issue (${err.message}). Trying next candidate...`);
    }
  }

  throw new Error('All vision models failed to analyze image.');
}

/**
 * Attempts to parse a Gemini text response as JSON.
 * Robustly strips markdown code fences and extracts { ... } JSON objects.
 */
function safeParseJSON(rawText) {
  if (!rawText) return null;
  try {
    const cleaned = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (err) {
    try {
      const match = rawText.match(/\{[\s\S]*\}/);
      if (match) {
        return JSON.parse(match[0]);
      }
    } catch (e2) {
      return null;
    }
    return null;
  }
}

module.exports = { generateText, generateFromImage, safeParseJSON };
