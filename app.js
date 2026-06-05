import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './db.js';
import Merchant from './models/merchantModel.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoints

/**
 * POST /api/payments/getXeroData
 * Receives: { merchantID }
 * Returns: Merchant configuration JSON object
 */
app.post('/api/payments/getXeroData', async (req, res) => {
  try {
    const { merchantID } = req.body;
    console.log(`[getXeroData] Request received for merchant ID: ${merchantID}`);
    
    if (!merchantID) {
      return res.status(400).json({ error: 'merchantID is required' });
    }

    const merchant = await Merchant.findOne({ merchantID });
    
    if (!merchant) {
      console.warn(`[getXeroData] Merchant not found: ${merchantID}`);
      return res.status(404).json({ error: `No configuration found for merchant: ${merchantID}` });
    }

    console.log(`[getXeroData] Found configuration for merchant: ${merchantID}`);
    return res.status(200).json({ data: merchant });
  } catch (error) {
    console.error('[getXeroData] Error:', error.message);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

/**
 * POST /api/payments/updateRefreshTokenXero
 * Receives: { merchantID, refreshToken }
 * Returns: Status message
 */
app.post('/api/payments/updateRefreshTokenXero', async (req, res) => {
  try {
    const { merchantID, refreshToken } = req.body;
    console.log(`[updateRefreshTokenXero] Request received to update token for merchant: ${merchantID}`);

    if (!merchantID || !refreshToken) {
      return res.status(400).json({ error: 'merchantID and refreshToken are required' });
    }

    const merchant = await Merchant.findOneAndUpdate(
      { merchantID },
      { refreshToken },
      { new: true }
    );

    if (!merchant) {
      console.warn(`[updateRefreshTokenXero] Merchant not found: ${merchantID}`);
      return res.status(404).json({ error: `No configuration found for merchant: ${merchantID}` });
    }

    console.log(`[updateRefreshTokenXero] Successfully updated token for merchant: ${merchantID}`);
    return res.status(200).json({ message: 'Refresh token updated successfully', merchantID });
  } catch (error) {
    console.error('[updateRefreshTokenXero] Error:', error.message);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Mock Kuber API server running on port ${PORT}`);
});

export default app;
