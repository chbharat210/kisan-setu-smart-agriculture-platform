import mongoose from 'mongoose';

const mandiPriceSchema = new mongoose.Schema(
  {
    crop: {
      type: String,
      required: true,
      trim: true
    },

    market: {
      type: String,
      required: true,
      trim: true
    },

    state: {
      type: String,
      required: true,
      trim: true
    },

    variety: {
      type: String,
      default: 'Common',
      trim: true
    },

    minPrice: {
      type: Number,
      required: true
    },

    maxPrice: {
      type: Number,
      required: true
    },

    modalPrice: {
      type: Number,
      required: true
    },

    unit: {
      type: String,
      default: '₹/Quintal'
    },

    trend: {
      type: String,
      enum: ['up', 'down', 'stable'],
      default: 'stable'
    },

    priceDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

const MandiPrice = mongoose.model(
  'MandiPrice',
  mandiPriceSchema
);

export default MandiPrice;