
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './routes/authRoutes.js';
import cropRoutes from './routes/cropRoutes.js';
import advisoryRoutes from './routes/advisoryRoutes.js';
import mandiRoutes from './routes/mandiRoutes.js';
import schemeRoutes from './routes/schemeRoutes.js';
import expertRoutes from './routes/expertRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

dotenv.config();

const app = express();

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'https://kisan-setu-smart-agriculture-platform-1.onrender.com'
];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Kisan Setu API is running'
  });
});

// Authentication Routes
app.use('/api/auth', authRoutes);

// Crop Routes
app.use('/api/crops', cropRoutes);

// Advisory Routes
app.use('/api/advisory', advisoryRoutes);

// Mandi Routes
app.use('/api/mandi', mandiRoutes);

// Government Scheme Routes
app.use('/api/schemes', schemeRoutes);

// Expert Question Routes
app.use('/api/expert', expertRoutes);

// AI Routes
app.use('/api/ai', aiRoutes);

// Server Configuration
const PORT = process.env.PORT || 5001;

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');

    app.listen(PORT, () => {
      console.log(`Kisan Setu server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
  });
