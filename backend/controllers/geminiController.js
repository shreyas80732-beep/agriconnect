const Crop = require('../models/Crop');
const { fetchWeatherByCity } = require('./weatherController');
const { generateText, generateFromImage, safeParseJSON } = require('../utils/geminiClient');

/**
 * POST /api/recommend-crop
 * body: { city, soilType }
 * Combines live weather + MongoDB crop requirements, asks Gemini to rank
 * the best-suited crops (with an approximate current market price).
 */
const recommendCrop = async (req, res) => {
  try {
    const { city, soilType } = req.body;
    if (!city || !soilType) {
      return res.status(400).json({ error: 'city and soilType are required.' });
    }

    const weather = await fetchWeatherByCity(city);
    const crops = await Crop.find({}).lean();

    const cropSummary = crops.map((c) => ({
      name: c.cropName,
      tempRange: `${c.optimalTempMin}-${c.optimalTempMax}°C`,
      rainfall: c.optimalRainfall,
      soilType: c.soilType,
      fallbackPrice: c.averageMarketPrice,
    }));

    const prompt = `
You are an agricultural advisor for Indian farmers. Given the current weather and soil type below,
select the best-suited crops from the provided candidate list, considering their optimal temperature,
rainfall and soil compatibility. Also estimate a realistic current market price range in INR per quintal
(use your general knowledge; label it as an estimate).

Current weather in ${weather.city}:
- Temperature: ${weather.temperature}°C
- Humidity: ${weather.humidity}%
- Condition: ${weather.description}
- Recent rainfall: ${weather.rainfallLastHour} mm

Farmer's soil type: ${soilType}

Candidate crops (from database):
${JSON.stringify(cropSummary, null, 2)}

Respond ONLY with valid JSON (no markdown, no commentary) in this exact shape:
{
  "recommendations": [
    {
      "cropName": "string",
      "suitabilityScore": number (0-100),
      "reason": "string, 1-2 sentences",
      "estimatedMarketPrice": "string, e.g. '₹2100-2400 per quintal (estimate)'"
    }
  ],
  "summary": "string, 2-3 sentence overall advice"
}
`;

    const raw = await generateText(prompt);
    const parsed = safeParseJSON(raw);

    if (!parsed) {
      return res.json({ weather, raw, warning: 'Gemini response could not be parsed as JSON; showing raw text.' });
    }

    res.json({ weather, ...parsed });
  } catch (err) {
    console.error('recommendCrop error:', err.message);
    res.status(500).json({ error: 'Failed to generate crop recommendation.' });
  }
};

/**
 * POST /api/yield-prediction
 * body: { city, cropName, areaAcres, soilType, historicalYield (optional) }
 */
const predictYield = async (req, res) => {
  try {
    const { city, cropName, areaAcres, soilType, historicalYield } = req.body;
    if (!city || !cropName || !areaAcres) {
      return res.status(400).json({ error: 'city, cropName and areaAcres are required.' });
    }

    const weather = await fetchWeatherByCity(city);
    const crop = await Crop.findOne({ cropName: new RegExp(`^${cropName}$`, 'i') }).lean();

    const prompt = `
You are an agronomist estimating crop yield for an Indian farmer.

Crop: ${cropName}
Area: ${areaAcres} acres
Soil type: ${soilType || 'Not specified'}
Historical yield (if provided): ${historicalYield || 'Not provided'}

Crop reference data: ${crop ? JSON.stringify(crop) : 'Not found in database, use general knowledge.'}

Current weather in ${weather.city}:
- Temperature: ${weather.temperature}°C
- Humidity: ${weather.humidity}%
- Condition: ${weather.description}

Estimate the expected yield per acre and total yield, accounting for current weather conditions
relative to the crop's optimal range. Respond ONLY with valid JSON, no markdown:
{
  "expectedYieldPerAcre": "string with units, e.g. '18-20 quintals/acre'",
  "expectedTotalYield": "string with units",
  "confidence": "Low | Medium | High",
  "factorsConsidered": ["string", "string"],
  "recommendation": "string, 2-3 sentences on how to improve yield"
}
`;

    const raw = await generateText(prompt);
    const parsed = safeParseJSON(raw);

    if (!parsed) {
      return res.json({ weather, raw, warning: 'Gemini response could not be parsed as JSON; showing raw text.' });
    }

    res.json({ weather, ...parsed });
  } catch (err) {
    console.error('predictYield error:', err.message);
    res.status(500).json({ error: 'Failed to generate yield prediction.' });
  }
};

/**
 * POST /api/detect-disease
 * multipart/form-data with field "image"
 */
const detectDisease = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'An image file is required.' });

    const base64Data = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;

    const prompt = `
You are a plant pathologist analyzing a photo of a crop leaf/plant uploaded by a farmer.
Identify visible signs of disease, pest damage, or nutrient deficiency. If the plant looks healthy, say so.

Respond ONLY with valid JSON, no markdown:
{
  "isHealthy": boolean,
  "diagnosis": "string - disease/pest/deficiency name, or 'Healthy'",
  "confidence": "Low | Medium | High",
  "symptomsObserved": ["string", "string"],
  "preventionSteps": ["string", "string", "string"],
  "recommendedTreatment": "string"
}
`;

    const raw = await generateFromImage(prompt, base64Data, mimeType);
    const parsed = safeParseJSON(raw);

    if (!parsed) {
      return res.json({ raw, warning: 'Gemini response could not be parsed as JSON; showing raw text.' });
    }

    res.json(parsed);
  } catch (err) {
    console.error('detectDisease error:', err.message);
    res.status(500).json({ error: 'Failed to analyze the image.' });
  }
};

/**
 * POST /api/fertilizer-guide
 * body: { cropName, soilCondition, growthStage }
 */
const fertilizerGuide = async (req, res) => {
  try {
    const { cropName, soilCondition, growthStage } = req.body;
    if (!cropName || !growthStage) {
      return res.status(400).json({ error: 'cropName and growthStage are required.' });
    }

    const crop = await Crop.findOne({ cropName: new RegExp(`^${cropName}$`, 'i') }).lean();

    const prompt = `
You are an agricultural fertilizer expert advising an Indian farmer.

Crop: ${cropName}
Soil condition: ${soilCondition || 'Not specified'}
Growth stage: ${growthStage}

Database fertilizer reference (may be partial): ${crop ? JSON.stringify(crop.fertilizerGuide) : 'Not available'}

Provide a tailored fertilizer schedule for this growth stage, including the best-recommended fertilizer
product/type and an approximate current market price in INR. Respond ONLY with valid JSON, no markdown:
{
  "growthStage": "string",
  "recommendedFertilizer": "string - name/type",
  "applicationRate": "string, e.g. '50 kg/acre'",
  "applicationMethod": "string",
  "estimatedPrice": "string, e.g. '₹1200-1400 per 50kg bag (estimate)'",
  "additionalTips": ["string", "string"]
}
`;

    const raw = await generateText(prompt);
    const parsed = safeParseJSON(raw);

    if (!parsed) {
      return res.json({ raw, warning: 'Gemini response could not be parsed as JSON; showing raw text.' });
    }

    res.json(parsed);
  } catch (err) {
    console.error('fertilizerGuide error:', err.message);
    res.status(500).json({ error: 'Failed to generate fertilizer guide.' });
  }
};

module.exports = { recommendCrop, predictYield, detectDisease, fertilizerGuide };
