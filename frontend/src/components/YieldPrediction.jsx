import React, { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import Modal from './Modal';
import LoadingSpinner from './LoadingSpinner';
import { predictYield } from '../api/api';

export default function YieldPrediction({ onClose }) {
  const [form, setForm] = useState({
    city: '',
    cropName: '',
    areaAcres: '',
    soilType: '',
    historicalYield: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.city || !form.cropName || !form.areaAcres) {
      return setError('City, crop name, and area (acres) are required.');
    }
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const data = await predictYield(form);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Yield Prediction" icon={BarChart3} onClose={onClose}>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-6">
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">City Name</label>
          <input value={form.city} onChange={update('city')} placeholder="e.g. Mysuru"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Crop Name</label>
          <input value={form.cropName} onChange={update('cropName')} placeholder="e.g. Rice"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Area (acres)</label>
          <input type="number" value={form.areaAcres} onChange={update('areaAcres')} placeholder="e.g. 5"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Soil Type</label>
          <input value={form.soilType} onChange={update('soilType')} placeholder="e.g. Alluvial"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Historical Yield (optional)</label>
          <input value={form.historicalYield} onChange={update('historicalYield')} placeholder="e.g. 18 quintals/acre last season"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        {error && <p className="col-span-2 text-sm text-red-500">{error}</p>}
        <button type="submit" disabled={loading}
          className="col-span-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors">
          {loading ? 'Predicting...' : 'Predict Yield'}
        </button>
      </form>

      {loading && <LoadingSpinner label="Fetching weather & estimating yield..." />}

      {result?.expectedYieldPerAcre && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-emerald-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Yield per Acre</p>
              <p className="font-bold text-emerald-700">{result.expectedYieldPerAcre}</p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Total Expected Yield</p>
              <p className="font-bold text-emerald-700">{result.expectedTotalYield}</p>
            </div>
          </div>
          <p className="text-sm"><span className="font-medium">Confidence:</span> {result.confidence}</p>
          {result.factorsConsidered?.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Factors considered</p>
              <ul className="list-disc list-inside text-sm text-gray-500 space-y-1">
                {result.factorsConsidered.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
            </div>
          )}
          {result.recommendation && (
            <p className="text-sm text-gray-600 italic border-t border-gray-100 pt-3">{result.recommendation}</p>
          )}
        </div>
      )}

      {result?.raw && !result?.expectedYieldPerAcre && (
        <pre className="text-xs bg-gray-50 p-3 rounded-xl whitespace-pre-wrap">{result.raw}</pre>
      )}
    </Modal>
  );
}
