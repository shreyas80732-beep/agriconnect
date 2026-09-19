import React from 'react';
import { Sprout, Menu } from 'lucide-react';

export default function Navbar({ onNavigate, active }) {
  const links = [
    { key: 'home', label: 'Home' },
    { key: 'features', label: 'Features' },
    { key: 'community', label: 'Community Hub' },
    { key: 'about', label: 'About' },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <div className="bg-emerald-600 p-2 rounded-xl">
              <Sprout className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-gray-800">
              Agri<span className="text-emerald-600">Connect</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <button
                key={l.key}
                onClick={() => onNavigate(l.key)}
                className={`text-sm font-medium transition-colors ${
                  active === l.key
                    ? 'text-emerald-600'
                    : 'text-gray-600 hover:text-emerald-600'
                }`}
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => onNavigate('community')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-colors"
            >
              Join Now →
            </button>
          </div>

          <button className="md:hidden text-gray-700">
            <Menu />
          </button>
        </div>
      </div>
    </nav>
  );
}
