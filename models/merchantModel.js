import mongoose from 'mongoose';

const merchantSchema = new mongoose.Schema({
  merchantID: { type: String, required: true, unique: true, index: true },
  postmanToken: { type: String, default: '' },
  xeroClientId: { type: String, default: '' },
  xeroClientSecret: { type: String, default: '' },
  xeroTenantId: { type: String, default: '' },
  baseUrl: { type: String, default: '' },
  paymentUrl: { type: String, default: '' },
  userID: { type: String, default: '' },
  webhookURL: { type: String, default: '' },
  refreshToken: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Merchant', merchantSchema);
