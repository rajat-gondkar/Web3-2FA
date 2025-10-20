import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import OTP from '../models/OTP.js';
import { generateToken, generateTempToken, verifyToken } from '../utils/jwtUtils.js';
import { sendOTPEmail, generateOTP } from '../utils/emailService.js';
import { verifyWalletSignature, isValidEthereumAddress } from '../utils/walletUtils.js';

// ==================== REGISTRATION STEP 1: BASIC INFORMATION ====================
export const registerStep1 = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    // Validate input
    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    // Validate username format
    if (username.length < 3 || username.length > 20) {
      return res.status(400).json({
        success: false,
        message: 'Username must be between 3 and 20 characters'
      });
    }

    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      return res.status(400).json({
        success: false,
        message: 'Username can only contain letters and numbers'
      });
    }

    // Validate email format
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email'
      });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters'
      });
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain uppercase, lowercase, number, and special character'
      });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: 'Username already taken'
      });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user (Step 1)
    const user = await User.create({
      username,
      email,
      passwordHash,
      registrationStep: 1
    });

    // Generate and send OTP
    const otp = generateOTP();

    // Store OTP in database
    await OTP.create({
      email: user.email,
      otp
    });

    // Send OTP email
    await sendOTPEmail(user.email, otp);

    console.log(`✅ User created (Step 1): ${user.username}`);

    res.status(201).json({
      success: true,
      message: 'OTP sent to your email',
      userId: user._id,
      email: user.email
    });
  } catch (error) {
    console.error('Register Step 1 Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.'
    });
  }
};

// ==================== REGISTRATION STEP 2: EMAIL OTP VERIFICATION ====================
export const registerStep2 = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide userId and OTP'
      });
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is at step 1
    if (user.registrationStep !== 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid registration step'
      });
    }

    // Find OTP
    const otpDoc = await OTP.findOne({ 
      email: user.email,
      verified: false 
    }).sort({ createdAt: -1 }); // Get latest OTP

    if (!otpDoc) {
      return res.status(400).json({
        success: false,
        message: 'No valid OTP found. Please request a new one.'
      });
    }

    // Check if already verified
    if (otpDoc.verified) {
      return res.status(400).json({
        success: false,
        message: 'OTP already used'
      });
    }

    // Check attempts
    if (otpDoc.attempts >= 3) {
      return res.status(400).json({
        success: false,
        message: 'Too many attempts. Please request a new OTP.'
      });
    }

    // Verify OTP
    if (otpDoc.otp !== otp) {
      // Increment attempts
      otpDoc.attempts += 1;
      await otpDoc.save();

      return res.status(400).json({
        success: false,
        message: `Invalid OTP. ${3 - otpDoc.attempts} attempts remaining.`
      });
    }

    // OTP is correct - mark as verified
    otpDoc.verified = true;
    await otpDoc.save();

    // Update user
    user.isEmailVerified = true;
    user.registrationStep = 2;
    await user.save();

    console.log(`✅ Email verified (Step 2): ${user.email}`);

    res.json({
      success: true,
      message: 'Email verified successfully. Please connect your wallet.',
      userId: user._id
    });
  } catch (error) {
    console.error('Register Step 2 Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.'
    });
  }
};

