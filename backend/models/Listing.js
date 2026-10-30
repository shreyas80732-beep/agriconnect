const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema(
  {
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    sellerName: { type: String, required: true },
    businessName: { type: String, default: '' },
    isVerifiedSeller: { type: Boolean, default: true },
    sellerType: { type: String, default: 'Certified Seller' },
    contact: { type: String, required: true },
    category: {
      type: String,
      enum: ['Seeds', 'Equipment', 'Produce', 'Fertilizer', 'Machinery Rental', 'Other'],
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    unit: { type: String, default: 'unit' }, // e.g. per kg, per acre, per bag, per hour
    location: { type: String, required: true },
    imageUrl: { type: String, default: '' },
    status: { type: String, enum: ['Available', 'Sold'], default: 'Available' },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Listing', listingSchema);
