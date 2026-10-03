import mongoose from 'mongoose';

const aiMessageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    }
  },
  { _id: false }
);

const aiConversationSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    messages: {
      type: [aiMessageSchema],
      default: []
    }
  },
  { timestamps: true }
);

const AIConversation = mongoose.model(
  'AIConversation',
  aiConversationSchema
);

export default AIConversation;