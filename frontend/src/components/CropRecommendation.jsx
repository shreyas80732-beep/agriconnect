import React, { useState } from 'react';
import { Wheat, TrendingUp } from 'lucide-react';
import Modal from './Modal';
import LoadingSpinner from './LoadingSpinner';
import { recommendCrop } from '../api/api';

const SOIL_TYPES = ['Loamy', 'Clayey', 'Sandy', 'Alluvial', 'Black Soil', 'Red Soil', 'Sandy Loam'];

export default function CropRecommendation({ onClose }) {
  const [form, setForm] = useState({ city: '', soilType: SOIL_TYPES[0] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.city) return setError('Please enter a city name.');
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const data = await recommendCrop(form);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Crop Recommendation" icon={Wheat} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City Name</label>
          <input
            type="text"
            placeholder="e.g. Bengaluru"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Soil Type</label>
          <select
            value={form.soilType}
            onChange={(e) => setForm({ ...form, soilType: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {SOIL_TYPES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors"
        >
          {loading ? 'Analyzing...' : 'Get Recommendations'}
        </button>
      </form>

      {loading && <LoadingSpinner label="Fetching weather & consulting AI advisor..." />}

      {result?.weather && (
        <div className="bg-emerald-50 rounded-xl p-4 mb-4 text-sm text-gray-700">
          <p className="font-semibold mb-1">Current conditions in {result.weather.city}</p>
          <p>{result.weather.temperature}°C, {result.weather.description}, Humidity {result.weather.humidity}%</p>
        </div>
      )}

      {result?.recommendations && (
        <div className="space-y-3">
          {result.recommendations.map((rec, i) => (
            <div key={i} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-1">
                <h4 className="font-bold text-gray-800">{rec.cropName}</h4>
                <span className="flex items-center gap-1 text-emerald-600 font-semibold text-sm">
                  <TrendingUp className="w-4 h-4" /> {rec.suitabilityScore}%
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-2">{rec.reason}</p>
              <p className="text-xs font-medium text-emerald-700 bg-emerald-50 inline-block px-2 py-1 rounded-lg">
                {rec.estimatedMarketPrice}
              </p>
            </div>
          ))}
          {result.summary && (
            <p className="text-sm text-gray-600 italic border-t border-gray-100 pt-3">{result.summary}</p>
          )}
        </div>
      )}

      {result?.raw && !result?.recommendations && (
        <pre className="text-xs bg-gray-50 p-3 rounded-xl whitespace-pre-wrap">{result.raw}</pre>
      )}
    </Modal>
  );
}
