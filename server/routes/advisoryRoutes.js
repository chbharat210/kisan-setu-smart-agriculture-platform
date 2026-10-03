import express from 'express';

import Advisory from '../models/Advisory.js';
import Crop from '../models/Crop.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();


// Get farmer's crops
router.get('/crops', authMiddleware, async (req, res) => {
  try {
    const crops = await Crop.find({
      farmer: req.user.userId
    }).sort({ createdAt: -1 });

    res.json(crops);

  } catch (error) {
    console.error('Advisory crops error:', error);

    res.status(500).json({
      message: 'Failed to fetch crops.'
    });
  }
});


// Get advisory history
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const advisories = await Advisory.find({
      farmer: req.user.userId
    })
      .populate('crop', 'name season')
      .sort({ createdAt: -1 });

    res.json(advisories);

  } catch (error) {
    console.error('Advisory history error:', error);

    res.status(500).json({
      message: 'Failed to fetch advisory history.'
    });
  }
});


// Create advisory
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      cropId,
      question,
      category
    } = req.body;

    if (!cropId || !question) {
      return res.status(400).json({
        message: 'Crop and question are required.'
      });
    }

    const crop = await Crop.findOne({
      _id: cropId,
      farmer: req.user.userId
    });

    if (!crop) {
      return res.status(404).json({
        message: 'Crop not found.'
      });
    }

    // Temporary advisory response.
    // Later this can be replaced with a real AI service.
    const answer = `
For ${crop.name}, focus on regular field monitoring,
proper irrigation, weed management, and timely pest
and disease inspection. Follow crop-specific
recommendations based on the current growth stage.
    `.trim();

    const advisory = await Advisory.create({
      farmer: req.user.userId,
      crop: cropId,
      question: question.trim(),
      category: category || 'General',
      answer,
      status: 'Answered'
    });

    const populatedAdvisory = await advisory.populate(
      'crop',
      'name season'
    );

    res.status(201).json({
      message: 'Advisory created successfully.',
      advisory: populatedAdvisory
    });

  } catch (error) {
    console.error('Create advisory error:', error);

    res.status(500).json({
      message: 'Failed to create advisory.'
    });
  }
});


export default router;