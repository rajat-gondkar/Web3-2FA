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
import {
  connectPhantom,
  signMessageWithPhantom,
  createSolanaRegistrationMessage,
  isPhantomInstalled,
  formatSolanaAddress,
} from '../../utils/solana';
import ProgressBar from '../ProgressBar';
import WalletSelector from '../WalletSelector';

const RegisterStep3 = ({ userId, onNext }) => {
  const [walletType, setWalletType] = useState(''); // 'ethereum' or 'solana'
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const handleWalletSelect = (type) => {
    setWalletType(type);
    setWalletAddress(''); // Reset wallet address when changing type
  };

  const handleConnectWallet = async () => {
    if (walletType === 'ethereum') {
      await handleConnectMetaMask();
    } else if (walletType === 'solana') {
      await handleConnectPhantom();
    }
  };

  const handleConnectMetaMask = async () => {
    if (!isMetaMaskInstalled()) {
      toast.error('MetaMask is not installed. Please install MetaMask extension.');
      window.open('https://metamask.io/download/', '_blank');
      return;
    }

    setConnecting(true);

    try {
      const address = await connectWallet();
      setWalletAddress(address);
      toast.success('🦊 MetaMask connected successfully!');
    } catch (error) {
      console.error('MetaMask connection error:', error);
      toast.error(error.message || 'Failed to connect MetaMask');
    } finally {
      setConnecting(false);
    }
  };

  const handleConnectPhantom = async () => {
    if (!isPhantomInstalled()) {
      toast.error('Phantom is not installed. Please install Phantom wallet.');
      window.open('https://phantom.app/', '_blank');
      return;
    }

    setConnecting(true);

    try {
      const address = await connectPhantom();
      setWalletAddress(address);
      toast.success('👻 Phantom connected successfully!');
    } catch (error) {
      console.error('Phantom connection error:', error);
      toast.error(error.message || 'Failed to connect Phantom');
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
      let message, signature;

      if (walletType === 'ethereum') {
        // Ethereum/MetaMask flow
        message = createRegistrationMessage(userId);
        toast.loading('Please sign the message in MetaMask...');
        signature = await signMessage(message);
        toast.dismiss();
      } else if (walletType === 'solana') {
        // Solana/Phantom flow
        message = createSolanaRegistrationMessage(userId, walletAddress);
        toast.loading('Please sign the message in Phantom...');
        signature = await signMessageWithPhantom(message);
        toast.dismiss();
      }

      // Send to backend
      const response = await registerStep3({
        userId,
        walletAddress,
        signedMessage: message,
        signature,
        walletType, // Send wallet type
      });

      if (response.success) {
        toast.success(`🎉 Registration complete with ${walletType === 'ethereum' ? 'MetaMask' : 'Phantom'}! Redirecting to login...`);
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

  const getWalletIcon = () => {
    if (walletType === 'ethereum') return '/metamask.png';
    if (walletType === 'solana') return '/phantom.png';
    return null;
  };

  const getWalletName = () => {
    if (walletType === 'ethereum') return 'MetaMask';
    if (walletType === 'solana') return 'Phantom';
    return 'Wallet';
  };

  const formatWalletAddress = (address) => {
    if (walletType === 'ethereum') return formatAddress(address);
    if (walletType === 'solana') return formatSolanaAddress(address);
    return address;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl"
    >
      <ProgressBar currentStep={3} />

      <div className="card-glass">
        <div className="text-center mb-6">
          <div className="mb-4 flex justify-center">
            {getWalletIcon() ? (
              <img 
                src={getWalletIcon()} 
                alt={getWalletName()}
                className="w-20 h-20 object-contain"
              />
            ) : (
              <div className="text-6xl">👛</div>
            )}
          </div>
          <h2 className="text-3xl font-bold mb-2 gradient-text">
            Connect Your Wallet
          </h2>
          <p className="text-text-secondary">
            This step is <span className="text-accent-primary font-semibold">mandatory</span> to complete registration
          </p>
        </div>

        <div className="space-y-6">
          {/* Step 1: Wallet Selection */}
          {!walletType && (
            <WalletSelector 
              selectedWallet={walletType} 
              onSelect={handleWalletSelect}
            />
          )}

          {/* Step 2: Connect Selected Wallet */}
          {walletType && !walletAddress && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <button
                onClick={() => {
                  setWalletType('');
                  setWalletAddress('');
                }}
                className="mb-4 text-sm text-gray-400 hover:text-white transition-colors"
              >
                ← Change Wallet Type
              </button>

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
                    {getWalletIcon() && (
                      <img 
                        src={getWalletIcon()} 
                        alt={getWalletName()}
                        className="w-5 h-5 mr-2 object-contain"
                      />
                    )}
                    Connect {getWalletName()}
                  </span>
                )}
              </button>

              <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-sm text-blue-400 text-center">
                  ℹ️ You need {getWalletName()} installed to continue
                </p>
              </div>
            </motion.div>
          )}

          {/* Step 3: Sign & Complete Registration */}
          {walletAddress && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Connected Wallet Display */}
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-muted mb-1">
                      Connected {getWalletName()} Wallet
                    </p>
                    <p className="font-mono text-green-500 font-semibold">
                      {formatWalletAddress(walletAddress)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {walletType === 'ethereum' ? 'Ethereum Network' : 'Solana Network'}
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
                  <span className="flex items-center justify-center">
                    <span className="mr-2">✍️</span>
                    Sign & Complete Registration
                  </span>
                )}
              </button>

              <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-sm text-yellow-400 text-center">
                  ⚡ You'll be asked to sign a message (no gas fees required)
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-6 pt-6 border-t border-gray-700">
          <h3 className="text-sm font-semibold text-white mb-3">Why we need this:</h3>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li className="flex items-start">
              <span className="mr-2">🔒</span>
              <span>Your wallet acts as a second factor for authentication</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✅</span>
              <span>No gas fees - only signature verification required</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">👤</span>
              <span>Your wallet is uniquely bound to your account</span>
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default RegisterStep3;
