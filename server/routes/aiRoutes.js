import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import AIConversation from '../models/AIConversation.js';

const router = express.Router();

const generateFarmingResponse = (message) => {
  const text = message.toLowerCase();

  if (text.includes('wheat')) {
    return 'For wheat cultivation, focus on proper irrigation, balanced nitrogen application, weed management, and regular monitoring for rust and aphids.';
  }

  if (text.includes('rice')) {
    return 'For rice, maintain suitable water levels, use recommended fertilizer doses, and monitor the crop regularly for pests and diseases.';
  }

  if (text.includes('fertilizer')) {
    return 'Fertilizer requirements depend on the crop, soil condition, and growth stage. A soil test is the best basis for deciding nutrient application.';
  }

  if (
    text.includes('disease') ||
    text.includes('pest') ||
    text.includes('insect')
  ) {
    return 'Please identify the crop, visible symptoms, and affected plant parts. For accurate diagnosis, consult an agricultural expert or use the Disease Detection feature.';
  }

  if (text.includes('weather')) {
    return 'You can use the Weather Advisory section in Kisan Setu to check current weather conditions and the upcoming forecast for your selected location.';
  }

  if (
    text.includes('mandi') ||
    text.includes('price') ||
    text.includes('market')
  ) {
    return 'You can check available crop prices and market information in the Mandi Prices section of Kisan Setu.';
  }

  return 'I can help with crop cultivation, irrigation, fertilizers, pests, diseases, weather, mandi prices, and government farming schemes. Please provide more details about your farming question.';
};

// Get conversation history
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const conversation = await AIConversation.findOne({
      farmer: req.user.userId
    });

    res.json(conversation || { messages: [] });
  } catch (error) {
    console.error('AI history error:', error);
    res.status(500).json({
      message: 'Failed to fetch AI conversation.'
    });
  }
});

// Send message
router.post('/chat', authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: 'Message is required.'
      });
    }

    let conversation = await AIConversation.findOne({
      farmer: req.user.userId
    });

    if (!conversation) {
      conversation = new AIConversation({
        farmer: req.user.userId,
        messages: []
      });
    }

    const userMessage = {
      role: 'user',
      content: message.trim()
    };

    const assistantMessage = {
      role: 'assistant',
      content: generateFarmingResponse(message)
    };

    conversation.messages.push(userMessage);
    conversation.messages.push(assistantMessage);

    await conversation.save();

    res.json({
      message: assistantMessage.content,
      conversation
    });
  } catch (error) {
    console.error('AI chat error:', error);

    res.status(500).json({
      message: 'Failed to process AI request.'
    });
  }
});

// Clear conversation
router.delete('/history', authMiddleware, async (req, res) => {
  try {
    await AIConversation.findOneAndDelete({
      farmer: req.user.userId
    });

    res.json({
      message: 'AI conversation cleared successfully.'
    });
  } catch (error) {
    console.error('Clear AI history error:', error);

    res.status(500).json({
      message: 'Failed to clear AI conversation.'
    });
  }
});

export default router;