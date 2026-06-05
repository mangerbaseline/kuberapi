import mongoose from 'mongoose';

console.log(`[MerchantModel] Defining merchant schema...`);

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

console.log(`[MerchantModel] Merchant schema defined with fields: merchantID, postmanToken, xeroClientId, xeroClientSecret, xeroTenantId, baseUrl, paymentUrl, userID, webhookURL, refreshToken`);

const Merchant = mongoose.model('Merchant', merchantSchema);
console.log(`[MerchantModel] Merchant model registered with Mongoose`);

export default Merchant;