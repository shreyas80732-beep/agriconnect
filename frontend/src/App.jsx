import React, { useState } from 'react';
import {
  Wheat, BarChart3, Bug, FlaskConical, CloudSun, Users,
} from 'lucide-react';
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
    title: 'Farmer Connect',
    description: 'Join the community hub: forums, expert advice, local networks, and marketplace.',
    ctaLabel: 'Join Now →',
  },
];

export default function App() {
  const [page, setPage] = useState('home');
  const [activeModal, setActiveModal] = useState(null);

  const handleFeatureClick = (key) => {
    if (key === 'community') {
      setPage('community');
    } else {
      setActiveModal(key);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onNavigate={setPage} active={page} />

      {page === 'home' && (
        <Hero onGetStarted={() => setPage('features')} />
      )}

      {page === 'features' && (
        <RotatingBackground overlayClassName="bg-white/40" className="min-h-screen">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

            <div className="mt-12 bg-white/40 backdrop-blur-md border border-white/50 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-gray-800 mb-1">Need help with the platform?</h3>
                <p className="text-sm text-gray-700">Our support team is here for you 24/7.</p>
              </div>
              <div className="flex flex-col sm:items-end gap-1 text-sm">
                <a href="tel:+919847362510" className="font-semibold text-emerald-700 hover:text-emerald-800">
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

      {page === 'community' && <CommunityHub />}

      {page === 'about' && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">About AgriConnect</h1>
          <p className="text-gray-600 leading-relaxed">
            AgriConnect is a smart agricultural platform built for new-generation farmers, combining
            AI-driven crop and yield intelligence, real-time weather data, and a supportive farmer
            community — helping you farm smarter, not harder.
          </p>
        </div>
      )}

      {activeModal === 'recommend' && <CropRecommendation onClose={() => setActiveModal(null)} />}
      {activeModal === 'yield' && <YieldPrediction onClose={() => setActiveModal(null)} />}
      {activeModal === 'disease' && <DiseaseDetection onClose={() => setActiveModal(null)} />}
      {activeModal === 'fertilizer' && <FertilizerGuide onClose={() => setActiveModal(null)} />}
      {activeModal === 'weather' && <WeatherForecast onClose={() => setActiveModal(null)} />}
    </div>
  );
}
