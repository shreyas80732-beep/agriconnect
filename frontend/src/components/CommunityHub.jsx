import React, { useEffect, useState } from 'react';
import {
  MessageSquare,
  UserCheck,
  Users,
  ShoppingBag,
  Send,
  Plus,
  Wheat,
  Droplet,
  Clock,
  Sparkles,
  Store,
  Phone,
  MapPin,
  Calendar,
  Search,
  CheckCircle,
  Filter,
  ArrowRight,
  ShieldCheck,
  Layers,
} from 'lucide-react';
import {
  getPosts,
  createPost,
  addReply,
  requestConsultation,
  getFarmers,
  addFarmer,
  getListings,
} from '../api/api';
import { useAuth } from '../context/AuthContext';
import CropProgressModal from './CropProgressModal';
import SellerPostModal from './SellerPostModal';
import SmartLoading from './SmartLoading';

const TABS = [
  { key: 'forum', label: 'Discussion Forum', icon: MessageSquare, badge: 'Community' },
  { key: 'local', label: 'Local Connections', icon: Users, badge: 'Farmer Profiles' },
  { key: 'marketplace', label: 'Seller Marketplace', icon: ShoppingBag, badge: 'Buy & Sell' },
  { key: 'expert', label: 'Expert Advice', icon: UserCheck, badge: 'Agronomists' },
];

