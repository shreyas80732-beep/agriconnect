const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: '' },
    cropConcern: { type: String, required: true },
    description: { type: String, required: true },
    preferredDate: { type: Date },
    status: {
      type: String,
      enum: ['Pending', 'Scheduled', 'Completed'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Consultation', consultationSchema);
