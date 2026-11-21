
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
      required: true,
      min: 0
    },
    maxPrice: {
      type: Number,
      required: true,
      min: 0
    },
    modalPrice: {
      type: Number,
      required: true,
      min: 0
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
      required: true
    }
  },
  {
    timestamps: true
  }
);

const MandiPrice = mongoose.models.MandiPrice ||
  mongoose.model('MandiPrice', mandiPriceSchema);

export default MandiPrice;
