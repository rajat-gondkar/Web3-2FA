import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { registerStep1 } from '../../utils/api';
import ProgressBar from '../ProgressBar';

const RegisterStep1 = ({ onNext }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3 || formData.username.length > 20) {
      newErrors.username = 'Username must be 3-20 characters';
    } else if (!/^[a-zA-Z0-9]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters and numbers';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, number, and special character';
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors');
      return;
    }

    setLoading(true);

    try {
      const response = await registerStep1(formData);
      
      if (response.success) {
        toast.success('OTP sent to your email!');
        onNext({
          userId: response.userId,
          email: response.email,
        });
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md"
    >
      <ProgressBar currentStep={1} />

      <div className="card bg-white/80 backdrop-blur-sm shadow-xl border border-base-300/30">
        <div className="card-body">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="card-title text-3xl justify-center mb-2">
              <span className="gradient-text">Create Account</span>
            </h2>
            <p className="text-base-content/60">
              Step 1: Enter your basic information
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Username</span>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="johndoe"
                className={`input input-bordered w-full ${errors.username ? 'input-error' : ''}`}
                disabled={loading}
              />
              {errors.username && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.username}</span>
                </label>
              )}
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email Address</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
                disabled={loading}
              />
              {errors.email && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.email}</span>
                </label>
              )}
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`input input-bordered w-full ${errors.password ? 'input-error' : ''}`}
                disabled={loading}
              />
              {errors.password ? (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.password}</span>
                </label>
              ) : (
                <label className="label">
                  <span className="label-text-alt">Min 8 chars, uppercase, lowercase, number, special char</span>
                </label>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Confirm Password</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={`input input-bordered w-full ${errors.confirmPassword ? 'input-error' : ''}`}
                disabled={loading}
              />
              {errors.confirmPassword && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.confirmPassword}</span>
                </label>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full mt-6"
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-md"></span>
                  Processing...
                </>
              ) : (
                'Next: Verify Email →'
              )}
            </button>
          </form>

          <div className="divider"></div>
          
          <p className="text-center text-sm">
            Already have an account?{' '}
            <a href="/login" className="link link-primary font-semibold">
              Login here
            </a>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default RegisterStep1;
