import { motion } from 'framer-motion';
import { useState } from 'react';

const WalletSelector = ({ onSelect, selectedWallet }) => {
  const wallets = [
    {
      id: 'ethereum',
      name: 'MetaMask',
      description: 'Connect with Ethereum',
      image: '/metamask.png',
      color: 'from-orange-500 to-yellow-500'
    },
    {
      id: 'solana',
      name: 'Phantom',
      description: 'Connect with Solana',
      image: '/phantom.png',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white text-center mb-6">
        Choose Your Wallet
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {wallets.map((wallet) => (
          <motion.button
            key={wallet.id}
            onClick={() => onSelect(wallet.id)}
            className={`
              relative p-6 rounded-xl border-2 transition-all
              ${selectedWallet === wallet.id
                ? 'border-accent-primary bg-accent-primary/10'
                : 'border-gray-700 bg-dark-card hover:border-accent-primary/50'
              }
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Selection indicator */}
            {selectedWallet === wallet.id && (
              <motion.div
                className="absolute top-3 right-3"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <div className="w-6 h-6 rounded-full bg-accent-primary flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </motion.div>
            )}

            {/* Wallet icon - using actual images */}
            <div className="mb-4 w-24 h-24 mx-auto flex items-center justify-center">
              <img 
                src={wallet.image} 
                alt={wallet.name}
                className="w-20 h-20 object-contain"
              />
            </div>

            {/* Wallet info */}
            <h4 className="text-xl font-bold text-white mb-2">
              {wallet.name}
            </h4>
            <p className="text-gray-400 text-sm">
              {wallet.description}
            </p>

            {/* Gradient border effect */}
            {selectedWallet === wallet.id && (
              <motion.div
                className={`absolute inset-0 rounded-xl bg-gradient-to-br ${wallet.color} opacity-20`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {selectedWallet && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-sm text-gray-400 mt-4"
        >
          <p>
            {selectedWallet === 'ethereum' 
              ? 'Make sure you have MetaMask installed' 
              : 'Make sure you have Phantom installed'
            }
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default WalletSelector;
