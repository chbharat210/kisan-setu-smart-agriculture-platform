import mongoose from 'mongoose';

const expertQuestionSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    crop: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      required: true,
      trim: true
    },

    urgency: {
      type: String,
      default: 'Normal',
      trim: true
    },

    question: {
      type: String,
      required: true,
      trim: true
    },

    answer: {
      type: String,
      default: ''
    },

    status: {
      type: String,
      enum: [
        'Pending',
        'Answered',
        'In Progress'
      ],
      default: 'Pending'
    }
  },
  {
    timestamps: true
  }
);

const ExpertQuestion = mongoose.model(
  'ExpertQuestion',
  expertQuestionSchema
);

export default ExpertQuestion;