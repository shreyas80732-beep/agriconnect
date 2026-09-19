import React, { useState } from 'react';
import { FlaskConical } from 'lucide-react';
import Modal from './Modal';
import LoadingSpinner from './LoadingSpinner';
import { fertilizerGuide } from '../api/api';

const STAGES = ['Seedling', 'Vegetative', 'Flowering', 'Maturity'];

export default function FertilizerGuide({ onClose }) {
  const [form, setForm] = useState({ cropName: '', soilCondition: '', growthStage: STAGES[0] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.cropName) return setError('Please enter a crop name.');
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const data = await fertilizerGuide(form);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Fertilizer Guide" icon={FlaskConical} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Crop Type</label>
          <input value={form.cropName} onChange={update('cropName')} placeholder="e.g. Maize"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Soil Condition</label>
          <input value={form.soilCondition} onChange={update('soilCondition')} placeholder="e.g. Slightly acidic, low nitrogen"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Growth Stage</label>
          <select value={form.growthStage} onChange={update('growthStage')}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500">
            {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button type="submit" disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors">
          {loading ? 'Generating...' : 'Get Fertilizer Schedule'}
        </button>
      </form>

      {loading && <LoadingSpinner label="Building your fertilizer plan..." />}

      {result?.recommendedFertilizer && (
        <div className="space-y-4">
          <div className="bg-emerald-50 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">Recommended Fertilizer</p>
            <p className="font-bold text-gray-800">{result.recommendedFertilizer}</p>
            <p className="text-sm text-emerald-700 font-medium mt-1">{result.estimatedPrice}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-500 text-xs mb-1">Application Rate</p>
              <p className="font-medium text-gray-800">{result.applicationRate}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">Method</p>
              <p className="font-medium text-gray-800">{result.applicationMethod}</p>
            </div>
          </div>
          {result.additionalTips?.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Additional Tips</p>
              <ul className="list-disc list-inside text-sm text-gray-500 space-y-1">
                {result.additionalTips.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}

      {result?.raw && !result?.recommendedFertilizer && (
        <pre className="text-xs bg-gray-50 p-3 rounded-xl whitespace-pre-wrap">{result.raw}</pre>
      )}
    </Modal>
  );
}
