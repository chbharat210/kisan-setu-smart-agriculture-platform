import express from 'express';

import MandiPrice from '../models/MandiPrice.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();


// GET all mandi prices
router.get('/', authMiddleware, async (req, res) => {
  try {
    const prices = await MandiPrice.find()
      .sort({ priceDate: -1 });

    res.json(prices);

  } catch (error) {
    console.error('Get mandi prices error:', error);

    res.status(500).json({
      message: 'Failed to fetch mandi prices.'
    });
  }
});


// GET mandi prices by crop
router.get('/crop/:crop', authMiddleware, async (req, res) => {
  try {
    const prices = await MandiPrice.find({
      crop: {
        $regex: req.params.crop,
        $options: 'i'
      }
    }).sort({ priceDate: -1 });

    res.json(prices);

  } catch (error) {
    console.error('Crop mandi prices error:', error);

    res.status(500).json({
      message: 'Failed to fetch crop prices.'
    });
  }
});


// GET mandi prices by state
router.get('/state/:state', authMiddleware, async (req, res) => {
  try {
    const prices = await MandiPrice.find({
      state: {
        $regex: req.params.state,
        $options: 'i'
      }
    }).sort({ priceDate: -1 });

    res.json(prices);

  } catch (error) {
    console.error('State mandi prices error:', error);

    res.status(500).json({
      message: 'Failed to fetch state prices.'
    });
  }
});


// ADD a mandi price
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      crop,
      market,
      state,
      variety,
      minPrice,
      maxPrice,
      modalPrice,
      unit,
      trend,
      priceDate
    } = req.body;

    if (
      !crop ||
      !market ||
      !state ||
      minPrice === undefined ||
      maxPrice === undefined ||
      modalPrice === undefined
    ) {
      return res.status(400).json({
        message: 'Crop, market, state and price details are required.'
      });
    }

    const mandiPrice = await MandiPrice.create({
      crop: crop.trim(),
      market: market.trim(),
      state: state.trim(),
      variety: variety || 'Common',
      minPrice,
      maxPrice,
      modalPrice,
      unit: unit || '₹/Quintal',
      trend: trend || 'stable',
      priceDate: priceDate || new Date()
    });

    res.status(201).json({
      message: 'Mandi price added successfully.',
      price: mandiPrice
    });

  } catch (error) {
    console.error('Add mandi price error:', error);

    res.status(500).json({
      message: 'Failed to add mandi price.'
    });
  }
});


// DELETE a mandi price
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const price = await MandiPrice.findByIdAndDelete(
      req.params.id
    );

    if (!price) {
      return res.status(404).json({
        message: 'Mandi price not found.'
      });
    }

    res.json({
      message: 'Mandi price deleted successfully.'
    });

  } catch (error) {
    console.error('Delete mandi price error:', error);

    res.status(500).json({
      message: 'Failed to delete mandi price.'
    });
  }
});


export default router;