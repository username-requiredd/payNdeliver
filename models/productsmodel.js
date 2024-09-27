import mongoose from 'mongoose';

const ProductsSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: [String],
      required: false,  
      trim: true,      
    },
    

    image: {
      type: String,
      trim: true,
    },
    instock: {
      type: Number,
      required: true,
      min: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
    brand: {
      type: String,
      trim: true,
      maxlength: 50,
    },
  },
  {
    timestamps: true,
    collection: 'products',
  }
);

ProductsSchema.index({ businessId: 1, category: 1 });
ProductsSchema.index({ name: 'text', description: 'text' });

const ProductModel = mongoose.models.Product || mongoose.model('Product', ProductsSchema);

export default ProductModel;