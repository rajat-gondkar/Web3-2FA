import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { login, verifyWallet } from '../utils/api';
import {
  connectWallet,
  signMessage,
  createLoginMessage,
  isMetaMaskInstalled,
  formatAddress,
} from '../utils/web3';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [step, setStep] = useState(1); // 1: credentials, 2: wallet verification
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [tempToken, setTempToken] = useState('');
  const [expectedWallet, setExpectedWallet] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [walletConnecting, setWalletConnecting] = useState(false);
  
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const response = await login(formData);

      if (response.success) {
        toast.success('Credentials verified! Please connect your wallet.');
        setTempToken(response.tempToken);
        setExpectedWallet(response.walletAddress);
        setUserId(response.userId);
        setStep(2);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);

      // Check if registration is incomplete
      if (error.response?.data?.registrationStep) {
        toast.error('Please complete your registration first');
        setTimeout(() => navigate('/register'), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleWalletVerification = async () => {
    if (!isMetaMaskInstalled()) {
      toast.error('MetaMask is not installed');
      window.open('https://metamask.io/download/', '_blank');
      return;
    }

    setWalletConnecting(true);

    try {
      // Connect wallet
      const walletAddress = await connectWallet();

      // Check if wallet matches
      if (walletAddress.toLowerCase() !== expectedWallet.toLowerCase()) {
        toast.error('This wallet is not registered to your account');
        setWalletConnecting(false);
        return;
      }

      // Create and sign message
      const message = createLoginMessage(userId);
      toast.loading('Please sign the message in MetaMask...');
      const signature = await signMessage(message);
      toast.dismiss();

      // Verify with backend
      const response = await verifyWallet({
        tempToken,
        walletAddress,
        signedMessage: message,
        signature,
      });

      if (response.success) {
        toast.success('Login successful! 🎉');
        authLogin(response.token, response.user);
        setTimeout(() => navigate('/home'), 1000);
      }
    } catch (error) {
      toast.dismiss();
      const message = error.message || error.response?.data?.message || 'Wallet verification failed';
      toast.error(message);
    } finally {
      setWalletConnecting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="card-glass">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🔐</div>
            <h2 className="text-3xl font-bold gradient-text">Welcome Back</h2>
            <p className="text-text-secondary mt-2">
              {step === 1 ? 'Enter your credentials' : 'Verify with your wallet'}
            </p>
          </div>

          {step === 1 ? (
            /* Step 1: Credentials */
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Username or Email
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter username or email"
                  className="input-field"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="input-field"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary mt-6"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="spinner mr-2"></div>
                    Verifying...
                  </span>
                ) : (
                  'Continue to Wallet Verification →'
                )}
              </button>
            </form>
          ) : (
            /* Step 2: Wallet Verification */
            <div className="space-y-4">
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-sm text-blue-400 mb-2">
                  <strong>Expected Wallet:</strong>
                </p>
                <p className="font-mono text-sm text-text-primary">
                  {formatAddress(expectedWallet)}
                </p>
              </div>

              <button
                onClick={handleWalletVerification}
                disabled={walletConnecting}
                className="w-full btn-primary"
              >
                {walletConnecting ? (
                  <span className="flex items-center justify-center">
                    <div className="spinner mr-2"></div>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <span className="mr-2">🦊</span>
                    Connect & Verify Wallet
                  </span>
                )}
              </button>

              <button
                onClick={() => setStep(1)}
                disabled={walletConnecting}
                className="w-full btn-secondary"
              >
                ← Back to Login
              </button>

              <div className="mt-4 p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg">
                <p className="text-xs text-text-secondary text-center">
                  🔒 Connect the wallet you registered with to complete login
                </p>
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-text-secondary">
              Don't have an account?{' '}
              <Link to="/register" className="link font-semibold">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
