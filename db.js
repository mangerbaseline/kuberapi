import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

// Force DNS resolution using reliable public DNS servers
dns.setServers(['8.8.8.8', '1.1.1.1']);
console.log(`[db] DNS servers configured: 8.8.8.8, 1.1.1.1`);

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://manageratbaseline:manageratbaseline@cluster0.rz5c7p6.mongodb.net/kuber?retryWrites=true&w=majority';

const connectDB = async () => {
  console.log(`[db] Attempting to connect to MongoDB...`);
  console.log(`[db] MongoDB URI: ${MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`); // Mask credentials in log
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('[db] MongoDB connection established successfully.');
  } catch (error) {
    console.error('[db] MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;