import express from 'express';
import {
  registerStep1,
  registerStep2,
  registerStep3,
  resendOTP,
  login,
  verifyWallet,
  getCurrentUser
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// ==================== REGISTRATION ROUTES ====================
router.post('/register/step1', registerStep1);
router.post('/register/step2', registerStep2);
router.post('/register/step3', registerStep3);
router.post('/resend-otp', resendOTP);

// ==================== LOGIN ROUTES ====================
router.post('/login', login);
router.post('/verify-wallet', verifyWallet);

// ==================== PROTECTED ROUTES ====================
router.get('/me', protect, getCurrentUser);

export default router;
