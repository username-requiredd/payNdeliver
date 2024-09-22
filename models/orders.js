import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  name: {
    type: String,
    required: true,
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0,
  }
});

const orderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true,
  },
  orderItems: {
    type: [orderItemSchema],
    required: true,
    validate: [arrayMinLength, 'Order must contain at least one item']
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  paymentMethod: {
    type: String,
    enum: ['Card', 'Crypto', 'PayPal', 'BankTransfer'],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
    default: 'Pending',
  },
  paymentIntentId: {
    type: String,
  },
  paymentDate: {
    type: Date,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  deliveryDate: {
    type: Date,
  },
  trackingNumber: {
    type: String,
  },
  notes: {
    type: String,
  },
}, {
  timestamps: true,
});

function arrayMinLength(val) {
  return val.length > 0;
}

orderSchema.pre('save', function(next) {
  if (this.isModified('orderItems')) {
    this.orderItems.forEach(item => {
      item.subtotal = item.price * item.quantity;
    });
    this.totalAmount = this.orderItems.reduce((total, item) => total + item.subtotal, 0);
  }
  next();
});

orderSchema.methods.markAsPaid = function(paymentIntentId) {
  this.paymentStatus = 'Paid';
  this.paymentIntentId = paymentIntentId;
  this.paymentDate = new Date();
  this.status = 'Processing';
  return this.save();
};

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;