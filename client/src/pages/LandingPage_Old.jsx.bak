import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-4xl"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="text-8xl mb-6"
        >
          🔐
        </motion.div>

        {/* Title */}
        <h1 className="text-6xl font-bold mb-4 gradient-text">
          BlockQuest
        </h1>
        
        <p className="text-2xl text-text-secondary mb-8">
          Blockchain-Based 2FA Authentication
        </p>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-6"
          >
            <div className="text-4xl mb-3">🔒</div>
            <h3 className="text-xl font-semibold mb-2">Secure</h3>
            <p className="text-text-secondary text-sm">
              Multi-layer authentication with blockchain wallet verification
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card p-6"
          >
            <div className="text-4xl mb-3">⛓️</div>
            <h3 className="text-xl font-semibold mb-2">Decentralized</h3>
            <p className="text-text-secondary text-sm">
              Your wallet is your key - cryptographically verified
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="card p-6"
          >
            <div className="text-4xl mb-3">🚀</div>
            <h3 className="text-xl font-semibold mb-2">Modern</h3>
            <p className="text-text-secondary text-sm">
              Seamless Web3 integration with MetaMask
            </p>
          </motion.div>
        </div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex gap-4 justify-center"
        >
          {isAuthenticated ? (
            <Link to="/home" className="btn-primary text-lg px-8 py-4">
              Go to Dashboard →
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn-primary text-lg px-8 py-4">
                Get Started
              </Link>
              <Link to="/login" className="btn-secondary text-lg px-8 py-4">
                Login
              </Link>
            </>
          )}
        </motion.div>

        {/* Info */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-12 text-text-muted text-sm"
        >
          Powered by Ethereum • MetaMask • Web3
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LandingPage;
