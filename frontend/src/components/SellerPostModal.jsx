import React, { useState } from 'react';
import {
  X,
  Store,
  Tag,
  MapPin,
  Phone,
  DollarSign,
  Package,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import { createListing } from '../api/api';
import { useAuth } from '../context/AuthContext';

const QUICK_TEMPLATES = [
  {
    category: 'Equipment',
    title: 'Tractor & Harvester on Daily Rental with Operator',
    price: 1800,
    unit: 'hour',
    description: 'High power tractor with rotavator and laser leveler. Fuel and experienced operator included.',
  },
  {
    category: 'Seeds',
    title: 'Certified High-Yielding Hybrid Wheat Seeds (HD-2967)',
    price: 1400,
    unit: '40kg bag',
    description: 'Govt certified seed with 98% germination guarantee. Treated with bio-fungicide, rust resistant.',
  },
  {
    category: 'Fertilizer',
    title: 'Pure Organic Vermicompost with Neem & Trichoderma',
    price: 360,
    unit: '50kg bag',
    description: 'Rich in organic carbon and beneficial microbes. Enhances soil moisture holding capacity by 30%.',
  },
  {
    category: 'Equipment',
    title: 'Complete 1-Acre Drip Irrigation Kit with Venturi',
    price: 18500,
    unit: 'complete kit',
    description: 'UV protected inline drip pipes, screen filters, control valves and fertilizer injector. Easy setup.',
  },
];

export default function SellerPostModal({ isOpen, onClose, onCreated }) {
  const { user, isSeller } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    sellerName: user?.name || '',
    businessName: user?.businessName || '',
    contact: user?.phone || '',
    category: 'Equipment',
    title: '',
    price: '',
    unit: 'item',
    location: user?.address || (user?.district ? `${user.district}, ${user.state}` : ''),
    description: '',
    tags: '',
  });

  React.useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        sellerName: user.name || prev.sellerName,
        businessName: user.businessName || prev.businessName,
        contact: user.phone || prev.contact,
        location: user.address || (user.district ? `${user.district}, ${user.state}` : prev.location),
      }));
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleTemplateClick = (tmpl) => {
    setForm((prev) => ({
      ...prev,
      category: tmpl.category,
      title: tmpl.title,
      price: tmpl.price,
      unit: tmpl.unit,
      description: tmpl.description,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.sellerName || !form.contact || !form.title || !form.price || !form.location) {
      return setError('Please fill in all required fields.');
    }

    setError('');
    setLoading(true);

    try {
      await createListing({
        ...form,
        price: Number(form.price),
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()) : [],
      });
      if (onCreated) onCreated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to publish listing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-100 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-800 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2 text-teal-200 text-xs font-semibold uppercase tracking-wider">
            <Store className="w-4 h-4 text-amber-300" />
            Seller & Vendor Hub
          </div>

          <h2 className="text-2xl font-bold">Publish Sell Post / Marketplace Offer</h2>
          <p className="text-teal-100/90 text-xs sm:text-sm mt-1">
            Reach thousands of local farmers looking for seeds, machinery rentals, fertilizers, or produce!
          </p>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Quick template chips */}
          <div>
            <span className="text-xs font-bold uppercase text-gray-500 tracking-wider block mb-2">
              ⚡ Quick Fill Popular Items
            </span>
            <div className="flex flex-wrap gap-2">
              {QUICK_TEMPLATES.map((tmpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleTemplateClick(tmpl)}
                  className="text-xs bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 px-3 py-1.5 rounded-lg transition-colors font-medium text-left"
                >
                  + {tmpl.title.slice(0, 32)}...
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Seller / Contact Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anand Sharma"
                  value={form.sellerName}
                  onChange={(e) => setForm({ ...form, sellerName: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Business / Store Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kisan Agro Supplies"
                  value={form.businessName}
                  onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                >
                  <option value="Equipment">Equipment & Machinery Rental</option>
                  <option value="Seeds">Certified Seeds</option>
                  <option value="Fertilizer">Organic & Chemical Fertilizers</option>
                  <option value="Produce">Produce / Grain Wholesale</option>
                  <option value="Other">Other Agri Tools</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Contact Phone / WhatsApp *</label>
                <input
                  type="text"
                  required
                  placeholder="+91 97654 88210"
                  value={form.contact}
                  onChange={(e) => setForm({ ...form, contact: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Listing / Product Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Mahindra Tractor 575 DI with Trolley & Cultivator"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Price (₹) *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 1500"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Unit</label>
                <input
                  type="text"
                  placeholder="e.g. per hour, bag, kg, acre"
                  value={form.unit}
                  onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Location / Service Area *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pune, Nashik, Kolhapur"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Description & Specifications</label>
              <textarea
                placeholder="Detailed information regarding condition, warranty, delivery terms, or specifications..."
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-teal-600/20 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {loading ? 'Publishing...' : 'Publish Sell Post →'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
