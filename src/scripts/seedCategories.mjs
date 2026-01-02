import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const categorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  isActive: { type: Boolean, default: true },
});

const Category = mongoose.model('Category', categorySchema);

const CATEGORIES = [
  { name: 'Poultry', slug: 'poultry' },
  { name: 'Seafood', slug: 'seafood' },
  { name: 'Vegetables', slug: 'vegetables' },
  { name: 'Fruits', slug: 'fruits' },
  { name: 'Meat', slug: 'meat' },
  { name: 'Dairy', slug: 'dairy' },
  { name: 'Other', slug: 'other' },
];

async function seedCategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Category.deleteMany({});
    await Category.insertMany(CATEGORIES);

    console.log('✅ Categories seeded successfully!');
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
}

seedCategories();
