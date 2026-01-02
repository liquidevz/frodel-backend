import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function addCurrency() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const result = await mongoose.connection.db
      .collection('products')
      .updateMany({}, { $set: { currency: 'INR' } });

    console.log(`✅ Updated ${result.modifiedCount} products with INR currency`);
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addCurrency();
