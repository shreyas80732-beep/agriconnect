import React from 'react';
import { X } from 'lucide-react';

export default function Modal({ title, icon: Icon, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-xl">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="bg-emerald-50 w-9 h-9 rounded-lg flex items-center justify-center">
                <Icon className="text-emerald-600 w-5 h-5" />
              </div>
            )}
            <h2 className="font-bold text-lg text-gray-800">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1.5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
