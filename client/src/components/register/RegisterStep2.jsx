import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { registerStep2, resendOTP } from '../../utils/api';
import OTPInput from '../OTPInput';
import ProgressBar from '../ProgressBar';

const RegisterStep2 = ({ userId, email, onNext }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);

    try {
      const response = await registerStep2({ userId, otp });

      if (response.success) {
        toast.success('Email verified successfully!');
        onNext();
      }
    } catch (error) {
      const message = error.response?.data?.message || 'OTP verification failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;

    setResending(true);

    try {
      const response = await resendOTP(userId);

      if (response.success) {
        toast.success('New OTP sent to your email!');
        setCooldown(60); // 60 second cooldown
        setOtp(''); // Clear current OTP input
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to resend OTP';
      toast.error(message);
    } finally {
      setResending(false);
    }
  };

  const maskEmail = (email) => {
    if (!email) return '';
    const [name, domain] = email.split('@');
    return `${name[0]}***@${domain}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md"
    >
      <ProgressBar currentStep={2} />

      <div className="card-glass">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">📧</div>
          <h2 className="text-3xl font-bold mb-2 gradient-text">Check Your Email</h2>
          <p className="text-text-secondary">
            We sent a 6-digit code to
          </p>
          <p className="text-accent-primary font-semibold mt-1">
            {maskEmail(email)}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OTP Input */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-4 text-center">
              Enter Verification Code
            </label>
            <OTPInput length={6} value={otp} onChange={setOtp} />
          </div>

          {/* Resend OTP */}
          <div className="text-center">
            {cooldown > 0 ? (
              <p className="text-sm text-text-muted">
                Resend available in {cooldown}s
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="text-sm link"
              >
                {resending ? 'Sending...' : "Didn't receive code? Resend OTP"}
              </button>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full btn-primary"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <div className="spinner mr-2"></div>
                Verifying...
              </span>
            ) : (
              'Verify Email →'
            )}
          </button>
        </form>

        <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-sm text-yellow-500 text-center">
            💡 Check your spam folder if you don't see the email
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default RegisterStep2;