export default function CommunityHub({ onOpenAuth, initialTab = 'local' }) {
  const [tab, setTab] = useState(initialTab);
  const { user, isFarmer, isSeller } = useAuth();
  const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);
  const [selectedFarmerForCrop, setSelectedFarmerForCrop] = useState(null);

  useEffect(() => {
    if (initialTab) {
      setTab(initialTab);
    }
  }, [initialTab]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-emerald-950/10 mb-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 transform skew-x-12 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-emerald-200 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              AgriConnect Farmer & Seller Ecosystem
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Farmer Connect Hub
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              Discover verified local farmers, inspect active crop growth timelines and irrigation schedules,
              browse verified seller equipment & inputs, or ask questions to fellow growers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {user ? (
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 flex items-center gap-3 text-white">
                <div className="w-10 h-10 rounded-xl bg-white text-emerald-800 font-bold flex items-center justify-center text-lg shadow-sm">
                  {user.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <div className="text-xs font-semibold text-emerald-200 uppercase flex items-center gap-1">
                    {user.role === 'farmer' ? '🌾 Farmer Profile' : '🏪 Verified Seller'}
                  </div>
                  <div className="text-sm font-bold">{user.name}</div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => onOpenAuth && onOpenAuth('farmer')}
                className="bg-white hover:bg-emerald-50 text-emerald-900 font-bold px-5 py-3 rounded-2xl text-sm shadow-lg transition-all transform active:scale-95"
              >
                Sign In / Join Connect →
              </button>
            )}

            {/* Quick Action Button */}
            {isSeller ? (
              <button
                onClick={() => setIsSellerModalOpen(true)}
                className="bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold px-5 py-3 rounded-2xl text-sm shadow-lg transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Post Sell Listing
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
        {TABS.map((t) => {
          const Icon = t.icon;
          const isActive = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
              <span
                className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {t.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {tab === 'local' && (
        <LocalTab
          onSelectFarmer={(f) => setSelectedFarmerForCrop(f)}
          onOpenAuth={onOpenAuth}
        />
      )}
      {tab === 'marketplace' && (
        <MarketplaceTab
          onOpenSellerModal={() => setIsSellerModalOpen(true)}
          onOpenAuth={onOpenAuth}
        />
      )}
      {tab === 'forum' && <ForumTab onOpenAuth={onOpenAuth} />}
      {tab === 'expert' && <ExpertTab />}

      {/* Crop Progress Modal */}
      {selectedFarmerForCrop && (
        <CropProgressModal
          farmer={selectedFarmerForCrop}
          onClose={() => setSelectedFarmerForCrop(null)}
          onRefreshFarmer={() => {
            getFarmers().then((data) => {
              const updated = data.find((d) => d._id === selectedFarmerForCrop._id);
              if (updated) setSelectedFarmerForCrop(updated);
            });
          }}
          isOwner={user && (selectedFarmerForCrop.userId === user._id || selectedFarmerForCrop.name === user.name)}
        />
      )}

      {/* Seller Post Modal */}
      <SellerPostModal
        isOpen={isSellerModalOpen}
        onClose={() => setIsSellerModalOpen(false)}
        onCreated={() => {
          setTab('marketplace');
        }}
      />
    </div>
  );
}

// =========================================================================
// 1. LOCAL CONNECTIONS TAB (Farmers, details, active crop timelines)
// =========================================================================
function LocalTab({ onSelectFarmer, onOpenAuth }) {
  const [farmers, setFarmers] = useState([]);
  const [district, setDistrict] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddFarmer, setShowAddFarmer] = useState(false);
  const [newFarmerForm, setNewFarmerForm] = useState({
    name: '',
    village: '',
    district: '',
    state: '',
    contact: '',
    primaryCrops: '',
    farmSize: '4 Acres',
    experienceYears: '8',
    groupName: '',
    initialCrop: 'Wheat',
  });

  const load = () => {
    setLoading(true);
    getFarmers(district ? { district } : {})
      .then((data) => setFarmers(data))
      .catch(() => setFarmers([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreateFarmer = async (e) => {
    e.preventDefault();
    if (!newFarmerForm.name || !newFarmerForm.village || !newFarmerForm.contact) return;
    try {
      await addFarmer({
        ...newFarmerForm,
        primaryCrops: newFarmerForm.primaryCrops
          ? newFarmerForm.primaryCrops.split(',').map((c) => c.trim())
          : [newFarmerForm.initialCrop],
      });
      setShowAddFarmer(false);
      setNewFarmerForm({
        name: '',
        village: '',
        district: '',
        state: '',
        contact: '',
        primaryCrops: '',
        farmSize: '4 Acres',
        experienceYears: '8',
        groupName: '',
        initialCrop: 'Wheat',
      });
      load();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Action Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex-1 max-w-md relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            placeholder="Search farmers by district, state, or village..."
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && load()}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={load}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition-colors"
          >
            Search
          </button>
          <button
            onClick={() => setShowAddFarmer(!showAddFarmer)}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" /> Register Local Farmer
          </button>
        </div>
      </div>

      {/* Add Farmer Form Drawer */}
      {showAddFarmer && (
        <form
          onSubmit={handleCreateFarmer}
          className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-lg space-y-4 animate-slide-down"
        >
          <div className="flex justify-between items-center pb-2 border-b border-gray-100">
            <h3 className="font-bold text-gray-800 text-base flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" /> Register Farmer Profile in Network
            </h3>
            <span className="text-xs text-gray-400">Instantly sets up crop tracking</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              placeholder="Farmer Full Name *"
              required
              value={newFarmerForm.name}
              onChange={(e) => setNewFarmerForm({ ...newFarmerForm, name: e.target.value })}
              className="px-3 py-2 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <input
              placeholder="Contact Phone / WhatsApp *"
              required
              value={newFarmerForm.contact}
              onChange={(e) => setNewFarmerForm({ ...newFarmerForm, contact: e.target.value })}
              className="px-3 py-2 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <input
              placeholder="Village Name *"
              required
              value={newFarmerForm.village}
              onChange={(e) => setNewFarmerForm({ ...newFarmerForm, village: e.target.value })}
              className="px-3 py-2 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              placeholder="District *"
              required
              value={newFarmerForm.district}
              onChange={(e) => setNewFarmerForm({ ...newFarmerForm, district: e.target.value })}
              className="px-3 py-2 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <input
              placeholder="State *"
              required
              value={newFarmerForm.state}
              onChange={(e) => setNewFarmerForm({ ...newFarmerForm, state: e.target.value })}
              className="px-3 py-2 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <input
              placeholder="Farm Size (e.g. 5 Acres)"
              value={newFarmerForm.farmSize}
              onChange={(e) => setNewFarmerForm({ ...newFarmerForm, farmSize: e.target.value })}
              className="px-3 py-2 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Currently Planted Crop (Auto Timeline & Irrigation)
              </label>
              <select
                value={newFarmerForm.initialCrop}
                onChange={(e) => setNewFarmerForm({ ...newFarmerForm, initialCrop: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
              >
                <option value="Wheat">Wheat (Rabi Season)</option>
                <option value="Rice (Paddy)">Rice / Paddy</option>
                <option value="Cotton">Cotton</option>
                <option value="Tomato">Tomato</option>
                <option value="Sugarcane">Sugarcane</option>
                <option value="Maize (Corn)">Maize / Corn</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                FPO / Cooperative Club (Optional)
              </label>
              <input
                placeholder="e.g. Krishi Vikas Sahakari"
                value={newFarmerForm.groupName}
                onChange={(e) => setNewFarmerForm({ ...newFarmerForm, groupName: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddFarmer(false)}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-all"
            >
              Save Farmer & Set Up Crop Tracker
            </button>
          </div>
        </form>
      )}

      {/* Loading state */}
      {loading ? (
        <SmartLoading
          title="Loading Local Farmers Network"
          messages={[
            'Fetching registered farmer accounts...',
            'Checking active crop planting records...',
            'Gathering irrigation timelines...',
            'Just there...',
          ]}
        />
      ) : farmers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-bold text-gray-700 text-lg">No Farmer Profiles Found</h3>
          <p className="text-sm text-gray-500 mt-1">
            Try adjusting your district search or click "Register Local Farmer" to add the first profile!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farmers.map((f) => {
            const activeCrop = f.plantedCrops?.[0];
            return (
              <div
                key={f._id}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Farmer Card Top Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white font-extrabold text-lg flex items-center justify-center shadow-md shadow-emerald-500/20">
                        {f.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-base leading-snug">{f.name}</h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-emerald-600" />
                          {f.village}, {f.district}
                        </p>
                      </div>
                    </div>

                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                      {f.farmSize || '5 Acres'}
                    </span>
                  </div>

                  {/* FPO or Cooperative Tag */}
                  {f.groupName && (
                    <div className="mb-3">
                      <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50/70 px-2.5 py-1 rounded-lg border border-emerald-100 inline-block">
                        👥 {f.groupName}
                      </span>
                    </div>
                  )}

                  {/* Primary Crops Badges */}
                  <div className="mb-4">
                    <span className="text-xs text-gray-400 block mb-1">Crops Cultivated:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {f.primaryCrops && f.primaryCrops.length > 0 ? (
                        f.primaryCrops.map((c, i) => (
                          <span
                            key={i}
                            className="text-xs bg-gray-50 text-gray-700 px-2 py-0.5 rounded-md border border-gray-100"
                          >
                            🌾 {c}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">Multiple Seasonal Crops</span>
                      )}
                    </div>
                  </div>

                  {/* ACTIVE CROP PROGRESS FEATURE PREVIEW */}
                  <div className="bg-gradient-to-br from-emerald-50/60 to-teal-50/30 rounded-2xl p-4 border border-emerald-100 mb-4">
                    {activeCrop ? (
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                            <Wheat className="w-3.5 h-3.5 text-emerald-600" />
                            {activeCrop.cropName}
                          </span>
                          <span className="text-xs font-extrabold text-emerald-700">
                            {activeCrop.progressPercent}%
                          </span>
                        </div>

                        {/* Mini progress bar */}
                        <div className="w-full bg-gray-200/80 rounded-full h-2 overflow-hidden mb-2">
                          <div
                            className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full rounded-full"
                            style={{ width: `${activeCrop.progressPercent}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-gray-600">
                          <span className="font-medium text-gray-700 truncate max-w-[150px]">
                            {activeCrop.stage || 'Vegetative Growth'}
                          </span>
                          <span className="flex items-center gap-1 text-blue-700 font-semibold">
                            <Droplet className="w-3 h-3 text-blue-500" /> Next Irrigation
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-2 text-xs text-gray-500">
                        <span>No crop currently in active cycle</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Actions: View Full Timeline / Call */}
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                  <a
                    href={`tel:${f.contact}`}
                    className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-emerald-700 py-2 px-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{f.contact}</span>
                  </a>

                  <button
                    onClick={() => onSelectFarmer(f)}
                    className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md transition-all active:scale-95"
                  >
                    <span>Crop Timeline</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// =========================================================================
// 2. MARKETPLACE TAB (Seller Sell Posts & Items)
// =========================================================================
function MarketplaceTab({ onOpenSellerModal, onOpenAuth }) {
  const [listings, setListings] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { user, isSeller } = useAuth();

  const load = () => {
    setLoading(true);
    getListings({
      category: category === 'All' ? undefined : category,
      search: search || undefined,
    })
      .then(setListings)
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [category]);

  const CATEGORIES = ['All', 'Equipment', 'Seeds', 'Fertilizer', 'Produce', 'Other'];

  return (
    <div className="space-y-6">
      {/* Seller Promo / Callout Card */}
      <div className="bg-gradient-to-r from-teal-50 via-emerald-50 to-amber-50 rounded-2xl p-5 border border-teal-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <Store className="w-4 h-4 text-teal-600" />
            Seller & Vendor Hub
          </span>
          <h3 className="font-extrabold text-gray-900 text-lg">
            Have Agri Machinery, Certified Seeds or Bulk Produce to Sell?
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
            Post sell listings directly to verified local farmers with instant WhatsApp/call inquiries.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isSeller ? (
            <button
              onClick={onOpenSellerModal}
              className="bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95"
            >
              <Plus className="w-4 h-4" /> Add Sell Post
            </button>
          ) : (
            <button
              onClick={onOpenSellerModal}
              className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95"
            >
              <Plus className="w-4 h-4" /> Add Sell Post
            </button>
          )}
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                category === cat
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-2 max-w-sm">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              placeholder="Search machinery, seeds, fertilizers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && load()}
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <button
            onClick={load}
            className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold"
          >
            Go
          </button>
        </div>
      </div>

      {/* Listings Grid */}
      {loading ? (
        <SmartLoading
          title="Loading Marketplace Listings"
          messages={[
            'Fetching certified seller listings...',
            'Checking machinery rental availability...',
            'Gathering fair mandi price benchmarks...',
            'Just there...',
          ]}
        />
      ) : listings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200">
          <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-bold text-gray-700 text-lg">No Listings in this Category</h3>
          <p className="text-sm text-gray-500 mt-1">
            Be the first seller to list your products or machinery here!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Header Tag and Verified Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-bold text-teal-800 bg-teal-50 border border-teal-100 px-3 py-1 rounded-xl">
                    {item.category}
                  </span>

                  {item.isVerifiedSeller && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Seller
                    </span>
                  )}
                </div>

                <h3 className="font-extrabold text-gray-900 text-lg mb-1 leading-snug">
                  {item.title}
                </h3>

                {item.businessName && (
                  <p className="text-xs font-semibold text-teal-700 mb-2">
                    🏬 {item.businessName}
                  </p>
                )}

                <p className="text-xs sm:text-sm text-gray-600 mb-4 leading-relaxed line-clamp-3">
                  {item.description}
                </p>

                {item.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {item.tags.map((t, idx) => (
                      <span key={idx} className="text-[10px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                {/* Price and Unit */}
                <div className="flex items-baseline justify-between py-3 border-t border-b border-gray-100 mb-4">
                  <span className="text-xs text-gray-500">Price:</span>
                  <div className="text-right">
                    <span className="text-2xl font-black text-gray-900">₹{item.price}</span>
                    <span className="text-xs text-gray-500 font-medium"> / {item.unit || 'unit'}</span>
                  </div>
                </div>

                {/* Location & Contact Action */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-gray-500 flex items-center gap-1 truncate max-w-[140px]">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    {item.location}
                  </span>

                  <a
                    href={`tel:${item.contact}`}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md transition-all active:scale-95"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Contact Seller</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// =========================================================================
// 3. DISCUSSION FORUM TAB
// =========================================================================
function ForumTab({ onOpenAuth }) {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ author: user?.name || '', title: '', message: '' });
  const [replyText, setReplyText] = useState({});
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getPosts()
      .then(setPosts)
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.author || !form.title || !form.message) return;
    await createPost(form);
    setForm({ author: user?.name || '', title: '', message: '' });
    setShowForm(false);
    load();
  };

  const handleReply = async (id) => {
    const message = replyText[id];
    if (!message) return;
    await addReply(id, { author: user?.name || 'Farmer Member', message });
    setReplyText({ ...replyText, [id]: '' });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Community Discussion Forum</h2>
          <p className="text-xs text-gray-500">Ask agronomic questions, discuss pest control, market prices & tips.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" /> Ask Question
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 space-y-3 animate-slide-down">
          <input
            placeholder="Your Name / Farm Name"
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <input
            placeholder="Question Title (e.g. Yellowing of wheat leaves in CRI stage - what fertilizer?)"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <textarea
            placeholder="Describe your issue or discussion point in detail..."
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500 h-28"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2 rounded-xl text-sm shadow-md"
            >
              Post Question
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <SmartLoading title="Loading Discussions" messages={['Fetching community questions...', 'Just there...']} />
      ) : posts.length === 0 ? (
        <p className="text-gray-400 text-sm py-12 text-center bg-white rounded-3xl">No discussions yet. Be the first to ask!</p>
      ) : (
        <div className="space-y-4">
          {posts.map((p) => (
            <div key={p._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
              <h3 className="font-bold text-gray-900 text-base mb-1">{p.title}</h3>
              <p className="text-xs text-gray-400 mb-3">Posted by {p.author}</p>
              <p className="text-sm text-gray-700 mb-4 leading-relaxed">{p.message}</p>

              {p.replies?.length > 0 && (
                <div className="border-t border-gray-100 pt-3 space-y-2 mb-3">
                  {p.replies.map((r, i) => (
                    <div key={i} className="bg-emerald-50/50 rounded-xl px-3.5 py-2.5 border border-emerald-100/50">
                      <p className="text-xs font-bold text-emerald-800">{r.author}</p>
                      <p className="text-xs sm:text-sm text-gray-700 mt-0.5">{r.message}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <input
                  placeholder="Share your answer or advice..."
                  value={replyText[p._id] || ''}
                  onChange={(e) => setReplyText({ ...replyText, [p._id]: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && handleReply(p._id)}
                  className="flex-1 border border-gray-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  onClick={() => handleReply(p._id)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Reply</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// =========================================================================
// 4. EXPERT ADVICE TAB
// =========================================================================
function ExpertTab() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    cropConcern: '',
    description: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.cropConcern || !form.description) {
      return setError('Please fill in all required fields.');
    }
    setError('');
    setLoading(true);
    try {
      await requestConsultation(form);
      setSubmitted(true);
    } catch (err) {
      setError('Failed to submit consultation request.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 text-center max-w-lg mx-auto animate-fade-in">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h3 className="font-extrabold text-gray-900 text-xl mb-1">Consultation Request Confirmed</h3>
        <p className="text-sm text-gray-600 leading-relaxed mb-6">
          A certified university agronomist will review your crop concern and reach out via phone/WhatsApp within 24 hours.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setForm({ name: '', phone: '', email: '', cropConcern: '', description: '' });
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm"
        >
          Submit Another Query
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 max-w-xl mx-auto space-y-4"
    >
      <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl">
          <UserCheck className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">Request 1-on-1 Agronomist Advice</h2>
          <p className="text-xs text-gray-500">Free advisory from certified crop scientists</p>
        </div>
      </div>

      <input
        placeholder="Full name *"
        value={form.name}
        onChange={update('name')}
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
      />
      <input
        placeholder="Phone number *"
        value={form.phone}
        onChange={update('phone')}
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
      />
      <input
        placeholder="Email (optional)"
        value={form.email}
        onChange={update('email')}
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
      />
      <input
        placeholder="Crop concern (e.g. Wheat - Yellow Rust or Leaf Blight)"
        value={form.cropConcern}
        onChange={update('cropConcern')}
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
      />
      <textarea
        placeholder="Describe symptoms, soil condition, or chemical application history..."
        value={form.description}
        onChange={update('description')}
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500 h-28"
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-600/20 transition-all"
      >
        {loading ? 'Submitting...' : 'Submit Advisory Request →'}
      </button>
    </form>
  );
}
