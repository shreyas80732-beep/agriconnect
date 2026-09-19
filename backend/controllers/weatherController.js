const axios = require('axios');

const OWM_BASE = 'https://api.openweathermap.org/data/2.5';

/**
 * Core helper: fetches current weather for a city from OpenWeatherMap.
 * Reused by other controllers (crop recommendation, yield prediction).
 */
async function fetchWeatherByCity(city) {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) throw new Error('OPENWEATHER_API_KEY is not configured on the server.');

  const { data } = await axios.get(`${OWM_BASE}/weather`, {
    params: { q: city, appid: apiKey, units: 'metric' },
  });

  return {
    city: data.name,
    country: data.sys?.country,
    temperature: data.main?.temp,
    feelsLike: data.main?.feels_like,
    humidity: data.main?.humidity,
    pressure: data.main?.pressure,
    windSpeed: data.wind?.speed,
    condition: data.weather?.[0]?.main,
    description: data.weather?.[0]?.description,
    rainfallLastHour: data.rain?.['1h'] || 0,
    icon: data.weather?.[0]?.icon,
  };
}

/**
 * Fetches a short-term forecast (5 day / 3 hour) used to derive alerts
 * such as heavy rain, storms, or extreme temperature swings.
 */
async function fetchForecastByCity(city) {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) throw new Error('OPENWEATHER_API_KEY is not configured on the server.');

  const { data } = await axios.get(`${OWM_BASE}/forecast`, {
    params: { q: city, appid: apiKey, units: 'metric' },
  });

  const alerts = [];
  const next24h = (data.list || []).slice(0, 8); // 8 x 3hr blocks = 24h

  next24h.forEach((block) => {
    const main = block.weather?.[0]?.main?.toLowerCase() || '';
    if (main.includes('storm') || main.includes('thunderstorm')) {
      alerts.push(`Thunderstorm expected around ${block.dt_txt}`);
    }
    if (block.rain && block.rain['3h'] > 10) {
      alerts.push(`Heavy rainfall (${block.rain['3h']}mm) expected around ${block.dt_txt}`);
    }
    if (block.main?.temp > 42) {
      alerts.push(`Extreme heat (${block.main.temp}°C) expected around ${block.dt_txt}`);
    }
  });

  return {
    forecast: next24h.map((b) => ({
      time: b.dt_txt,
      temp: b.main?.temp,
      humidity: b.main?.humidity,
      condition: b.weather?.[0]?.main,
      rain: b.rain?.['3h'] || 0,
    })),
    alerts,
  };
}

// POST /api/weather  { city }
const getWeather = async (req, res) => {
  try {
    const { city } = req.body;
    if (!city) return res.status(400).json({ error: 'City is required.' });

    const [current, forecastData] = await Promise.all([
      fetchWeatherByCity(city),
      fetchForecastByCity(city).catch(() => ({ forecast: [], alerts: [] })),
    ]);

    res.json({ current, ...forecastData });
  } catch (err) {
    console.error('getWeather error:', err.message);
    res.status(500).json({ error: 'Unable to fetch weather data. Check the city name and try again.' });
  }
};

module.exports = { getWeather, fetchWeatherByCity, fetchForecastByCity };
