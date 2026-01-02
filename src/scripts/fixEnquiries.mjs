import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function fixEnquiries() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const enquiries = await db.collection('enquiries').find({}).toArray();

    for (const enquiry of enquiries) {
      const updatedItems = [];
      
      for (const item of enquiry.items) {
        const product = await db.collection('products').findOne({ _id: item.productId });
        if (product) {
          updatedItems.push({
            productSlug: product.slug,
            productId: item.productId,
            quantity: item.quantity,
          });
        }
      }

      await db.collection('enquiries').updateOne(
        { _id: enquiry._id },
        { $set: { items: updatedItems } }
      );
    }

    console.log(`✅ Fixed ${enquiries.length} enquiries`);
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixEnquiries();
