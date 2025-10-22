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

      <div className="card bg-base-100 shadow-2xl border border-base-300">
        <div className="card-body">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">📧</div>
            <h2 className="card-title text-3xl justify-center mb-2">
              <span className="gradient-text">Check Your Email</span>
            </h2>
            <p className="text-base-content/60">
              We sent a 6-digit code to
            </p>
            <div className="badge badge-primary badge-lg mt-2 font-mono">
              {maskEmail(email)}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input */}
            <div className="form-control">
              <label className="label justify-center">
                <span className="label-text font-medium">Enter Verification Code</span>
              </label>
              <OTPInput length={6} value={otp} onChange={setOtp} />
            </div>

            {/* Resend OTP */}
            <div className="text-center">
              {cooldown > 0 ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="radial-progress text-primary text-sm" style={{"--value": (60 - cooldown) / 60 * 100, "--size": "2rem", "--thickness": "3px"}}></div>
                  <p className="text-sm opacity-60">
                    Resend available in {cooldown}s
                  </p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="btn btn-ghost btn-sm"
                >
                  {resending ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Sending...
                    </>
                  ) : (
                    "Didn't receive code? Resend OTP"
                  )}
                </button>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="btn btn-primary w-full"
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-md"></span>
                  Verifying...
                </>
              ) : (
                'Verify Email →'
              )}
            </button>
          </form>

          <div className="alert alert-warning mt-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-sm">Check your spam folder if you don't see the email</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RegisterStep2;
