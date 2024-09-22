import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  customerName: {
    type:String,
    required: true,
  },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true,
  },
  rating: {
    type: Number,
    },
  comment: {
    type: String,
    required: false,
    maxlength: 500,
  },
  reviewDate: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
  collection: 'reviews',
});

export default mongoose.models.Review || mongoose.model('Review', reviewSchema);
