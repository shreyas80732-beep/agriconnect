import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ label = 'Analyzing...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-gray-500">
      <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-3" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
