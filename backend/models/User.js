const mongoose = require('mongoose');

const irrigationMilestoneSchema = new mongoose.Schema(
  {
    stageName: { type: String, required: true },
    dueDate: { type: String, default: '' },
    waterRequirement: { type: String, default: 'Normal' },
    completed: { type: Boolean, default: false },
    completedDate: { type: Date },
    notes: { type: String, default: '' },
  },
  { _id: true }
);

const timelineMilestoneSchema = new mongoose.Schema(
  {
    milestone: { type: String, required: true },
    date: { type: String, default: '' },
    completed: { type: Boolean, default: false },
    details: { type: String, default: '' },
  },
  { _id: true }
);

const plantedCropSchema = new mongoose.Schema(
  {
    cropName: { type: String, required: true },
    variety: { type: String, default: '' },
    plantingDate: { type: Date, default: Date.now },
    expectedHarvestDate: { type: Date },
    stage: { type: String, default: 'Vegetative Growth' },
    progressPercent: { type: Number, default: 25, min: 0, max: 100 },
    fieldArea: { type: String, default: '2 Acres' },
    irrigationSchedule: { type: [irrigationMilestoneSchema], default: [] },
    harvestTimeline: { type: [timelineMilestoneSchema], default: [] },
    expectedYield: { type: String, default: '25-30 Quintals / Acre' },
    estimatedTotalYield: { type: String, default: '50-60 Quintals' },
    healthStatus: { type: String, enum: ['Optimal Growth', 'Healthy', 'Needs Attention', 'Irrigation Due'], default: 'Optimal Growth' },
    notes: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['farmer', 'seller'], required: true, default: 'farmer' },
    state: { type: String, required: true, trim: true },
    district: { type: String, required: true, trim: true },
    village: { type: String, required: true, trim: true },
    farmArea: { type: String, default: '' }, // acres for farmer
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    primaryCrops: { type: [String], default: [] },
    businessName: { type: String, default: '' },
    sellerType: { type: String, default: '' },
    address: { type: String, default: '' },
    plantedCrops: { type: [plantedCropSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
