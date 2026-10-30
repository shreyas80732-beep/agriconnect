import React, { useState } from 'react';
import {
  X,
  Wheat,
  Droplet,
  Calendar,
  CheckCircle,
  Clock,
  TrendingUp,
  AlertCircle,
  Plus,
  Sprout,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Layers,
  MapPin,
} from 'lucide-react';
import { updateIrrigationMilestone, addFarmerCrop } from '../api/api';

const AVAILABLE_PRESET_CROPS = [
  'Wheat',
  'Rice (Paddy)',
  'Cotton',
  'Tomato',
  'Sugarcane',
  'Maize (Corn)',
];

export default function CropProgressModal({ farmer, onClose, onRefreshFarmer, isOwner = false }) {
  const [selectedCropIndex, setSelectedCropIndex] = useState(0);
  const [showAddCrop, setShowAddCrop] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newCropForm, setNewCropForm] = useState({
    cropName: 'Wheat',
    variety: '',
    fieldArea: '3 Acres',
    plantingDate: new Date().toISOString().split('T')[0],
  });

  const crops = farmer?.plantedCrops || [];
  const currentCrop = crops[selectedCropIndex] || crops[0];

  const handleToggleIrrigation = async (milestoneId, currentStatus) => {
    if (!farmer?._id || !currentCrop?._id) return;
    try {
      await updateIrrigationMilestone(farmer._id, currentCrop._id, milestoneId, {
        completed: !currentStatus,
      });
      if (onRefreshFarmer) onRefreshFarmer();
    } catch (err) {
      console.error('Failed to toggle irrigation milestone', err);
    }
  };

  const handleCreateCrop = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addFarmerCrop(farmer._id, newCropForm);
      setShowAddCrop(false);
      setNewCropForm({
        cropName: 'Wheat',
        variety: '',
        fieldArea: '3 Acres',
        plantingDate: new Date().toISOString().split('T')[0],
      });
      if (onRefreshFarmer) onRefreshFarmer();
    } catch (err) {
      console.error('Failed to plant crop', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-100 max-h-[92vh] flex flex-col">
        {/* Header Banner */}
        <div className="relative bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2 text-emerald-200 text-xs font-semibold uppercase tracking-wider">
            <Sprout className="w-4 h-4 text-amber-300" />
            Farmer Field Growth & Irrigation Monitor
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <span>{farmer.name}'s Farm</span>
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-100 border border-emerald-400/40">
                  {farmer.farmSize || '5 Acres'}
                </span>
              </h2>
              <p className="text-emerald-100/90 text-xs sm:text-sm mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-300" />
                {farmer.village}, {farmer.district}, {farmer.state} · Contact: {farmer.contact}
              </p>
            </div>

            {/* Add Crop button */}
            <button
              onClick={() => setShowAddCrop(!showAddCrop)}
              className="flex items-center gap-1.5 self-start sm:self-auto bg-white hover:bg-emerald-50 text-emerald-800 text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl shadow-md transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 text-emerald-600" />
              {showAddCrop ? 'Cancel Plant Crop' : 'Plant New Crop'}
            </button>
          </div>

          {/* Planted Crops Selection Tabs */}
          {crops.length > 0 && (
            <div className="flex items-center gap-2 mt-5 overflow-x-auto pb-1 scrollbar-none">
              {crops.map((c, i) => (
                <button
                  key={c._id || i}
                  onClick={() => {
                    setSelectedCropIndex(i);
                    setShowAddCrop(false);
                  }}
                  className={`flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                    selectedCropIndex === i && !showAddCrop
                      ? 'bg-white text-emerald-900 shadow-md font-bold'
                      : 'bg-white/10 hover:bg-white/20 text-white/90'
                  }`}
                >
                  <Wheat className="w-3.5 h-3.5" />
                  <span>{c.cropName}</span>
                  <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {c.progressPercent}%
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* New Crop Form Drawer */}
          {showAddCrop && (
            <form
              onSubmit={handleCreateCrop}
              className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-5 mb-4 animate-slide-down space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-emerald-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" /> Plant a New Crop in Your Field
                </h3>
                <span className="text-xs text-gray-500">Auto-generates irrigation & harvest timeline</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Select Crop</label>
                  <select
                    value={newCropForm.cropName}
                    onChange={(e) => setNewCropForm({ ...newCropForm, cropName: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    {AVAILABLE_PRESET_CROPS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Variety (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Sharbati HD-2967"
                    value={newCropForm.variety}
                    onChange={(e) => setNewCropForm({ ...newCropForm, variety: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Planted Area</label>
                  <input
                    type="text"
                    placeholder="e.g. 3 Acres"
                    value={newCropForm.fieldArea}
                    onChange={(e) => setNewCropForm({ ...newCropForm, fieldArea: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Sowing / Planting Date</label>
                <input
                  type="date"
                  value={newCropForm.plantingDate}
                  onChange={(e) => setNewCropForm({ ...newCropForm, plantingDate: e.target.value })}
                  className="w-full sm:w-60 px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCrop(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-all"
                >
                  {submitting ? 'Setting up schedule...' : 'Confirm & Generate Timeline'}
                </button>
              </div>
            </form>
          )}

          {!currentCrop ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <Wheat className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="font-bold text-gray-700">No Active Crops Planted Yet</h3>
              <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                Select "Plant New Crop" above to start tracking irrigation, growth milestones, and yield estimations!
              </p>
            </div>
          ) : (
            <>
              {/* Crop Main Dashboard Card */}
              <div className="bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/40 rounded-2xl p-5 border border-emerald-100/80 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-lg">
                        {currentCrop.variety || currentCrop.cropName}
                      </span>
                      <span className="text-xs text-gray-500 font-medium">
                        Area: {currentCrop.fieldArea || '3 Acres'}
                      </span>
                    </div>
                    <h3 className="text-2xl font-extrabold text-gray-900 mt-1">
                      {currentCrop.cropName} Field Progress
                    </h3>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-xs text-gray-500 block">Growth Health</span>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-full border border-emerald-200">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        {currentCrop.healthStatus || 'Optimal Growth'}
                      </span>
                    </div>

                    <div className="text-right pl-4 border-l border-gray-200">
                      <span className="text-xs text-gray-500 block">Current Stage</span>
                      <span className="text-sm font-bold text-gray-800">
                        {currentCrop.stage || 'Tillering & Vegetative'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar & Percentage */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-gray-700">
                    <span>Overall Cycle Progress</span>
                    <span className="text-emerald-700 font-bold">{currentCrop.progressPercent}% Completed</span>
                  </div>
                  <div className="w-full bg-gray-200/80 rounded-full h-3.5 overflow-hidden p-0.5">
                    <div
                      className="bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 h-full rounded-full transition-all duration-700 shadow-sm"
                      style={{ width: `${currentCrop.progressPercent}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] text-gray-500 pt-1">
                    <span>
                      Sown on:{' '}
                      {currentCrop.plantingDate
                        ? new Date(currentCrop.plantingDate).toLocaleDateString()
                        : 'Start Date'}
                    </span>
                    <span>
                      Target Harvest:{' '}
                      {currentCrop.expectedHarvestDate
                        ? new Date(currentCrop.expectedHarvestDate).toLocaleDateString()
                        : 'In ~75 days'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Two Column Grid: Irrigation Schedule + Harvest Timeline */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 1. Irrigation Schedule Tracker */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                        <Droplet className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 text-sm sm:text-base">Irrigation Schedule</h4>
                        <p className="text-xs text-gray-500">Critical water windows & soil depth requirements</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3.5 flex-1">
                    {currentCrop.irrigationSchedule?.length === 0 ? (
                      <p className="text-xs text-gray-400 py-4">No irrigation milestones configured.</p>
                    ) : (
                      currentCrop.irrigationSchedule?.map((m, idx) => (
                        <div
                          key={m._id || idx}
                          className={`p-3.5 rounded-xl border transition-all ${
                            m.completed
                              ? 'bg-blue-50/40 border-blue-200/80'
                              : 'bg-gray-50/70 border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                    m.completed
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}
                                >
                                  {m.completed ? 'Watered ✓' : 'Upcoming / Due'}
                                </span>
                                <h5 className="font-bold text-xs sm:text-sm text-gray-800">
                                  {m.stageName}
                                </h5>
                              </div>

                              <p className="text-xs text-blue-700 font-medium mt-1">
                                Req: {m.waterRequirement}
                              </p>
                              {m.notes && (
                                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                  {m.notes}
                                </p>
                              )}

                              <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-2">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>Scheduled: {m.dueDate || 'Day ~' + (idx * 25 + 20)}</span>
                              </div>
                            </div>

                            {/* Irrigation toggle checkbox */}
                            <button
                              type="button"
                              onClick={() => handleToggleIrrigation(m._id, m.completed)}
                              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                                m.completed
                                  ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700'
                                  : 'bg-white border border-gray-300 text-gray-700 hover:border-blue-500 hover:bg-blue-50'
                              }`}
                              title="Toggle irrigation status"
                            >
                              <CheckCircle className="w-4 h-4" />
                              <span className="hidden sm:inline">
                                {m.completed ? 'Done' : 'Mark Done'}
                              </span>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* 2. Timeline for Harvest & Growth */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 text-sm sm:text-base">
                          Harvest & Growth Timeline
                        </h4>
                        <p className="text-xs text-gray-500">From seed sowing to combine harvest</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-200">
                    {currentCrop.harvestTimeline?.map((item, idx) => (
                      <div key={item._id || idx} className="relative pl-8 flex items-start gap-3">
                        <div
                          className={`absolute left-1.5 top-1 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center transition-all ${
                            item.completed
                              ? 'border-emerald-600 bg-emerald-600'
                              : 'border-emerald-400'
                          }`}
                        >
                          {item.completed && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>

                        <div className="bg-gray-50/80 rounded-xl p-3 border border-gray-100 flex-1 hover:border-emerald-200 transition-all">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-xs sm:text-sm text-gray-800">
                              {item.milestone}
                            </span>
                            <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                              {item.date || 'Stage ' + (idx + 1)}
                            </span>
                          </div>
                          {item.details && (
                            <p className="text-xs text-gray-500 leading-relaxed">{item.details}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. Expected Yield & Market Outlook Card */}
              <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-teal-500/10 border border-emerald-200/80 rounded-2xl p-5">
                <div className="flex items-center gap-2 text-emerald-900 font-bold mb-3">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  <h4>Agronomic Yield Prediction & Advisory</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3.5 border border-emerald-100 shadow-sm">
                    <span className="text-xs text-gray-500 block">Expected Yield / Acre</span>
                    <span className="text-lg font-bold text-emerald-700">
                      {currentCrop.expectedYield || '25-30 Quintals / Acre'}
                    </span>
                    <span className="text-[11px] text-gray-400 block mt-0.5">Based on local soil & climate</span>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3.5 border border-emerald-100 shadow-sm">
                    <span className="text-xs text-gray-500 block">Estimated Total Plot Output</span>
                    <span className="text-lg font-bold text-gray-800">
                      {currentCrop.estimatedTotalYield || '~80-95 Quintals'}
                    </span>
                    <span className="text-[11px] text-gray-400 block mt-0.5">
                      For {currentCrop.fieldArea || '3 Acres'} plot
                    </span>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3.5 border border-emerald-100 shadow-sm">
                    <span className="text-xs text-gray-500 block">Mandi Trading Outlook</span>
                    <span className="text-lg font-bold text-emerald-800">High Demand</span>
                    <span className="text-[11px] text-emerald-600 block mt-0.5">
                      Direct trade via Farmer Connect
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
