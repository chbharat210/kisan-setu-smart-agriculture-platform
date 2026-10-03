import mongoose from 'mongoose';

const governmentSchemeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    benefits: {
      type: [String],
      default: []
    },

    eligibility: {
      type: [String],
      default: []
    },

    documents: {
      type: [String],
      default: []
    },

    state: {
      type: String,
      default: 'All India',
      trim: true
    },

    ministry: {
      type: String,
      default: 'Ministry of Agriculture',
      trim: true
    },

    officialLink: {
      type: String,
      default: '',
      trim: true
    },

    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const GovernmentScheme = mongoose.model(
  'GovernmentScheme',
  governmentSchemeSchema
);

export default GovernmentScheme;