import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: '🔐',
      title: 'Secure Authentication',
      description: 'Multi-layer security with email and blockchain verification',
      color: 'primary'
    },
    {
      icon: '⛓️',
      title: 'Blockchain 2FA',
      description: 'Wallet-based two-factor authentication using cryptographic signatures',
      color: 'secondary'
    },
    {
      icon: '🌐',
      title: 'Multi-Chain Support',
      description: 'Choose between Ethereum (MetaMask) or Solana (Phantom) wallets',
      color: 'accent'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="hero min-h-[90vh] bg-gradient-to-br from-base-100 via-base-200 to-base-300">
        <div className="hero-content text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mb-8"
            >
              <div className="text-9xl mb-4">🔐</div>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">BlockQuest</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-base-content/70">
              Next-Generation Authentication with{' '}
              <span className="text-primary font-semibold">Blockchain 2FA</span>
            </p>
            
            <p className="text-lg mb-10 text-base-content/60 max-w-2xl mx-auto">
              Secure your account with the power of blockchain technology. 
              Choose your preferred wallet and enjoy military-grade security.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {isAuthenticated ? (
                <button 
                  onClick={() => navigate('/home')}
                  className="gradient-btn btn-lg gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Go to Dashboard
                </button>
              ) : (
                <>
                  <Link to="/register" className="gradient-btn btn-lg gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Get Started
                  </Link>
                  <Link to="/login" className="btn btn-outline btn-lg">
                    Login
                  </Link>
                </>
              )}
            </div>

            {/* Tech Badges */}
            <div className="flex flex-wrap justify-center gap-2 mt-10">
              <div className="badge badge-primary badge-lg gap-2">
                <img src="/metamask.png" alt="MetaMask" className="w-4 h-4" />
                MetaMask
              </div>
              <div className="badge badge-secondary badge-lg gap-2">
                <img src="/phantom.png" alt="Phantom" className="w-4 h-4" />
                Phantom
              </div>
              <div className="badge badge-accent badge-lg">Ethereum</div>
              <div className="badge badge-accent badge-lg">Solana</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-base-200">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why <span className="gradient-text">BlockQuest</span>?
            </h2>
            <p className="text-lg text-base-content/60 max-w-2xl mx-auto">
              Combining traditional authentication with cutting-edge blockchain technology
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border border-base-300 h-full">
                  <div className="card-body items-center text-center">
                    <div className={`text-6xl mb-4 p-4 rounded-full bg-${feature.color}/10`}>
                      {feature.icon}
                    </div>
                    <h3 className="card-title text-2xl mb-2">{feature.title}</h3>
                    <p className="text-base-content/70">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-base-100">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-lg text-base-content/60">
              Simple, secure, and seamless authentication in 3 steps
            </p>
          </motion.div>

          <ul className="steps steps-vertical lg:steps-horizontal w-full">
            <li className="step step-primary">
              <div className="text-left">
                <div className="font-bold">Create Account</div>
                <div className="text-sm text-base-content/60">Enter your basic information</div>
              </div>
            </li>
            <li className="step step-primary">
              <div className="text-left">
                <div className="font-bold">Verify Email</div>
                <div className="text-sm text-base-content/60">Confirm with OTP code</div>
              </div>
            </li>
            <li className="step step-primary">
              <div className="text-left">
                <div className="font-bold">Connect Wallet</div>
                <div className="text-sm text-base-content/60">Link your blockchain wallet</div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Get <span className="gradient-text">Started</span>?
            </h2>
            <p className="text-xl mb-8 text-base-content/70">
              Join the future of secure authentication today
            </p>
            {!isAuthenticated && (
              <Link to="/register" className="gradient-btn btn-lg gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Create Your Account
              </Link>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
