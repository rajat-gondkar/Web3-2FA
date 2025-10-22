import User from '../models/User.js';
import OTP from '../models/OTP.js';

/**
 * Delete all incomplete user registrations from the database
 * This includes users who haven't completed all 3 registration steps
 * @returns {Promise<Object>} Object containing deletion statistics
 */
export const cleanupIncompleteUsers = async () => {
  try {
    // Find all users who haven't completed registration
    const incompleteUsers = await User.find({ 
      registrationComplete: false 
    });

    if (incompleteUsers.length === 0) {
      return {
        success: true,
        deletedCount: 0,
        message: 'No incomplete registrations found'
      };
    }

    // Collect emails and IDs for cleanup
    const userIds = incompleteUsers.map(user => user._id);
    const userEmails = incompleteUsers.map(user => user.email);

    // Delete associated OTPs first
    const otpDeleteResult = await OTP.deleteMany({ 
      email: { $in: userEmails } 
    });

    // Delete incomplete users
    const userDeleteResult = await User.deleteMany({ 
      _id: { $in: userIds } 
    });

    console.log(`🧹 Cleanup: Removed ${userDeleteResult.deletedCount} incomplete users and ${otpDeleteResult.deletedCount} OTPs`);

    return {
      success: true,
      deletedCount: userDeleteResult.deletedCount,
      deletedOTPs: otpDeleteResult.deletedCount,
      message: `Successfully cleaned up ${userDeleteResult.deletedCount} incomplete registration(s)`
    };
  } catch (error) {
    console.error('❌ Cleanup Error:', error);
    return {
      success: false,
      deletedCount: 0,
      error: error.message
    };
  }
};

/**
 * Delete a specific incomplete user by email
 * @param {string} email - User's email address
 * @returns {Promise<Object>} Deletion result
 */
export const cleanupUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email, registrationComplete: false });
    
    if (!user) {
      return {
        success: true,
        deleted: false,
        message: 'No incomplete registration found for this email'
      };
    }

    // Delete associated OTP
    await OTP.deleteMany({ email });

    // Delete user
    await User.deleteOne({ _id: user._id });

    console.log(`🧹 Cleanup: Removed incomplete user ${email}`);

    return {
      success: true,
      deleted: true,
      message: `Cleaned up incomplete registration for ${email}`
    };
  } catch (error) {
    console.error('❌ Cleanup Error:', error);
    return {
      success: false,
      deleted: false,
      error: error.message
    };
  }
};

/**
 * Get count of incomplete registrations
 * @returns {Promise<number>} Count of incomplete users
 */
export const getIncompleteUserCount = async () => {
  try {
    const count = await User.countDocuments({ registrationComplete: false });
    return count;
  } catch (error) {
    console.error('❌ Error counting incomplete users:', error);
    return 0;
  }
};
