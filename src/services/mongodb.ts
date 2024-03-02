import mongoose from 'mongoose';

export async function connectToMongoDB() {
  try {
    await mongoose.connect('mongodb://localhost/personal-finance-tracker');
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

export default connectToMongoDB;
