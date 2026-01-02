import mongoose from 'mongoose';

function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const enquirySchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      unique: true,
    },
    customerName: {
      type: String,
      required: [true, 'Please provide customer name'],
      trim: true,
    },
    customerEmail: {
      type: String,
      required: [true, 'Please provide customer email'],
      lowercase: true,
    },
    customerPhone: {
      type: String,
      required: [true, 'Please provide customer phone'],
    },
    companyName: {
      type: String,
      trim: true,
    },
    items: [
      {
        productSlug: {
          type: String,
          required: true,
        },
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    message: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'quoted', 'completed', 'rejected'],
      default: 'new',
    },
    adminNotes: {
      type: String,
      trim: true,
    },
    totalValue: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

enquirySchema.pre('save', async function (next) {
  if (this.isNew) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7);
    this.slug = `enq-${timestamp}-${random}`;
  }
  next();
});

export default mongoose.model('Enquiry', enquirySchema);
