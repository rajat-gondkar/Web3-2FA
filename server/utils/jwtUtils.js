import jwt from 'jsonwebtoken';

/**
 * Generate JWT token for authenticated user
 * @param {string} userId - User's MongoDB ID
 * @returns {string} - JWT token
 */
export const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '1h' }
  );
};

/**
 * Generate temporary token for wallet verification during login
 * @param {string} userId - User's MongoDB ID
 * @returns {string} - Temporary JWT token
 */
export const generateTempToken = (userId) => {
  return jwt.sign(
    { userId, temp: true },
    process.env.JWT_SECRET,
    { expiresIn: process.env.TEMP_TOKEN_EXPIRE || '5m' }
  );
};

/**
 * Verify and decode JWT token
 * @param {string} token - JWT token to verify
 * @returns {object} - Decoded token payload
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
