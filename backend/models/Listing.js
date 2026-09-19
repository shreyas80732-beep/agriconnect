const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema(
  {
    sellerName: { type: String, required: true },
    contact: { type: String, required: true },
    category: {
      type: String,
      enum: ['Seeds', 'Equipment', 'Produce', 'Fertilizer', 'Other'],
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    unit: { type: String, default: 'unit' }, // e.g. per kg, per acre, per item
    location: { type: String, required: true },
    imageUrl: { type: String, default: '' },
    status: { type: String, enum: ['Available', 'Sold'], default: 'Available' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Listing', listingSchema);
