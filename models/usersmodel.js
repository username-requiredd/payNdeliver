import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  phone:{
    type:Number,
    required:false
  },

  address: { 
    type: String, 
    required: false 
  },

  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  role: {
    type: String,
    default: 'user'
  }
}, {
  timestamps: true,
  collection: 'users'
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
