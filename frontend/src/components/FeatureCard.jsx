import React, { useMemo } from 'react';

export default function FeatureCard({ icon: Icon, title, description, onClick, ctaLabel = 'Try Now →' }) {
  // Randomize both delay and duration per card instance so the floating
  // motion never lines up between cards, even with only a few on screen.
  const { delay, duration } = useMemo(() => ({
    delay: Math.random() * 3,
    duration: 3.5 + Math.random() * 2.5,
  }), []);

  return (
    <div
      className="animate-float bg-white/30 backdrop-blur-md rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:bg-white/40 transition-all duration-300 p-6 flex flex-col justify-between border border-white/50"
      style={{ animationDelay: `${delay}s`, animationDuration: `${duration}s` }}
    >
      <div>
        <div className="bg-emerald-600/20 backdrop-blur-sm w-12 h-12 rounded-xl flex items-center justify-center mb-4">
          <Icon className="text-emerald-700 w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-sm text-gray-700 mb-6 leading-relaxed">{description}</p>
      </div>
      <button
        onClick={onClick}
        className="self-start text-emerald-700 font-semibold text-sm hover:text-emerald-800 transition-colors"
      >
        {ctaLabel}
      </button>
    </div>
  );
}
