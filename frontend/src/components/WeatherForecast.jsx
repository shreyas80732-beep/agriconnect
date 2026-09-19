import React, { useState } from 'react';
import { CloudSun, Droplets, Wind, AlertTriangle, Thermometer } from 'lucide-react';
import Modal from './Modal';
import LoadingSpinner from './LoadingSpinner';
import { getWeather } from '../api/api';

export default function WeatherForecast({ onClose }) {
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!city) return setError('Please enter a city name.');
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const data = await getWeather(city);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to fetch weather. Please check the city name.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Weather Forecast" icon={CloudSun} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name e.g. Hyderabad"
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button type="submit" disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold px-6 rounded-xl transition-colors">
          {loading ? '...' : 'Check'}
        </button>
      </form>

      {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
      {loading && <LoadingSpinner label="Fetching live weather data..." />}

      {result?.current && (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white rounded-xl p-5">
            <p className="text-sm opacity-90">{result.current.city}, {result.current.country}</p>
            <p className="text-4xl font-bold my-1">{Math.round(result.current.temperature)}°C</p>
            <p className="text-sm capitalize opacity-90">{result.current.description}</p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-gray-50 rounded-xl p-3">
              <Droplets className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <p className="text-xs text-gray-500">Humidity</p>
              <p className="font-bold text-gray-800">{result.current.humidity}%</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <Wind className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <p className="text-xs text-gray-500">Wind</p>
              <p className="font-bold text-gray-800">{result.current.windSpeed} m/s</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <Thermometer className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <p className="text-xs text-gray-500">Feels Like</p>
              <p className="font-bold text-gray-800">{Math.round(result.current.feelsLike)}°C</p>
            </div>
          </div>

          {result.alerts?.length > 0 && (
            <div className="bg-amber-50 rounded-xl p-4 space-y-2">
              <p className="flex items-center gap-2 text-sm font-semibold text-amber-700">
                <AlertTriangle className="w-4 h-4" /> Weather Alerts
              </p>
              {result.alerts.map((a, i) => (
                <p key={i} className="text-xs text-amber-700">{a}</p>
              ))}
            </div>
          )}

          {result.forecast?.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Next 24 hours</p>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {result.forecast.map((f, i) => (
                  <div key={i} className="flex-shrink-0 bg-gray-50 rounded-xl p-3 text-center w-20">
                    <p className="text-xs text-gray-400">{f.time.split(' ')[1]?.slice(0, 5)}</p>
                    <p className="font-bold text-gray-800 text-sm my-1">{Math.round(f.temp)}°C</p>
                    <p className="text-[10px] text-gray-500">{f.condition}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
