import React, { useState } from 'react';
import {
  Wheat,
  BarChart3,
  Bug,
  FlaskConical,
  CloudSun,
  Users,
  Store,
  Sparkles,
} from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import RotatingBackground from './components/RotatingBackground';
import FeatureCard from './components/FeatureCard';
import CropRecommendation from './components/CropRecommendation';
import YieldPrediction from './components/YieldPrediction';
import DiseaseDetection from './components/DiseaseDetection';
import FertilizerGuide from './components/FertilizerGuide';
import WeatherForecast from './components/WeatherForecast';
import CommunityHub from './components/CommunityHub';
import AuthModal from './components/AuthModal';

const FEATURES = [
  {
    key: 'recommend',
    icon: Wheat,
    title: 'Crop Recommendation',
    description: 'Get AI-powered crop suggestions based on your soil type and live local weather conditions.',
  },
  {
    key: 'yield',
    icon: BarChart3,
    title: 'Yield Prediction',
    description: 'Estimate your expected yield per acre using current weather and crop history.',
  },
  {
    key: 'disease',
    icon: Bug,
    title: 'Disease Detection',
    description: 'Upload a leaf photo and let AI vision diagnose plant diseases and pests instantly.',
  },
  {
    key: 'fertilizer',
    icon: FlaskConical,
    title: 'Fertilizer Guide',
    description: 'Get a custom fertilizer schedule based on your crop, soil, and growth stage.',
  },
  {
    key: 'weather',
    icon: CloudSun,
    title: 'Weather Forecast',
    description: 'Live temperature, humidity, rainfall and severe weather alerts for your city.',
  },
  {
    key: 'community',
    icon: Users,
    title: 'Farmer Connect & Marketplace',
    description: 'Track crop growth timelines, irrigation schedules, local farmer directory & seller marketplace.',
    ctaLabel: 'Enter Connect →',
  },
];

function MainApp() {
  const [page, setPage] = useState('home');
  const [activeModal, setActiveModal] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authRole, setAuthRole] = useState('farmer');
  const [communityTab, setCommunityTab] = useState('local');

  const openAuth = (role = 'farmer') => {
    setAuthRole(role);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (role) => {
    setAuthModalOpen(false);
    if (role === 'farmer') {
      // Directs farmer to features page upon sign-in
      setPage('features');
    } else if (role === 'seller') {
      // Directs seller to marketplace upon sign-in
      setCommunityTab('marketplace');
      setPage('community');
    }
  };

  const handleFeatureClick = (key) => {
    if (key === 'community') {
      setPage('community');
    } else {
      setActiveModal(key);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar onNavigate={setPage} active={page} onOpenAuth={openAuth} />

      {page === 'home' && (
        <Hero
          onGetStarted={() => setPage('features')}
          onOpenAuth={openAuth}
        />
      )}

      {page === 'features' && (
        <RotatingBackground overlayClassName="bg-white/50" className="min-h-screen flex-1">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider">
                Agronomic Intelligence Suite
              </span>
              <h2 className="text-3xl font-extrabold text-gray-900 mt-2">
                Smart Tools Built for Modern Agriculture
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                Click any advisory module to run AI-assisted analyses with real-time dynamic guidance.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((f) => (
                <FeatureCard
                  key={f.key}
                  icon={f.icon}
                  title={f.title}
                  description={f.description}
                  ctaLabel={f.ctaLabel}
                  onClick={() => handleFeatureClick(f.key)}
                />
              ))}
            </div>

            <div className="mt-12 bg-white/70 backdrop-blur-md border border-white/80 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-gray-800 mb-1">Need help or 1-on-1 agronomy assistance?</h3>
                <p className="text-sm text-gray-600">Our farmer support & scientific team is available 24/7.</p>
              </div>
              <div className="flex flex-col sm:items-end gap-1 text-sm">
                <a href="tel:+919847362510" className="font-bold text-emerald-700 hover:text-emerald-800">
                  +91 98473 62510
                </a>
                <a href="mailto:support@agriconnect.com" className="font-semibold text-emerald-700 hover:text-emerald-800">
                  support@agriconnect.com
                </a>
              </div>
            </div>
          </main>
        </RotatingBackground>
      )}

      {page === 'community' && (
        <CommunityHub
          onOpenAuth={openAuth}
          initialTab={communityTab}
        />
      )}

      {page === 'about' && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">About AgriConnect</span>
            <h1 className="text-3xl font-bold text-gray-900 mt-1 mb-4">Empowering Modern Farmers & Sellers</h1>
            <p className="text-gray-600 leading-relaxed text-base mb-4">
              AgriConnect bridges the gap between field-level farming and cutting-edge intelligence.
              With automated crop lifecycle tracking, scientific irrigation countdowns, disease diagnosis,
              and direct farmer-seller networks, growers can maximize yields and reduce input costs.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
              <div className="p-4 bg-emerald-50 rounded-2xl">
                <h4 className="font-bold text-emerald-900 text-sm">🌾 Farmer Profiles</h4>
                <p className="text-xs text-gray-600 mt-1">Track wheat, rice, cotton and vegetable progress with exact timelines.</p>
              </div>
              <div className="p-4 bg-teal-50 rounded-2xl">
                <h4 className="font-bold text-teal-900 text-sm">🏪 Seller Marketplace</h4>
                <p className="text-xs text-gray-600 mt-1">Directly list harvesters, seeds, organic inputs and buy wholesale produce.</p>
              </div>
              <div className="p-4 bg-amber-50 rounded-2xl">
                <h4 className="font-bold text-amber-900 text-sm">💧 Smart Irrigation</h4>
                <p className="text-xs text-gray-600 mt-1">Never miss a critical watering window with stage-by-stage reminders.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feature Modals */}
      {activeModal === 'recommend' && <CropRecommendation onClose={() => setActiveModal(null)} />}
      {activeModal === 'yield' && <YieldPrediction onClose={() => setActiveModal(null)} />}
      {activeModal === 'disease' && <DiseaseDetection onClose={() => setActiveModal(null)} />}
      {activeModal === 'fertilizer' && <FertilizerGuide onClose={() => setActiveModal(null)} />}
      {activeModal === 'weather' && <WeatherForecast onClose={() => setActiveModal(null)} />}

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialRole={authRole}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
