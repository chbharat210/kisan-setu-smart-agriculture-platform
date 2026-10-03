import express from 'express';

import ExpertQuestion from '../models/ExpertQuestion.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();


// GET my questions
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const questions = await ExpertQuestion.find({
      farmer: req.user.userId
    }).sort({ createdAt: -1 });

    res.json(questions);

  } catch (error) {
    console.error('Get expert questions error:', error);

    res.status(500).json({
      message: 'Failed to fetch expert questions.'
    });
  }
});


// GET single question
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const question = await ExpertQuestion.findOne({
      _id: req.params.id,
      farmer: req.user.userId
    });

    if (!question) {
      return res.status(404).json({
        message: 'Question not found.'
      });
    }

    res.json(question);

  } catch (error) {
    console.error('Get expert question error:', error);

    res.status(500).json({
      message: 'Failed to fetch expert question.'
    });
  }
});


// SUBMIT expert question
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      crop,
      category,
      urgency,
      question
    } = req.body;

    if (!crop || !category || !question) {
      return res.status(400).json({
        message: 'Crop, category and question are required.'
      });
    }

    const expertQuestion = await ExpertQuestion.create({
      farmer: req.user.userId,
      crop: crop.trim(),
      category: category.trim(),
      urgency: urgency || 'Normal',
      question: question.trim(),

      // Demo response for now.
      // Later this can be replaced with a real expert/AI response.
      answer:
        'Your question has been received. An agricultural expert can review your query and provide crop-specific guidance.',

      status: 'Answered'
    });

    res.status(201).json({
      message: 'Question submitted successfully.',
      question: expertQuestion
    });

  } catch (error) {
    console.error('Submit expert question error:', error);

    res.status(500).json({
      message: 'Failed to submit expert question.'
    });
  }
});


// DELETE my question
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const question = await ExpertQuestion.findOneAndDelete({
      _id: req.params.id,
      farmer: req.user.userId
    });

    if (!question) {
      return res.status(404).json({
        message: 'Question not found.'
      });
    }

    res.json({
      message: 'Question deleted successfully.'
    });

  } catch (error) {
    console.error('Delete expert question error:', error);

    res.status(500).json({
      message: 'Failed to delete expert question.'
    });
  }
});


export default router;