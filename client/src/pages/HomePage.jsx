import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { formatAddress } from '../utils/web3';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <div className="card-glass text-center">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="text-8xl mb-6"
          >
            🎉
          </motion.div>

          {/* Welcome Message */}
          <h1 className="text-4xl font-bold gradient-text mb-4">
            Welcome, {user?.username}!
          </h1>
          
          <p className="text-xl text-text-secondary mb-8">
            You've successfully logged in with blockchain 2FA
          </p>

          {/* User Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="p-4 bg-dark-bg rounded-lg border border-zinc-700">
              <p className="text-sm text-text-muted mb-2">Username</p>
              <p className="text-lg font-semibold text-text-primary">{user?.username}</p>
            </div>

            <div className="p-4 bg-dark-bg rounded-lg border border-zinc-700">
              <p className="text-sm text-text-muted mb-2">Email</p>
              <p className="text-lg font-semibold text-text-primary">{user?.email}</p>
            </div>

            <div className="p-4 bg-dark-bg rounded-lg border border-zinc-700 md:col-span-2">
              <p className="text-sm text-text-muted mb-2">Connected Wallet</p>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-lg font-mono font-semibold text-green-500">
                  {formatAddress(user?.walletAddress)}
                </p>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="p-6 bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10 border border-accent-primary/20 rounded-lg">
            <h3 className="text-xl font-semibold mb-3 text-text-primary">
              🔐 Your Account is Secured
            </h3>
            <div className="text-left space-y-2 text-sm text-text-secondary">
              <div className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Email verified and confirmed</span>
              </div>
              <div className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Wallet authenticated via blockchain signature</span>
              </div>
              <div className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Multi-layer authentication active</span>
              </div>
              <div className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Protected by cryptographic verification</span>
              </div>
            </div>
          </div>

          {/* Last Login */}
          {user?.lastLogin && (
            <p className="mt-6 text-sm text-text-muted">
              Last login: {new Date(user.lastLogin).toLocaleString()}
            </p>
          )}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <p className="text-text-muted text-sm">
            This is a demonstration of blockchain-based 2FA authentication.
          </p>
          <p className="text-text-muted text-sm mt-2">
            Your account is secured with both password and wallet signature verification.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HomePage;
