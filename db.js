import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

// Force DNS resolution using reliable public DNS servers
dns.setServers(['8.8.8.8', '1.1.1.1']);

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://manageratbaseline:manageratbaseline@cluster0.rz5c7p6.mongodb.net/kuber?retryWrites=true&w=majority';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connection established successfully.');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;
