import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { registerStep3 } from '../../utils/api';
import {
  connectWallet,
  signMessage,
  createRegistrationMessage,
  isMetaMaskInstalled,
  formatAddress,
} from '../../utils/web3';
import ProgressBar from '../ProgressBar';

const RegisterStep3 = ({ userId, onNext }) => {
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const handleConnectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      toast.error('MetaMask is not installed. Please install MetaMask extension.');
      window.open('https://metamask.io/download/', '_blank');
      return;
    }

    setConnecting(true);

    try {
      const address = await connectWallet();
      setWalletAddress(address);
      toast.success('Wallet connected successfully!');
    } catch (error) {
      console.error('Wallet connection error:', error);
      toast.error(error.message || 'Failed to connect wallet');
    } finally {
      setConnecting(false);
    }
  };

  const handleRegister = async () => {
    if (!walletAddress) {
      toast.error('Please connect your wallet first');
      return;
    }

    setLoading(true);

    try {
      // Create message to sign
      const message = createRegistrationMessage(userId);

      // Request signature from wallet
      toast.loading('Please sign the message in MetaMask...');
      const signature = await signMessage(message);
      toast.dismiss();

      // Send to backend
      const response = await registerStep3({
        userId,
        walletAddress,
        signedMessage: message,
        signature,
      });

      if (response.success) {
        toast.success('🎉 Registration complete! Redirecting to login...');
        setTimeout(() => {
          onNext();
        }, 2000);
      }
    } catch (error) {
      toast.dismiss();
      console.error('Registration error:', error);
      const message = error.message || error.response?.data?.message || 'Registration failed';
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
      <ProgressBar currentStep={3} />

      <div className="card-glass">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🦊</div>
          <h2 className="text-3xl font-bold mb-2 gradient-text">
            Connect Your Wallet
          </h2>
          <p className="text-text-secondary">
            This step is <span className="text-accent-primary font-semibold">mandatory</span> to complete registration
          </p>
        </div>

        <div className="space-y-4">
          {/* Wallet Connection */}
          {!walletAddress ? (
            <div>
              <button
                onClick={handleConnectWallet}
                disabled={connecting}
                className="w-full btn-primary"
              >
                {connecting ? (
                  <span className="flex items-center justify-center">
                    <div className="spinner mr-2"></div>
                    Connecting...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <span className="mr-2">🦊</span>
                    Connect MetaMask Wallet
                  </span>
                )}
              </button>

              <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-sm text-blue-400 text-center">
                  ℹ️ You need MetaMask browser extension to continue
                </p>
              </div>
            </div>
          ) : (
            <div>
              {/* Connected Wallet Display */}
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-muted mb-1">Connected Wallet</p>
                    <p className="font-mono text-green-500 font-semibold">
                      {formatAddress(walletAddress)}
                    </p>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* Sign & Register Button */}
              <button
                onClick={handleRegister}
                disabled={loading}
                className="w-full btn-primary"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="spinner mr-2"></div>
                    Processing...
                  </span>
                ) : (
                  'Sign Message & Complete Registration ✓'
                )}
              </button>

              <button
                onClick={() => setWalletAddress('')}
                disabled={loading}
                className="w-full btn-secondary mt-3"
              >
                Change Wallet
              </button>
            </div>
          )}

          {/* Info Box */}
          <div className="mt-6 p-4 bg-zinc-800/50 border border-zinc-700 rounded-lg">
            <h4 className="text-sm font-semibold mb-2 text-text-primary">
              Why do I need to connect my wallet?
            </h4>
            <ul className="text-xs text-text-secondary space-y-1">
              <li>• Your wallet acts as a second authentication factor</li>
              <li>• No gas fees - you only sign a message</li>
              <li>• Only this wallet can access your account</li>
              <li>• Provides blockchain-level security</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RegisterStep3;
