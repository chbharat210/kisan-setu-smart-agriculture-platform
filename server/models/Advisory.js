import mongoose from 'mongoose';

const advisorySchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    crop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Crop',
      required: true
    },

    question: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      default: 'General',
      trim: true
    },

    answer: {
      type: String,
      default: ''
    },

    status: {
      type: String,
      default: 'Answered'
    }
  },
  {
    timestamps: true
  }
);

const Advisory = mongoose.model('Advisory', advisorySchema);

export default Advisory;