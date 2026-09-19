import React, { useState } from 'react';
import { Bug, Upload, CheckCircle2, AlertTriangle } from 'lucide-react';
import Modal from './Modal';
import LoadingSpinner from './LoadingSpinner';
import { detectDisease } from '../api/api';

export default function DiseaseDetection({ onClose }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
    setError('');
  };

  const handleAnalyze = async () => {
    if (!file) return setError('Please upload a plant/leaf image first.');
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const data = await detectDisease(file);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Disease Detection" icon={Bug} onClose={onClose}>
      <label
        htmlFor="disease-image"
        className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl h-48 cursor-pointer hover:border-emerald-400 transition-colors mb-4 overflow-hidden"
      >
        {preview ? (
          <img src={preview} alt="preview" className="h-full w-full object-cover" />
        ) : (
          <div className="flex flex-col items-center text-gray-400">
            <Upload className="w-8 h-8 mb-2" />
            <p className="text-sm">Click to upload a leaf/plant photo</p>
            <p className="text-xs">JPG, PNG up to 8MB</p>
          </div>
        )}
        <input id="disease-image" type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </label>

      {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-colors mb-6"
      >
        {loading ? 'Analyzing...' : 'Analyze Image'}
      </button>

      {loading && <LoadingSpinner label="Running AI vision analysis..." />}

      {result?.diagnosis && (
        <div className="space-y-4">
          <div className={`flex items-center gap-2 rounded-xl p-4 ${result.isHealthy ? 'bg-emerald-50' : 'bg-amber-50'}`}>
            {result.isHealthy ? (
              <CheckCircle2 className="text-emerald-600 w-6 h-6 shrink-0" />
            ) : (
              <AlertTriangle className="text-amber-600 w-6 h-6 shrink-0" />
            )}
            <div>
              <p className="font-bold text-gray-800">{result.diagnosis}</p>
              <p className="text-xs text-gray-500">Confidence: {result.confidence}</p>
            </div>
          </div>

          {result.symptomsObserved?.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Symptoms observed</p>
              <ul className="list-disc list-inside text-sm text-gray-500 space-y-1">
                {result.symptomsObserved.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          )}

          {result.preventionSteps?.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Prevention steps</p>
              <ul className="list-disc list-inside text-sm text-gray-500 space-y-1">
                {result.preventionSteps.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          )}

          {result.recommendedTreatment && (
            <p className="text-sm text-gray-600 italic border-t border-gray-100 pt-3">
              <span className="font-medium not-italic">Recommended treatment: </span>
              {result.recommendedTreatment}
            </p>
          )}
        </div>
      )}

      {result?.raw && !result?.diagnosis && (
        <pre className="text-xs bg-gray-50 p-3 rounded-xl whitespace-pre-wrap">{result.raw}</pre>
      )}
    </Modal>
  );
}
