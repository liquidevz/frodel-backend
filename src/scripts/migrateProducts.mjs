import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function migrateProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const products = await db.collection('products').find({}).toArray();

    for (const product of products) {
      const update = {};
      
      if (product.imageUrl || product.imageKey) {
        update.$set = { images: product.imageUrl ? [{ url: product.imageUrl, filename: product.imageKey || '' }] : [] };
        update.$unset = { imageUrl: '', imageKey: '' };
        await db.collection('products').updateOne({ _id: product._id }, update);
      }
    }

    console.log('✅ Products migrated successfully!');
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error migrating products:', error);
    process.exit(1);
  }
}

migrateProducts();
