import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true
  },
  otp: {
    type: String,
    required: [true, 'OTP is required']
  },
  verified: {
    type: Boolean,
    default: false
  },
  attempts: {
    type: Number,
    default: 0,
    max: 3
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
otpSchema.index({ email: 1 });
otpSchema.index({ createdAt: 1 });

const OTP = mongoose.model('OTP', otpSchema);

export default OTP;
