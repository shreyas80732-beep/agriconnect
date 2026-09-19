import React, { useState, useEffect } from 'react';
import { BG_IMAGES } from '../data/bgImages';

/**
 * Wraps children in a section with a slowly crossfading farm-image
 * background and a translucent overlay, so content stays readable while
 * the imagery keeps rotating like the Hero does.
 */
export default function RotatingBackground({ children, overlayClassName = 'bg-white/40', intervalMs = 6000, className = '' }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % BG_IMAGES.length);
    }, intervalMs);
    return () => clearInterval(interval);
  }, [intervalMs]);

  return (
    <section className={`relative overflow-hidden ${className}`}>
      {BG_IMAGES.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 bg-cover bg-center bg-fixed transition-opacity duration-[2000ms] ease-in-out"
          style={{
            backgroundImage: `url(${src})`,
            opacity: i === activeIndex ? 1 : 0,
          }}
        />
      ))}
      <div className={`absolute inset-0 ${overlayClassName}`} />
      <div className="relative">{children}</div>
    </section>
  );
}
