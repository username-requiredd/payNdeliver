import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unitPriceUSD: {
    type: Number,
    required: true,
    min: 0
  },
  subtotalUSD: {
    type: Number,
    required: true,
    min: 0
  }
});

const orderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  items: [orderItemSchema],
  totalAmountUSD: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  payment: {
    type: {
      type: String,
      enum: ['crypto', 'cash'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    amountUSD: {
      type: Number,
      required: true,
      min: 0
    },
    cryptoAmount: {
      type: Number,
      required: function () { return this.type === 'crypto'; } // Required if crypto
    },
    cryptoCurrency: {
      type: String,
      enum: ['BTC', 'ETH', 'USDT', 'SOL', null],
      required: function () { return this.type === 'crypto'; }
    },
    transactionHash: String,
    statusHistory: [{
      status: {
        type: String,
        required: true
      },
      timestamp: {
        type: Date,
        default: Date.now
      },
      notes: String
    }]
  },
  delivery: {
    address: String,
    estimatedDeliveryDate: Date,
    trackingId: String
  }
}, {
  timestamps: true,
  collection: 'orders',

});

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
