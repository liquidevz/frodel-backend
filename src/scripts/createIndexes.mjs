import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/database.js';

dotenv.config();

const createIndexes = async () => {
  try {
    await connectDB();
    
    console.log('Creating database indexes...');
    
    const db = mongoose.connection.db;
    
    // Products indexes
    await db.collection('products').createIndex({ name: 1 });
    await db.collection('products').createIndex({ category: 1 });
    await db.collection('products').createIndex({ isActive: 1 });
    await db.collection('products').createIndex({ createdAt: -1 });
    
    // Enquiries indexes
    await db.collection('enquiries').createIndex({ status: 1 });
    await db.collection('enquiries').createIndex({ customerEmail: 1 });
    await db.collection('enquiries').createIndex({ createdAt: -1 });
    
    // Users indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ role: 1 });
    
    // Categories indexes
    await db.collection('categories').createIndex({ slug: 1 }, { unique: true });
    
    console.log('✅ All indexes created successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
    process.exit(1);
  }
};

createIndexes();
