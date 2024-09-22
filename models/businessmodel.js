import mongoose from 'mongoose';
const BusinessSchema = new mongoose.Schema(
  {
    businessName: { 
      type: String, 
      required: true, 
      trim: true 
    },
    phone: { 
      type: String, 
      required: true, 
      trim: true 
    },
    password: { 
      type: String, 
      required: true, 
    },
    email: { 
      type: String, 
      required: true, 
      trim: true, 
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    businessType: {
      type: String,
      enum: ["restaurant", "grocery", "retail", "others"], 
      required: true
    },
    // Optional fields to be filled later on the dashboard
    coverImage: { 
      type: String, 
      required: false
    },
    address: { 
      type: String, 
      required: false 
    }
  },
  {
    timestamps: true,
    collection: 'business'
  }
);

const Business = mongoose.models.Business || mongoose.model('Business', BusinessSchema);

export default Business;