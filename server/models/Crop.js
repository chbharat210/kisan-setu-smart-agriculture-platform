import mongoose from 'mongoose';

const cropSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    season: {
      type: String,
      required: true,
      trim: true
    },

    status: {
      type: String,
      default: 'Growing',
      trim: true
    },

    health: {
      type: String,
      default: 'Healthy',
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const Crop = mongoose.model('Crop', cropSchema);

export default Crop;