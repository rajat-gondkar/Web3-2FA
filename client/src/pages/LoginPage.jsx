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
import {
  connectPhantom,
  signMessageWithPhantom,
  createSolanaLoginMessage,
  isPhantomInstalled,
  formatSolanaAddress,
} from '../utils/solana';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [tempToken, setTempToken] = useState('');
  const [expectedWallet, setExpectedWallet] = useState('');
  const [walletType, setWalletType] = useState('');
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
        const walletName = response.walletType === 'ethereum' ? 'MetaMask' : 'Phantom';
        toast.success(`Credentials verified! Please connect your ${walletName} wallet.`);
        setTempToken(response.tempToken);
        setExpectedWallet(response.walletAddress);
        setWalletType(response.walletType);
        setUserId(response.userId);
        setStep(2);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);

      if (error.response?.data?.registrationStep) {
        toast.error('Please complete your registration first');
        setTimeout(() => navigate('/register'), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleWalletVerification = async () => {
    if (walletType === 'ethereum') {
      await handleMetaMaskVerification();
    } else if (walletType === 'solana') {
      await handlePhantomVerification();
    }
  };

  const handleMetaMaskVerification = async () => {
    if (!isMetaMaskInstalled()) {
      toast.error('MetaMask is not installed');
      window.open('https://metamask.io/download/', '_blank');
      return;
    }

    setWalletConnecting(true);

    try {
      const walletAddress = await connectWallet();

      if (walletAddress.toLowerCase() !== expectedWallet.toLowerCase()) {
        toast.error('This wallet is not registered to your account');
        setWalletConnecting(false);
        return;
      }

      const message = createLoginMessage(userId);
      toast.loading('Please sign the message in MetaMask...');
      const signature = await signMessage(message);
      toast.dismiss();

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

  const handlePhantomVerification = async () => {
    if (!isPhantomInstalled()) {
      toast.error('Phantom is not installed');
      window.open('https://phantom.app/', '_blank');
      return;
    }

    setWalletConnecting(true);

    try {
      const walletAddress = await connectPhantom();

      if (walletAddress !== expectedWallet) {
        toast.error('This wallet is not registered to your account');
        setWalletConnecting(false);
        return;
      }

      const message = createSolanaLoginMessage(userId, walletAddress);
      toast.loading('Please sign the message in Phantom...');
      const signature = await signMessageWithPhantom(message);
      toast.dismiss();

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
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-base-100 via-base-200 to-base-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="card bg-base-100 shadow-2xl border border-base-300">
          <div className="card-body">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🔐</div>
              <h2 className="card-title text-3xl justify-center mb-2">
                <span className="gradient-text">Welcome Back</span>
              </h2>
              <p className="text-base-content/60">
                {step === 1 ? 'Enter your credentials' : 'Verify with your wallet'}
              </p>
            </div>

            {step === 1 ? (
              /* Step 1: Credentials */
              <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Username or Email</span>
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter username or email"
                    className="input input-bordered w-full"
                    disabled={loading}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Password</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="input input-bordered w-full"
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full mt-6"
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-md"></span>
                  ) : (
                    'Continue to Wallet Verification →'
                  )}
                </button>
              </form>
            ) : (
              /* Step 2: Wallet Verification */
              <div className="space-y-4">
                <div className="alert bg-info/10 border-info/20">
                  <div className="flex flex-col w-full gap-2">
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span className="font-semibold">Expected {walletType === 'ethereum' ? 'MetaMask' : 'Phantom'} Wallet:</span>
                    </div>
                    <div className="flex items-center gap-2 ml-8">
                      <img 
                        src={walletType === 'ethereum' ? '/metamask.png' : '/phantom.png'}
                        alt="wallet"
                        className="w-5 h-5"
                      />
                      <code className="text-sm font-mono">
                        {walletType === 'ethereum' ? formatAddress(expectedWallet) : formatSolanaAddress(expectedWallet)}
                      </code>
                      <div className="badge badge-sm">
                        {walletType === 'ethereum' ? 'Ethereum' : 'Solana'}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleWalletVerification}
                  disabled={walletConnecting}
                  className="btn btn-primary w-full gap-2"
                >
                  {walletConnecting ? (
                    <>
                      <span className="loading loading-spinner loading-md"></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <img 
                        src={walletType === 'ethereum' ? '/metamask.png' : '/phantom.png'}
                        alt={walletType === 'ethereum' ? 'MetaMask' : 'Phantom'}
                        className="w-5 h-5"
                      />
                      Connect & Verify {walletType === 'ethereum' ? 'MetaMask' : 'Phantom'}
                    </>
                  )}
                </button>

                <button
                  onClick={() => setStep(1)}
                  disabled={walletConnecting}
                  className="btn btn-ghost w-full"
                >
                  ← Back to Login
                </button>

                <div className="alert">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-xs">Connect the wallet you registered with to complete login</span>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="divider"></div>
            <div className="text-center">
              <p className="text-sm text-base-content/60">
                Don't have an account?{' '}
                <Link to="/register" className="link link-primary font-semibold">
                  Register here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
