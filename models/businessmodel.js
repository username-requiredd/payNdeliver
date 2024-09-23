import mongoose from 'mongoose';

const OpeningHourSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    required: false,
  },
  openingTime: {
    type: String, 
    required: false,
  },
  closingTime: {
    type: String, 
    required: false,
  },
});

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
    coverImage: { 
      type: String, 
      required: false
    },
    address: { 
      type: String, 
      required: false 
    },
    openingHours: [OpeningHourSchema] // Adding opening hours field
  },
  {
    timestamps: true,
    collection: 'business'
  }
);

const Business = mongoose.models.Business || mongoose.model('Business', BusinessSchema);

export default Business;
