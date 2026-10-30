import React, { useState } from 'react';
import {
  X,
  Store,
  Sprout,
  ArrowRight,
  Lock,
  User,
  MapPin,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const POPULAR_STATES = [
  'Maharashtra',
  'Punjab',
  'Haryana',
  'Karnataka',
  'Uttar Pradesh',
  'Gujarat',
  'Madhya Pradesh',
  'Andhra Pradesh',
  'Tamil Nadu',
  'Rajasthan',
  'Telangana',
  'Bihar',
  'West Bengal',
  'Odisha',
  'Kerala',
  'Other',
];

export default function AuthModal({ isOpen, onClose, initialRole = 'farmer', onSuccess }) {
  const { login, register } = useAuth();
  const [role, setRole] = useState(initialRole); // 'farmer' or 'seller'
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form State: Strictly only Name, Password, State, District, Village, and Farm Area (Farmer only)
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    state: 'Maharashtra',
    district: '',
    village: '',
    farmArea: '',
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!formData.name.trim()) {
      return setError('Please enter your name.');
    }
    if (!formData.password) {
      return setError('Please enter your password.');
    }

    if (isSignUp) {
      if (!formData.state.trim()) {
        return setError('Please enter your state.');
      }
      if (!formData.district.trim()) {
        return setError('Please enter your district.');
      }
      if (!formData.village.trim()) {
        return setError('Please enter your village.');
      }
      if (role === 'farmer' && !formData.farmArea.trim()) {
        return setError('Please enter your farm area (in acres).');
      }
    }

    setLoading(true);

    try {
      if (isSignUp) {
        await register({
          name: formData.name.trim(),
          password: formData.password,
          role,
          state: formData.state.trim(),
          district: formData.district.trim(),
          village: formData.village.trim(),
          farmArea: role === 'farmer' ? formData.farmArea.trim() : '',
        });
        setSuccessMsg('Account created successfully! Redirecting...');
      } else {
        await login(formData.name.trim(), formData.password, role);
        setSuccessMsg('Signed in successfully! Redirecting...');
      }

      setTimeout(() => {
        setSuccessMsg('');
        if (onSuccess) {
          onSuccess(role);
        } else {
          onClose();
        }
      }, 600);
    } catch (err) {
      setError(
        err.response?.data?.error || err.message || 'Authentication failed. Please verify your details.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div
          className={`relative p-6 text-white transition-colors duration-300 ${
            role === 'farmer'
              ? 'bg-gradient-to-r from-emerald-800 to-emerald-700'
              : 'bg-gradient-to-r from-teal-800 to-teal-700'
          }`}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-xs font-bold uppercase tracking-wider text-emerald-200 mb-1 flex items-center gap-1.5">
            {role === 'farmer' ? <Sprout className="w-4 h-4" /> : <Store className="w-4 h-4" />}
            {role === 'farmer' ? 'Farmer Portal' : 'Seller Portal'}
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-white/80 text-xs sm:text-sm mt-1">
            {isSignUp
              ? `Fill in your location ${role === 'farmer' ? '& farm details' : ''} to get started.`
              : 'Enter your name and password to continue.'}
          </p>

          {/* Role Switcher Tabs */}
          <div className="grid grid-cols-2 gap-2 mt-4 bg-black/20 p-1.5 rounded-2xl backdrop-blur-sm">
            <button
              type="button"
              onClick={() => {
                setRole('farmer');
                setError('');
              }}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                role === 'farmer'
                  ? 'bg-white text-emerald-900 shadow-md transform scale-[1.01]'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Sprout className="w-4 h-4 text-emerald-600" />
              <span>Farmer</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRole('seller');
                setError('');
              }}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                role === 'seller'
                  ? 'bg-white text-teal-900 shadow-md transform scale-[1.01]'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Store className="w-4 h-4 text-teal-600" />
              <span>Seller</span>
            </button>
          </div>
        </div>

        {/* Modal Form */}
        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2 animate-fade-in font-medium">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* 1. Name */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* 2. Password */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Registration specific fields: State, District, Village, Farm Area */}
            {isSignUp && (
              <div className="pt-2 border-t border-gray-100 space-y-3 animate-fade-in">
                {/* 3. State */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    State *
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    {POPULAR_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 4. District & Village */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      District *
                    </label>
                    <input
                      type="text"
                      name="district"
                      required
                      placeholder="e.g. Nashik"
                      value={formData.district}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Village *
                    </label>
                    <input
                      type="text"
                      name="village"
                      required
                      placeholder="e.g. Khedgaon"
                      value={formData.village}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* 5. Farm Area (Farmer Only) */}
                {role === 'farmer' && (
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                      Farm Area (in Acres) *
                    </label>
                    <input
                      type="text"
                      name="farmArea"
                      required
                      placeholder="e.g. 5"
                      value={formData.farmArea}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] disabled:opacity-50 ${
                  role === 'farmer'
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                    : 'bg-teal-700 hover:bg-teal-800 shadow-teal-700/20'
                }`}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>
                      {isSignUp
                        ? `Register as ${role === 'farmer' ? 'Farmer' : 'Seller'}`
                        : `Sign In as ${role === 'farmer' ? 'Farmer' : 'Seller'}`}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Toggle between Login and Register */}
          <div className="mt-5 text-center text-xs text-gray-500 border-t border-gray-100 pt-3">
            {isSignUp ? (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(false);
                    setError('');
                  }}
                  className="font-bold text-emerald-700 hover:underline"
                >
                  Sign In
                </button>
              </p>
            ) : (
              <p>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(true);
                    setError('');
                  }}
                  className="font-bold text-emerald-700 hover:underline"
                >
                  Create {role === 'farmer' ? 'Farmer' : 'Seller'} Account
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
