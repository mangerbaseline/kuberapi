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
console.log(`[kuberapi] Starting server initialization...`);
connectDB();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log(`[kuberapi] Middleware configured`);

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

    console.log(`[getXeroData] Querying database for merchant: ${merchantID}`);
    
    if (!merchantID) {
      console.warn(`[getXeroData] Missing merchantID in request body`);
      return res.status(400).json({ error: 'merchantID is required' });
    }

    const merchant = await Merchant.findOne({ merchantID });
    
    if (!merchant) {
      console.warn(`[getXeroData] Merchant not found in DB: ${merchantID}`);
      return res.status(404).json({ error: `No configuration found for merchant: ${merchantID}` });
    }

    console.log(`[getXeroData] Merchant found in DB: ${merchantID}`);
    console.log(`[getXeroData] Merchant data retrieved - refreshToken present: ${!!merchant.refreshToken}`);
    console.log(`[getXeroData] Returning merchant configuration for: ${merchantID}`);
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
    console.log(`[updateRefreshTokenXero] ===== TOKEN UPDATE EVENT STARTED =====`);
    console.log(`[updateRefreshTokenXero] Request received to update token for merchant: ${merchantID}`);
    console.log(`[updateRefreshTokenXero] New refresh token received (length): ${refreshToken?.length || 0}`);

    if (!merchantID || !refreshToken) {
      console.warn(`[updateRefreshTokenXero] Missing required fields - merchantID: ${!!merchantID}, refreshToken: ${!!refreshToken}`);
      return res.status(400).json({ error: 'merchantID and refreshToken are required' });
    }

    console.log(`[updateRefreshTokenXero] Attempting to update token in MongoDB for merchant: ${merchantID}`);

    const merchant = await Merchant.findOneAndUpdate(
      { merchantID },
      { refreshToken },
      { new: true }
    );

    if (!merchant) {
      console.warn(`[updateRefreshTokenXero] Merchant not found in DB: ${merchantID}`);
      return res.status(404).json({ error: `No configuration found for merchant: ${merchantID}` });
    }

    console.log(`[updateRefreshTokenXero] ===== TOKEN UPDATE SUCCESSFUL =====`);
    console.log(`[updateRefreshTokenXero] Token successfully updated in DB for merchant: ${merchantID}`);
    console.log(`[updateRefreshTokenXero] Old token replaced with new refresh token`);
    console.log(`[updateRefreshTokenXero] Merchant document updated at: ${merchant.updatedAt || new Date().toISOString()}`);
    console.log(`[updateRefreshTokenXero] ===== TOKEN UPDATE EVENT COMPLETED =====`);
    return res.status(200).json({ message: 'Refresh token updated successfully', merchantID });
  } catch (error) {
    console.error('[updateRefreshTokenXero] Error updating token:', error.message);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('[kuberapi] Unhandled error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`[kuberapi] ===== SERVER STARTED =====`);
  console.log(`[kuberapi] Mock Kuber API server running on port ${PORT}`);
  console.log(`[kuberapi] Endpoints ready: /api/payments/getXeroData, /api/payments/updateRefreshTokenXero`);
  console.log(`[kuberapi] ========================`);
});

export default app;