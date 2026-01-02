import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function addSlugs() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    
    // Add slugs to products
    const products = await db.collection('products').find({ slug: { $exists: false } }).toArray();
    for (const product of products) {
      let slug = generateSlug(product.name);
      let counter = 1;
      let slugExists = await db.collection('products').findOne({ slug });
      
      while (slugExists) {
        slug = `${generateSlug(product.name)}-${counter}`;
        slugExists = await db.collection('products').findOne({ slug });
        counter++;
      }
      
      await db.collection('products').updateOne({ _id: product._id }, { $set: { slug } });
    }
    console.log(`✅ Added slugs to ${products.length} products`);

    // Add slugs to enquiries
    const enquiries = await db.collection('enquiries').find({ slug: { $exists: false } }).toArray();
    for (const enquiry of enquiries) {
      const timestamp = Date.now().toString(36);
      const random = Math.random().toString(36).substring(2, 7);
      const slug = `enq-${timestamp}-${random}`;
      await db.collection('enquiries').updateOne({ _id: enquiry._id }, { $set: { slug } });
    }
    console.log(`✅ Added slugs to ${enquiries.length} enquiries`);

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error adding slugs:', error);
    process.exit(1);
  }
}

addSlugs();
