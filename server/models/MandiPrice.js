
import express from 'express';
import MandiPrice from '../models/MandiPrice.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

const RESOURCE_ID = '9ef84268-d588-465a-a308-a864a43d0070';

// Convert government date (DD/MM/YYYY) into a valid Date.
const parseMarketDate = (value) => {
  if (!value) return null;

  const match = String(value).match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  if (match) {
    const [, day, month, year] = match;
    return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

// GET all mandi prices
router.get('/', authMiddleware, async (req, res) => {
  try {
    const prices = await MandiPrice.find()
      .sort({ priceDate: -1 });

    res.json(prices);
  } catch (error) {
    console.error('Get mandi prices error:', error);
    res.status(500).json({ message: 'Failed to fetch mandi prices.' });
  }
});

// IMPORT official government mandi prices
router.post('/sync', authMiddleware, async (req, res) => {
  try {
    const apiKey = process.env.DATA_GOV_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        message: 'DATA_GOV_API_KEY is not configured.'
      });
    }

    const url = new URL(
      `https://api.data.gov.in/resource/${RESOURCE_ID}`
    );

    url.searchParams.set('api-key', apiKey);
    url.searchParams.set('format', 'json');
    url.searchParams.set('limit', '1000');
    url.searchParams.set('offset', '0');

    const response = await fetch(url);

    if (!response.ok) {
      return res.status(502).json({
        message: `Government data API returned status ${response.status}.`
      });
    }

    const payload = await response.json();

    if (!Array.isArray(payload.records)) {
      console.error('Unexpected government API response:', payload);

      return res.status(502).json({
        message: 'Government API did not return mandi records.'
      });
    }

    const operations = [];

    for (const record of payload.records) {
      const crop = record.commodity?.trim();
      const market = record.market?.trim();
      const state = record.state?.trim();

      const minPrice = Number(record.min_price);
      const maxPrice = Number(record.max_price);
      const modalPrice = Number(record.modal_price);

      const priceDate = parseMarketDate(record.arrival_date);

      if (
        !crop ||
        !market ||
        !state ||
        !priceDate ||
        !Number.isFinite(minPrice) ||
        !Number.isFinite(maxPrice) ||
        !Number.isFinite(modalPrice) ||
        minPrice < 0 ||
        maxPrice < minPrice ||
        modalPrice < minPrice ||
        modalPrice > maxPrice
      ) {
        continue;
      }

      const variety = record.variety?.trim() || 'Common';

      operations.push({
        updateOne: {
          filter: {
            crop,
            market,
            state,
            variety,
            priceDate
          },
          update: {
            $set: {
              crop,
              market,
              state,
              variety,
              minPrice,
              maxPrice,
              modalPrice,
              unit: '₹/Quintal',
              priceDate
            }
          },
          upsert: true
        }
      });
    }

    if (operations.length === 0) {
      return res.json({
        message: 'No valid mandi records were returned.',
        imported: 0
      });
    }

    const result = await MandiPrice.bulkWrite(operations, {
      ordered: false
    });

    res.json({
      message: 'Government mandi data sync completed.',
      received: payload.records.length,
      processed: operations.length,
      inserted: result.upsertedCount,
      updated: result.modifiedCount
    });

  } catch (error) {
    console.error('Mandi sync error:', error);

    res.status(500).json({
      message: 'Failed to sync government mandi prices.'
    });
  }
});

// GET mandi prices by crop
router.get('/crop/:crop', authMiddleware, async (req, res) => {
  try {
    const prices = await MandiPrice.find({
      crop: { $regex: req.params.crop, $options: 'i' }
    }).sort({ priceDate: -1 });

    res.json(prices);
  } catch (error) {
    console.error('Crop mandi prices error:', error);
    res.status(500).json({ message: 'Failed to fetch crop prices.' });
  }
});

// GET mandi prices by state
router.get('/state/:state', authMiddleware, async (req, res) => {
  try {
    const prices = await MandiPrice.find({
      state: { $regex: req.params.state, $options: 'i' }
    }).sort({ priceDate: -1 });

    res.json(prices);
  } catch (error) {
    console.error('State mandi prices error:', error);
    res.status(500).json({ message: 'Failed to fetch state prices.' });
  }
});

// ADD a mandi price
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      crop, market, state, variety,
      minPrice, maxPrice, modalPrice,
      unit, trend, priceDate
    } = req.body;

    if (
      !crop || !market || !state ||
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
    res.status(500).json({ message: 'Failed to add mandi price.' });
  }
});

// DELETE a mandi price
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const price = await MandiPrice.findByIdAndDelete(req.params.id);

    if (!price) {
      return res.status(404).json({ message: 'Mandi price not found.' });
    }

    res.json({ message: 'Mandi price deleted successfully.' });
  } catch (error) {
    console.error('Delete mandi price error:', error);
    res.status(500).json({ message: 'Failed to delete mandi price.' });
  }
});

export default router;