// ==================== REGISTRATION STEP 3: WALLET INTEGRATION ====================
export const registerStep3 = async (req, res) => {
  try {
    const { userId, walletAddress, signedMessage, signature } = req.body;

    if (!userId || !walletAddress || !signedMessage || !signature) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is at step 2 (email verified)
    if (user.registrationStep !== 2) {
      return res.status(400).json({
        success: false,
        message: 'Please verify your email first',
        currentStep: user.registrationStep
      });
    }

    // Validate Ethereum address format
    if (!isValidEthereumAddress(walletAddress)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Ethereum address'
      });
    }

    // Check if wallet already registered by another user
    const existingWallet = await User.findOne({ 
      walletAddress: walletAddress.toLowerCase(),
      _id: { $ne: userId } // Exclude current user
    });

    if (existingWallet) {
      return res.status(400).json({
        success: false,
        message: 'This wallet is already registered to another account'
      });
    }

    // Verify wallet signature
    const isValidSignature = verifyWalletSignature(signedMessage, signature, walletAddress);

    if (!isValidSignature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid wallet signature. Please try again.'
      });
    }

    // Update user with wallet information
    user.walletAddress = walletAddress.toLowerCase();
    user.registrationTxHash = signature; // Store signature as proof
    user.isWalletVerified = true;
    user.registrationStep = 4;
    user.registrationComplete = true;
    await user.save();

    console.log(`✅ Wallet connected (Step 3): ${user.username} - ${walletAddress}`);

    res.json({
      success: true,
      message: 'Registration complete! You can now login.',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        walletAddress: user.walletAddress
      }
    });
  } catch (error) {
    console.error('Register Step 3 Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.'
    });
  }
};

// ==================== RESEND OTP ====================
export const resendOTP = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide userId'
      });
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check rate limiting - count OTPs sent in last 15 minutes
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const recentOTPs = await OTP.countDocuments({
      email: user.email,
      createdAt: { $gte: fifteenMinutesAgo }
    });

    if (recentOTPs >= 3) {
      return res.status(429).json({
        success: false,
        message: 'Too many OTP requests. Please try again in 15 minutes.'
      });
    }

    // Generate new OTP
    const otp = generateOTP();

    // Create new OTP document
    await OTP.create({
      email: user.email,
      otp
    });

    // Send OTP email
    await sendOTPEmail(user.email, otp);

    console.log(`🔄 OTP resent to: ${user.email}`);

    res.json({
      success: true,
      message: 'New OTP sent to your email'
    });
  } catch (error) {
    console.error('Resend OTP Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.'
    });
  }
};

// ==================== LOGIN ====================
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username and password'
      });
    }

    // Find user (can login with username or email)
    const user = await User.findOne({
      $or: [
        { username },
        { email: username.toLowerCase() }
      ]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if registration is complete
    if (!user.registrationComplete) {
      return res.status(403).json({
        success: false,
        message: 'Please complete registration first',
        registrationStep: user.registrationStep,
        userId: user._id
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate temporary token for wallet verification
    const tempToken = generateTempToken(user._id);

    console.log(`🔐 Login initiated: ${user.username}`);

    res.json({
      success: true,
      message: 'Credentials verified. Please verify with your wallet.',
      tempToken,
      walletAddress: user.walletAddress,
      userId: user._id
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.'
    });
  }
};

// ==================== VERIFY WALLET (2FA) ====================
export const verifyWallet = async (req, res) => {
  try {
    const { tempToken, walletAddress, signedMessage, signature } = req.body;

    if (!tempToken || !walletAddress || !signedMessage || !signature) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Verify temporary token
    let decoded;
    try {
      decoded = verifyToken(tempToken);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.'
      });
    }

    // Check if it's a temporary token
    if (!decoded.temp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid token type'
      });
    }

    // Get user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if wallet matches registered wallet
    if (user.walletAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return res.status(403).json({
        success: false,
        message: 'This wallet is not registered to your account',
        expectedWallet: user.walletAddress
      });
    }

    // Verify wallet signature
    const isValidSignature = verifyWalletSignature(signedMessage, signature, walletAddress);

    if (!isValidSignature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid wallet signature. Please try again.'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate full JWT token
    const token = generateToken(user._id);

    console.log(`✅ Login successful: ${user.username}`);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        walletAddress: user.walletAddress
      }
    });
  } catch (error) {
    console.error('Verify Wallet Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.'
    });
  }
};

// ==================== GET CURRENT USER ====================
export const getCurrentUser = async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        walletAddress: req.user.walletAddress,
        lastLogin: req.user.lastLogin
      }
    });
  } catch (error) {
    console.error('Get Current User Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.'
    });
  }
};
