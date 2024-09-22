import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  // username: {
  //   type: String,
  //   required: [true, 'Please provide a username'],
  //   unique: true,
  //   trim: true,
  //   minlength: [3, 'Username must be at least 3 characters long']
  // },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'business'],
    default: 'business'
  }
}, {
  timestamps: true,
  collection: 'users'
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
