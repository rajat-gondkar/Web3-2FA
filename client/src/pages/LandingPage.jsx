import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useRef } from 'react';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.fade-in-section').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: '🔐',
      title: 'Secure Authentication',
      description: 'Multi-layer security combining email verification with blockchain technology for unmatched protection',
    },
    {
      icon: '⛓️',
      title: 'Blockchain 2FA',
      description: 'Wallet-based two-factor authentication using cryptographic signatures for maximum security',
    },
    {
      icon: '🌐',
      title: 'Multi-Chain Support',
      description: 'Seamlessly work with Ethereum (MetaMask) or Solana (Phantom) wallets',
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Create Account',
      description: 'Sign up with your email and basic information',
      icon: '📝'
    },
    {
      number: '02',
      title: 'Verify Email',
      description: 'Confirm your identity with a secure OTP code',
      icon: '📧'
    },
    {
      number: '03',
      title: 'Connect Wallet',
      description: 'Link your preferred blockchain wallet',
      icon: '👛'
    },
    {
      number: '04',
      title: 'You\'re Ready!',
      description: 'Enjoy secure, blockchain-powered authentication',
      icon: '🚀'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300">
      {/* Hero Section - Simple and Clean */}
      <section className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <p className="text-sm uppercase tracking-[0.3em] text-primary mb-6 font-light">
              UNLOCK WITH WEB3
            </p>
            
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-12 leading-tight">
              <span className="block gradient-text">Web3-2FA</span>
            </h1>

            <p className="text-lg md:text-xl text-base-content/60 mb-12 max-w-2xl mx-auto font-light">
              Next-generation authentication powered by blockchain technology.
              Secure, simple, and seamless.
            </p>

            {/* Email Newsletter Style Input */}
            <div className="max-w-md mx-auto mb-8">
              {!isAuthenticated ? (
                <div className="flex flex-col gap-4">
                  <Link 
                    to="/register"
                    className="gradient-btn btn-lg"
                  >
                    Get Started
                  </Link>
                  <Link 
                    to="/login"
                    className="btn btn-lg btn-outline border-primary text-primary hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                  >
                    Login
                  </Link>
                </div>
              ) : (
                <button 
                  onClick={() => navigate('/home')}
                  className="gradient-btn btn-lg w-full"
                >
                  Go to Dashboard
                </button>
              )}
            </div>

            {/* Spacer to prevent overlap with scroll indicator */}
            <div className="h-24"></div>

            {/* Scroll indicator */}
            <motion.div 
              className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg className="w-6 h-6 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-4 bg-base-200 fade-in-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-base-content">
              Why Choose <span className="gradient-text">Auth3</span>?
            </h2>
            <p className="text-xl text-base-content/60 max-w-2xl mx-auto font-light">
              Experience the perfect blend of security, simplicity, and innovation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-base-100 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 border border-base-300 h-full hover:-translate-y-1">
                  <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-base-content">
                    {feature.title}
                  </h3>
                  <p className="text-base-content/70 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 px-4 bg-base-100 fade-in-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-base-content">
              <span className="gradient-text">How</span> It Works
            </h2>
            <p className="text-xl text-base-content/60 max-w-2xl mx-auto font-light">
              Get started in minutes with our simple, secure process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-base-200 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:shadow-secondary/20 transition-all duration-300 border border-base-300 h-full">
                  <div className="text-7xl opacity-10 font-bold absolute top-4 right-4 text-primary">
                    {step.number}
                  </div>
                  <div className="text-5xl mb-6">{step.icon}</div>
                  <h3 className="text-2xl font-semibold mb-3 text-base-content relative z-10">
                    {step.title}
                  </h3>
                  <p className="text-base-content/70 leading-relaxed relative z-10">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-primary/30 z-0"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Wallets Section */}
      <section className="py-32 px-4 bg-base-200 fade-in-section">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-8 text-base-content">
            <span className="gradient-text">Supported</span> Wallets
          </h2>
          <p className="text-xl text-base-content/60 mb-16 font-light">
            Connect with your favorite blockchain wallet
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-base-100 backdrop-blur-sm rounded-2xl p-12 shadow-xl hover:shadow-2xl hover:shadow-primary/20 border border-base-300 cursor-pointer transition-all duration-300"
            >
              <div className="mb-6">
                <img src="/metamask.png" alt="MetaMask" className="w-20 h-20 mx-auto object-contain" />
              </div>
              <h3 className="text-3xl font-semibold mb-2 text-base-content">MetaMask</h3>
              <p className="text-base-content/70">Ethereum Network</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-base-100 backdrop-blur-sm rounded-2xl p-12 shadow-xl hover:shadow-2xl hover:shadow-secondary/20 border border-base-300 cursor-pointer transition-all duration-300"
            >
              <div className="mb-6">
                <img src="/phantom.png" alt="Phantom" className="w-20 h-20 mx-auto object-contain" />
              </div>
              <h3 className="text-3xl font-semibold mb-2 text-base-content">Phantom</h3>
              <p className="text-base-content/70">Solana Network</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 fade-in-section">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-8 text-base-content">
              Ready to <span className="gradient-text">Get Started</span>?
            </h2>
            <p className="text-xl mb-12 text-base-content/60 max-w-2xl mx-auto font-light">
              Join thousands of users securing their accounts with blockchain technology
            </p>
            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/register" 
                  className="gradient-btn btn-lg px-12"
                >
                  Create Account
                </Link>
                <Link 
                  to="/login" 
                  className="btn btn-lg btn-outline border-primary text-primary hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 px-12"
                >
                  Sign In
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-base-300 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-base-content/60 font-light">
            © {new Date().getFullYear()} Auth3. Powered by blockchain technology.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
