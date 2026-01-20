import mongoose from 'mongoose';

export const connectMongoDB = async (uri: string): Promise<void> => {
  if (!uri || !uri.trim()) {
    throw new Error('MONGO_URI is required');
  }

  try {
    mongoose.set('strictQuery', false);

    const options = {
      serverSelectionTimeoutMS: 5000,
    };

    await mongoose.connect(uri, options);
    console.log('Connected to MongoDB successfully');

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    const close = async (signal?: string) => {
      try {
        await mongoose.connection.close();
        console.log(`MongoDB disconnected${signal ? ` due to ${signal}` : ''}`);
        process.exit(0);
      } catch (err) {
        console.error('Error during MongoDB disconnect:', err);
        process.exit(1);
      }
    };

    process.on('SIGINT', () => close('SIGINT'));
    process.on('SIGTERM', () => close('SIGTERM'));
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};