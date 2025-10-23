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
    },
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Instant verification and authentication with optimized blockchain interactions',
    },
    {
      icon: '🛡️',
      title: 'Privacy Focused',
      description: 'Your data stays secure with end-to-end encryption and decentralized storage',
    },
    {
      icon: '🎯',
      title: 'User Friendly',
      description: 'Simple, intuitive interface that makes blockchain authentication accessible to everyone',
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
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-neutral/20">
      {/* Hero Section - Simple and Clean */}
      <section className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <p className="text-sm uppercase tracking-[0.3em] text-primary/60 mb-6 font-light">
              WE ARE LAUNCHING OUR PLATFORM SOON
            </p>
            
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-12 leading-tight">
              <span className="block text-base-content">BLOCKQUEST</span>
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
                    className="btn btn-lg bg-primary text-white border-0 hover:bg-primary/80 transition-all duration-300 shadow-lg"
                  >
                    Get Started
                  </Link>
                  <Link 
                    to="/login"
                    className="btn btn-lg btn-outline border-primary/30 text-primary hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                  >
                    Login
                  </Link>
                </div>
              ) : (
                <button 
                  onClick={() => navigate('/home')}
                  className="btn btn-lg bg-primary text-white border-0 hover:bg-primary/80 w-full transition-all duration-300 shadow-lg"
                >
                  Go to Dashboard
                </button>
              )}
            </div>

            {/* Social Links - Subtle */}
            <div className="flex justify-center gap-6 mt-16">
              <a href="#" className="text-base-content/40 hover:text-primary transition-colors duration-300">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a href="#" className="text-base-content/40 hover:text-primary transition-colors duration-300">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </a>
              <a href="#" className="text-base-content/40 hover:text-primary transition-colors duration-300">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
            </div>

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
      <section className="py-32 px-4 bg-base-100 fade-in-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-base-content">
              Why Choose BlockQuest?
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
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-base-300/30 h-full hover:-translate-y-1">
                  <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-base-content">
                    {feature.title}
                  </h3>
                  <p className="text-base-content/60 leading-relaxed font-light">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 px-4 bg-gradient-to-br from-neutral/10 to-base-200 fade-in-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-base-content">
              How It Works
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
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-base-300/30 h-full">
                  <div className="text-7xl opacity-10 font-bold absolute top-4 right-4">
                    {step.number}
                  </div>
                  <div className="text-5xl mb-6">{step.icon}</div>
                  <h3 className="text-2xl font-semibold mb-3 text-base-content relative z-10">
                    {step.title}
                  </h3>
                  <p className="text-base-content/60 leading-relaxed font-light relative z-10">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-primary/20 z-0"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Wallets Section */}
      <section className="py-32 px-4 bg-base-100 fade-in-section">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-8 text-base-content">
            Supported Wallets
          </h2>
          <p className="text-xl text-base-content/60 mb-16 font-light">
            Connect with your favorite blockchain wallet
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-base-300/30 cursor-pointer transition-all duration-300"
            >
              <div className="text-6xl mb-4">🦊</div>
              <h3 className="text-3xl font-semibold mb-2 text-base-content">MetaMask</h3>
              <p className="text-base-content/60 font-light">Ethereum Network</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-base-300/30 cursor-pointer transition-all duration-300"
            >
              <div className="text-6xl mb-4">👻</div>
              <h3 className="text-3xl font-semibold mb-2 text-base-content">Phantom</h3>
              <p className="text-base-content/60 font-light">Solana Network</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 fade-in-section">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-8 text-base-content">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-12 text-base-content/60 max-w-2xl mx-auto font-light">
              Join thousands of users securing their accounts with blockchain technology
            </p>
            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/register" 
                  className="btn btn-lg bg-primary text-white border-0 hover:bg-primary/80 transition-all duration-300 shadow-lg px-12"
                >
                  Create Account
                </Link>
                <Link 
                  to="/login" 
                  className="btn btn-lg btn-outline border-primary/30 text-primary hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 px-12"
                >
                  Sign In
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-base-200 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-base-content/60 font-light">
            © {new Date().getFullYear()} BlockQuest. Powered by blockchain technology.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
