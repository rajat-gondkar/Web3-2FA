import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [20, 'Username cannot exceed 20 characters'],
    match: [/^[a-zA-Z0-9]+$/, 'Username can only contain letters and numbers']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  passwordHash: {
    type: String,
    required: [true, 'Password is required']
  },
  walletAddress: {
    type: String,
    unique: true,
    sparse: true, // Allows null until wallet is connected
    lowercase: true,
    trim: true
  },
  registrationTxHash: {
    type: String,
    sparse: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isWalletVerified: {
    type: Boolean,
    default: false
  },
  registrationStep: {
    type: Number,
    default: 1,
    enum: [1, 2, 3, 4], // 1: Basic Info, 2: Email OTP, 3: Wallet, 4: Complete
    required: true
  },
  registrationComplete: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ walletAddress: 1 });

const User = mongoose.model('User', userSchema);

export default User;
