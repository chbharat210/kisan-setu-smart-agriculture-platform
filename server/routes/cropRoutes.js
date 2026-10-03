import express from 'express';

import Crop from '../models/Crop.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();


// Get logged-in farmer's crops
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const crops = await Crop.find({
      farmer: req.user.userId
    }).sort({ createdAt: -1 });

    res.json(crops);

  } catch (error) {
    console.error('Get crops error:', error);

    res.status(500).json({
      message: 'Failed to fetch crops.'
    });
  }
});


// Add a new crop
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      name,
      season,
      status,
      health
    } = req.body;

    if (!name || !season) {
      return res.status(400).json({
        message: 'Crop name and season are required.'
      });
    }

    const crop = await Crop.create({
      farmer: req.user.userId,
      name: name.trim(),
      season,
      status: status || 'Growing',
      health: health || 'Healthy'
    });

    res.status(201).json({
      message: 'Crop added successfully.',
      crop
    });

  } catch (error) {
    console.error('Add crop error:', error);

    res.status(500).json({
      message: 'Failed to add crop.'
    });
  }
});


// Update a crop
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const {
      name,
      season,
      status,
      health
    } = req.body;

    const crop = await Crop.findOne({
      _id: req.params.id,
      farmer: req.user.userId
    });

    if (!crop) {
      return res.status(404).json({
        message: 'Crop not found.'
      });
    }

    if (name !== undefined) {
      crop.name = name.trim();
    }

    if (season !== undefined) {
      crop.season = season;
    }

    if (status !== undefined) {
      crop.status = status;
    }

    if (health !== undefined) {
      crop.health = health;
    }

    await crop.save();

    res.json({
      message: 'Crop updated successfully.',
      crop
    });

  } catch (error) {
    console.error('Update crop error:', error);

    res.status(500).json({
      message: 'Failed to update crop.'
    });
  }
});


// Delete a crop
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const crop = await Crop.findOneAndDelete({
      _id: req.params.id,
      farmer: req.user.userId
    });

    if (!crop) {
      return res.status(404).json({
        message: 'Crop not found.'
      });
    }

    res.json({
      message: 'Crop deleted successfully.'
    });

  } catch (error) {
    console.error('Delete crop error:', error);

    res.status(500).json({
      message: 'Failed to delete crop.'
    });
  }
});


export default router;