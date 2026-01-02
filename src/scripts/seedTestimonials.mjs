import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testimonialSchema = new mongoose.Schema({
  testimonial: String,
  by: String,
  imgSrc: String,
  isActive: { type: Boolean, default: true },
  order: Number,
});

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

const TESTIMONIAL_DATA = [
  {
    testimonial: "Samosa were just too good! Genuinely great taste. Shall try other stuff soon.",
    by: "Dr. Sanket Seth",
    imgSrc: "/imgs/head-shots/1.jpg",
    order: 0,
  },
  {
    testimonial: "Excellent and very nice products! Thanks for your hospitality and time.",
    by: "RG Banquet Thane",
    imgSrc: "/imgs/head-shots/2.jpg",
    order: 1,
  },
  {
    testimonial: "I did order few things, chicken spring roll, chicken biryani, aloo paratha and punjabi samosa from Frodel last week. The delivery was on time and all the items were tasty. The quantity & the quality is worth the money we pay.",
    by: "Prof. Shyamla",
    imgSrc: "/imgs/head-shots/3.jpg",
    order: 2,
  },
  {
    testimonial: "Frodel products .... good to know they are preservative free with no artificial ingredients. AWESOME.",
    by: "Hema Chari",
    imgSrc: "/imgs/head-shots/4.jpg",
    order: 3,
  },
  {
    testimonial: "What a variety. It will be good if Non Veg. products also come in.",
    by: "Savita Rahu",
    imgSrc: "/imgs/head-shots/5.jpg",
    order: 4,
  },
  {
    testimonial: "The Frodel products provide a very good Tiffin for my School going son. It is tasty, healthy, easy & fast to cook. Thankyou Frodel",
    by: "Neeta Singh",
    imgSrc: "/imgs/head-shots/6.jpg",
    order: 5,
  },
  {
    testimonial: "The Frodel products are great in taste. Real value for your money.",
    by: "Mahesh Kunder",
    imgSrc: "/imgs/head-shots/7.jpg",
    order: 6,
  },
  {
    testimonial: "Very Crispy and restaurant like products. Loved it!",
    by: "Ajay Khamkar",
    imgSrc: "/imgs/head-shots/8.jpg",
    order: 7,
  },
];

async function seedTestimonials() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Testimonial.deleteMany({});
    await Testimonial.insertMany(TESTIMONIAL_DATA);

    console.log('✅ Testimonials seeded successfully!');
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding testimonials:', error);
    process.exit(1);
  }
}

seedTestimonials();
