import mongoose from 'mongoose';

function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      enum: ['Poultry', 'Seafood', 'Vegetables', 'Fruits', 'Meat', 'Dairy', 'Other'],
    },
    weightPerPiece: {
      type: Number,
      required: [true, 'Please provide weight per piece in grams'],
    },
    piecesPerKg: {
      type: Number,
      required: [true, 'Please provide pieces per kilogram'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
    },
    currency: {
      type: String,
      default: 'INR',
    },
    stock: {
      type: Number,
      default: 0,
    },
    images: [
      {
        url: String,
        filename: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

productSchema.pre('save', async function (next) {
  if (this.isModified('name')) {
    let slug = generateSlug(this.name);
    let slugExists = await mongoose.models.Product.findOne({ slug });
    let counter = 1;
    
    while (slugExists && slugExists._id.toString() !== this._id.toString()) {
      slug = `${generateSlug(this.name)}-${counter}`;
      slugExists = await mongoose.models.Product.findOne({ slug });
      counter++;
    }
    
    this.slug = slug;
  }
  next();
});

export default mongoose.model('Product', productSchema);
