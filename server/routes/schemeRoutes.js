import express from 'express';

import GovernmentScheme from '../models/GovernmentScheme.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();


// GET all active schemes
router.get('/', authMiddleware, async (req, res) => {
  try {
    const schemes = await GovernmentScheme.find({
      active: true
    }).sort({ createdAt: -1 });

    res.json(schemes);

  } catch (error) {
    console.error('Get schemes error:', error);

    res.status(500).json({
      message: 'Failed to fetch government schemes.'
    });
  }
});


// GET schemes by state
router.get('/state/:state', authMiddleware, async (req, res) => {
  try {
    const state = req.params.state;

    const schemes = await GovernmentScheme.find({
      active: true,
      $or: [
        { state: 'All India' },
        {
          state: {
            $regex: state,
            $options: 'i'
          }
        }
      ]
    }).sort({ createdAt: -1 });

    res.json(schemes);

  } catch (error) {
    console.error('State schemes error:', error);

    res.status(500).json({
      message: 'Failed to fetch state schemes.'
    });
  }
});


// GET schemes by category
router.get('/category/:category', authMiddleware, async (req, res) => {
  try {
    const schemes = await GovernmentScheme.find({
      active: true,
      category: {
        $regex: req.params.category,
        $options: 'i'
      }
    }).sort({ createdAt: -1 });

    res.json(schemes);

  } catch (error) {
    console.error('Category schemes error:', error);

    res.status(500).json({
      message: 'Failed to fetch schemes by category.'
    });
  }
});


// GET single scheme
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const scheme = await GovernmentScheme.findOne({
      _id: req.params.id,
      active: true
    });

    if (!scheme) {
      return res.status(404).json({
        message: 'Government scheme not found.'
      });
    }

    res.json(scheme);

  } catch (error) {
    console.error('Get scheme error:', error);

    res.status(500).json({
      message: 'Failed to fetch government scheme.'
    });
  }
});


// ADD scheme
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      benefits,
      eligibility,
      documents,
      state,
      ministry,
      officialLink
    } = req.body;

    if (!name || !category || !description) {
      return res.status(400).json({
        message: 'Name, category and description are required.'
      });
    }

    const scheme = await GovernmentScheme.create({
      name: name.trim(),
      category: category.trim(),
      description: description.trim(),
      benefits: benefits || [],
      eligibility: eligibility || [],
      documents: documents || [],
      state: state || 'All India',
      ministry:
        ministry || 'Ministry of Agriculture',
      officialLink: officialLink || '',
      active: true
    });

    res.status(201).json({
      message: 'Government scheme added successfully.',
      scheme
    });

  } catch (error) {
    console.error('Add scheme error:', error);

    res.status(500).json({
      message: 'Failed to add government scheme.'
    });
  }
});


// UPDATE scheme
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const scheme = await GovernmentScheme.findById(
      req.params.id
    );

    if (!scheme) {
      return res.status(404).json({
        message: 'Government scheme not found.'
      });
    }

    const {
      name,
      category,
      description,
      benefits,
      eligibility,
      documents,
      state,
      ministry,
      officialLink,
      active
    } = req.body;

    if (name !== undefined) {
      scheme.name = name.trim();
    }

    if (category !== undefined) {
      scheme.category = category.trim();
    }

    if (description !== undefined) {
      scheme.description = description.trim();
    }

    if (benefits !== undefined) {
      scheme.benefits = benefits;
    }

    if (eligibility !== undefined) {
      scheme.eligibility = eligibility;
    }

    if (documents !== undefined) {
      scheme.documents = documents;
    }

    if (state !== undefined) {
      scheme.state = state;
    }

    if (ministry !== undefined) {
      scheme.ministry = ministry;
    }

    if (officialLink !== undefined) {
      scheme.officialLink = officialLink;
    }

    if (active !== undefined) {
      scheme.active = active;
    }

    await scheme.save();

    res.json({
      message: 'Government scheme updated successfully.',
      scheme
    });

  } catch (error) {
    console.error('Update scheme error:', error);

    res.status(500).json({
      message: 'Failed to update government scheme.'
    });
  }
});


// DELETE scheme
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const scheme = await GovernmentScheme.findByIdAndDelete(
      req.params.id
    );

    if (!scheme) {
      return res.status(404).json({
        message: 'Government scheme not found.'
      });
    }

    res.json({
      message: 'Government scheme deleted successfully.'
    });

  } catch (error) {
    console.error('Delete scheme error:', error);

    res.status(500).json({
      message: 'Failed to delete government scheme.'
    });
  }
});


export default router;