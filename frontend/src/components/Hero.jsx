import React, { useState, useEffect } from 'react';
import { Sprout, ArrowRight } from 'lucide-react';
import { BG_IMAGES } from '../data/bgImages';

export default function Hero({ onGetStarted }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % BG_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {BG_IMAGES.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-[1500ms] ease-in-out"
          style={{
            backgroundImage: `url(${src})`,
            opacity: i === activeIndex ? 1 : 0,
          }}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-emerald-900/70" />

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 rounded-full text-sm text-white mb-5">
          <Sprout className="w-4 h-4" /> Smart Farming, Simplified
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 max-w-2xl leading-tight">
          Everything a New-Gen Farmer Needs
        </h1>
        <p className="text-emerald-50 max-w-xl mb-8 text-base sm:text-lg">
          AI-powered crop guidance, live weather, disease detection, and a thriving farmer
          community — all in one platform.
        </p>
        <button
          onClick={onGetStarted}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-7 py-3 rounded-xl shadow-lg transition-colors"
        >
          Get Started <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {BG_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            aria-label={`Show background ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === activeIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
