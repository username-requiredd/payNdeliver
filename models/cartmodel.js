import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: false
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  image: {
    type: String,
    required: true
  },
  storeId: {
    type: mongoose.Schema.Types.ObjectId, 
    // required: true,
    ref: "Store"  
    },
  storeName: {
    type: String,
    // required: true
  }
}, { _id: false });

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  products: [productSchema],
  total: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  collection: 'cart',
});

const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);

export default Cart;
