import React, { useState, useEffect } from 'react';
import { Sprout, ArrowRight, Users, Store } from 'lucide-react';
import { BG_IMAGES } from '../data/bgImages';

export default function Hero({ onGetStarted, onOpenAuth }) {
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

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-emerald-950/80" />

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/25 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-white mb-6 shadow-sm">
          <Sprout className="w-4 h-4 text-emerald-300" /> Smart Farming, Crop Monitoring & Local Marketplace
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-4 tracking-tight leading-tight">
          Modern Agronomy & Agricultural Marketplace
        </h1>

        <p className="text-emerald-100 max-w-2xl mb-8 text-base sm:text-lg leading-relaxed font-normal">
          AI crop intelligence, interactive planting & irrigation timeline tracking, local farmer connections,
          and a verified marketplace for agricultural equipment, seeds & wholesale produce.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3.5">
          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold px-8 py-3.5 rounded-2xl shadow-xl shadow-emerald-900/40 transition-all transform active:scale-95"
          >
            Explore AI Advisory <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onOpenAuth && onOpenAuth('farmer')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/95 hover:bg-white text-emerald-900 font-bold px-6 py-3.5 rounded-2xl shadow-xl backdrop-blur-md transition-all active:scale-95"
          >
            <Users className="w-4 h-4 text-emerald-600" /> Farmer Sign In
          </button>

          <button
            onClick={() => onOpenAuth && onOpenAuth('seller')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-teal-900/80 hover:bg-teal-900 text-teal-100 border border-teal-500/30 font-bold px-6 py-3.5 rounded-2xl shadow-xl backdrop-blur-md transition-all active:scale-95"
          >
            <Store className="w-4 h-4 text-teal-300" /> Seller Sign In
          </button>
        </div>
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
