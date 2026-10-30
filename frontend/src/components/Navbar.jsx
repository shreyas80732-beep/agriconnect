import React, { useState } from 'react';
import { Sprout, Menu, X, Store, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onNavigate, active, onOpenAuth }) {
  const { user, isFarmer, isSeller, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { key: 'home', label: 'Home' },
    { key: 'features', label: 'AI Advisory' },
    { key: 'community', label: 'Farmer Connect' },
    { key: 'about', label: 'About' },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => onNavigate('home')}
          >
            <div className="bg-gradient-to-tr from-emerald-600 to-teal-500 p-2.5 rounded-2xl shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <Sprout className="text-white w-5 h-5" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-gray-900">
              Agri<span className="text-emerald-600">Connect</span>
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <button
                key={l.key}
                onClick={() => onNavigate(l.key)}
                className={`text-sm font-semibold transition-all relative py-1 ${
                  active === l.key
                    ? 'text-emerald-700 font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-600 after:rounded-full'
                    : 'text-gray-600 hover:text-emerald-600'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Right Auth / Profile Controls */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-gray-50 border border-gray-200/80 hover:bg-emerald-50/50 hover:border-emerald-200 transition-all text-left"
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm text-white ${
                      isFarmer ? 'bg-emerald-600' : 'bg-teal-700'
                    }`}
                  >
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-800 leading-tight flex items-center gap-1">
                      {user.name}
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                      {isFarmer ? '🌾 Farmer' : '🏪 Seller'}
                    </div>
                  </div>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-scale-in">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                        Authenticated Account
                      </p>
                      <p className="text-sm font-bold text-gray-900 mt-0.5">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      <div className="mt-2 inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {isFarmer
                          ? `🌾 Farmer (${user.farmSize || 'Farm Registered'})`
                          : `🏪 Seller (${user.sellerType || 'Vendor'})`}
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          if (isFarmer) {
                            onNavigate('features');
                          } else {
                            onNavigate('community');
                          }
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <User className="w-3.5 h-3.5 text-emerald-600" />
                        {isFarmer ? 'Go to AI Features' : 'Go to Marketplace'}
                      </button>
                    </div>

                    <div className="border-t border-gray-100 pt-1">
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('farmer')}
                  className="text-xs font-bold text-emerald-800 hover:bg-emerald-50 px-3.5 py-2 rounded-xl transition-all"
                >
                  🌾 Farmer Sign In
                </button>

                <button
                  onClick={() => onOpenAuth('seller')}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-700/20 active:scale-95"
                >
                  🏪 Seller Sign In
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex items-center md:hidden gap-2">
            {!user ? (
              <button
                onClick={() => onOpenAuth('farmer')}
                className="bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl"
              >
                Sign In
              </button>
            ) : (
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                {user.name.charAt(0)}
              </div>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 p-1.5 rounded-xl hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 space-y-2 animate-slide-down">
            {links.map((l) => (
              <button
                key={l.key}
                onClick={() => {
                  onNavigate(l.key);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-xl text-sm font-semibold ${
                  active === l.key ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-gray-700'
                }`}
              >
                {l.label}
              </button>
            ))}

            <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
              {user ? (
                <>
                  <div className="px-3 py-1.5 text-xs text-gray-500 font-medium">
                    Signed in as <span className="font-bold text-gray-800">{user.name}</span> ({user.role})
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      onOpenAuth('farmer');
                      setMobileMenuOpen(false);
                    }}
                    className="py-2 text-center text-xs font-bold text-emerald-800 bg-emerald-50 rounded-xl"
                  >
                    🌾 Farmer Sign In
                  </button>
                  <button
                    onClick={() => {
                      onOpenAuth('seller');
                      setMobileMenuOpen(false);
                    }}
                    className="py-2 text-center text-xs font-bold text-teal-800 bg-teal-50 rounded-xl"
                  >
                    🏪 Seller Sign In
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
