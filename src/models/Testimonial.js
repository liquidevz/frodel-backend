import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    testimonial: {
      type: String,
      required: [true, 'Please provide testimonial text'],
      trim: true,
    },
    by: {
      type: String,
      required: [true, 'Please provide author name'],
      trim: true,
    },
    imgSrc: {
      type: String,
      required: [true, 'Please provide image source'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Testimonial', testimonialSchema);
