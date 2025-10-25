import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { formatAddress } from '../utils/web3';
import { formatSolanaAddress } from '../utils/solana';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full"
      >
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="text-8xl mb-4"
          >
            🎉
          </motion.div>
          <h1 className="text-5xl font-bold mb-2 gradient-text">
            Welcome Back!
          </h1>
          <p className="text-xl text-base-content/70">
            Hello, <span className="font-semibold text-primary">{user?.username}</span>
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="stats stats-vertical lg:stats-horizontal shadow-xl bg-base-200/80 backdrop-blur-sm border border-base-300 w-full mb-8"
        >
          <div className="stat">
            <div className="stat-figure text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <div className="stat-title text-base-content/60">Username</div>
            <div className="stat-value text-primary text-2xl">{user?.username}</div>
            <div className="stat-desc text-base-content/60">Your unique identifier</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div className="stat-title text-base-content/60">Email Address</div>
            <div className="stat-value text-secondary text-xl break-all">{user?.email}</div>
            <div className="stat-desc text-base-content/60">Verified ✓</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-accent">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <div className="stat-title text-base-content/60">Security Level</div>
            <div className="stat-value text-accent text-2xl">High</div>
            <div className="stat-desc text-base-content/60">Multi-factor enabled</div>
          </div>
        </motion.div>

        {/* Wallet Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card bg-base-200/80 backdrop-blur-sm border border-base-300 shadow-xl hover:shadow-primary/20 mb-8"
        >
          <div className="card-body">
            <h2 className="card-title justify-center text-2xl mb-4 text-base-content">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Connected Wallet
            </h2>
            
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center gap-3">
                <img 
                  src={user?.walletType === 'ethereum' ? '/metamask.png' : '/phantom.png'}
                  alt={user?.walletType === 'ethereum' ? 'MetaMask' : 'Phantom'}
                  className="w-12 h-12 object-contain"
                />
                <div className="text-left">
                  <div className="font-semibold text-lg text-base-content">
                    {user?.walletType === 'ethereum' ? 'MetaMask' : 'Phantom'} Wallet
                  </div>
                  <div className="badge badge-success gap-2 bg-success/20 border-success/30">
                    <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                    <span className="text-white">Connected</span>
                  </div>
                </div>
              </div>

              <div className="divider my-2"></div>

              <div className="w-full space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-base-content/60">Network:</span>
                  <div className="badge badge-outline border-primary/30 text-primary">
                    {user?.walletType === 'ethereum' ? 'Ethereum Mainnet' : 'Solana Mainnet'}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-base-content/60">Address:</span>
                  <code className="text-sm font-mono bg-base-100 text-base-content px-3 py-1 rounded">
                    {user?.walletType === 'ethereum' 
                      ? formatAddress(user?.walletAddress)
                      : formatSolanaAddress(user?.walletAddress)
                    }
                  </code>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Security Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card bg-base-200/80 backdrop-blur-sm border border-base-300 shadow-xl hover:shadow-secondary/20 mb-8"
        >
          <div className="card-body">
            <h2 className="card-title justify-center text-2xl mb-4 text-base-content">
              🔐 Security Features Active
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-success/10 rounded-lg border border-success/20">
                <div className="text-2xl">✓</div>
                <div>
                  <div className="font-semibold text-success">Email Verified</div>
                  <div className="text-sm text-base-content/60">Your email address is confirmed</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-success/10 rounded-lg border border-success/20">
                <div className="text-2xl">✓</div>
                <div>
                  <div className="font-semibold text-success">Wallet Authenticated</div>
                  <div className="text-sm text-base-content/60">Blockchain signature verified</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-success/10 rounded-lg border border-success/20">
                <div className="text-2xl">✓</div>
                <div>
                  <div className="font-semibold text-success">Multi-Layer Auth</div>
                  <div className="text-sm text-base-content/60">Multiple security checkpoints</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-success/10 rounded-lg border border-success/20">
                <div className="text-2xl">✓</div>
                <div>
                  <div className="font-semibold text-success">Crypto Protected</div>
                  <div className="text-sm text-base-content/60">Cryptographic verification active</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Last Login Info */}
        {user?.lastLogin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="alert bg-base-200/60 backdrop-blur-sm border border-base-300 shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <div className="font-semibold text-base-content">Last Login</div>
              <div className="text-sm text-base-content/60">{new Date(user.lastLogin).toLocaleString()}</div>
            </div>
          </motion.div>
        )}

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8 space-y-2"
        >
          <div className="divider"></div>
          <p className="text-sm text-base-content/60">
            🔒 This is a demonstration of blockchain-based 2FA authentication
          </p>
          <p className="text-sm text-base-content/60">
            Your account is secured with both password and wallet signature verification
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HomePage;
