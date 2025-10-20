import { verifyToken } from '../utils/jwtUtils.js';
import User from '../models/User.js';

/**
 * Middleware to protect routes - requires valid JWT token
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. Please login.'
      });
    }

    // Verify token
    const decoded = verifyToken(token);

    // Check if this is a temporary token (not allowed for protected routes)
    if (decoded.temp) {
      return res.status(401).json({
        success: false,
        message: 'Temporary token. Please complete wallet verification.'
      });
    }

    // Get user from token
    const user = await User.findById(decoded.userId).select('-passwordHash');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if registration is complete
    if (!user.registrationComplete) {
      return res.status(403).json({
        success: false,
        message: 'Please complete registration first',
        registrationStep: user.registrationStep
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Not authorized. Invalid token.'
    });
  }
};
