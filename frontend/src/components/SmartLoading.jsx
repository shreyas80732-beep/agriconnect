import React, { useState, useEffect } from 'react';
import { Loader2, Sparkles, Sprout, CheckCircle2 } from 'lucide-react';

const DEFAULT_MESSAGES = [
  'Searching...',
  'Getting information...',
  'Checking which suits you...',
  'Analyzing soil, weather & crop health...',
  'Gathering best outcome...',
  'On the way...',
  'Just there...',
  'Finalizing tailored recommendations...',
];

export default function SmartLoading({
  messages = DEFAULT_MESSAGES,
  title = 'AI Agricultural Intelligence',
  interval = 4000, // Appears every 4 seconds as requested
}) {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
      setProgress((prev) => Math.min(95, prev + 12));
    }, interval);

    return () => clearInterval(timer);
  }, [messages, interval]);

  return (
    <div className="py-10 px-4 flex flex-col items-center justify-center text-center animate-fade-in">
      {/* Glowing icon container */}
      <div className="relative mb-5">
        <div className="absolute inset-0 bg-emerald-400/25 rounded-full blur-xl animate-pulse" />
        <div className="relative w-16 h-16 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
          <Sprout className="w-8 h-8 text-white animate-bounce-gentle" />
          <Sparkles className="w-4 h-4 text-amber-300 absolute -top-1 -right-1 animate-spin-slow" />
        </div>
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2 border border-emerald-200/60">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        {title}
      </div>

      {/* Dynamic Animated Status Message rotating every 4 seconds */}
      <div className="h-10 flex items-center justify-center mb-4">
        <p
          key={index}
          className="text-base sm:text-lg font-semibold text-gray-800 transition-all duration-500 transform translate-y-0 opacity-100"
        >
          {messages[index]}
        </p>
      </div>

      {/* Dynamic Animated Progress Bar */}
      <div className="w-full max-w-xs bg-gray-100 rounded-full h-2.5 overflow-hidden mb-3 p-0.5 border border-gray-200">
        <div
          className="bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Subtle Step Tracker */}
      <div className="flex items-center gap-4 text-[11px] text-gray-500 mt-2">
        <span className="flex items-center gap-1 text-emerald-600 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5" /> Gathering Data
        </span>
        <span className="text-gray-300">•</span>
        <span className={progress > 40 ? 'flex items-center gap-1 text-emerald-600 font-medium' : 'text-gray-400'}>
          {progress > 40 ? <CheckCircle2 className="w-3.5 h-3.5" /> : null} Best Match
        </span>
        <span className="text-gray-300">•</span>
        <span className={progress > 70 ? 'flex items-center gap-1 text-emerald-600 font-medium' : 'text-gray-400'}>
          {progress > 70 ? <CheckCircle2 className="w-3.5 h-3.5" /> : null} Outcome
        </span>
      </div>
    </div>
  );
}
