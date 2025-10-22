import { motion } from 'framer-motion';

const WalletSelector = ({ onSelect, selectedWallet }) => {
  const wallets = [
    {
      id: 'ethereum',
      name: 'MetaMask',
      description: 'Connect with Ethereum',
      image: '/metamask.png',
      network: 'Ethereum Mainnet',
      badge: 'ETH'
    },
    {
      id: 'solana',
      name: 'Phantom',
      description: 'Connect with Solana',
      image: '/phantom.png',
      network: 'Solana Mainnet',
      badge: 'SOL'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">
          <span className="gradient-text">Choose Your Wallet</span>
        </h3>
        <p className="text-base-content/60">Select the wallet you want to connect</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {wallets.map((wallet) => (
          <motion.div
            key={wallet.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <button
              onClick={() => onSelect(wallet.id)}
              className={`
                card w-full transition-all duration-300
                ${selectedWallet === wallet.id
                  ? 'bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 border-2 border-primary shadow-xl shadow-primary/20'
                  : 'bg-base-100 border-2 border-base-300 hover:border-primary/50'
                }
              `}
            >
              <div className="card-body items-center text-center">
                {/* Selection indicator */}
                {selectedWallet === wallet.id && (
                  <motion.div
                    className="absolute top-4 right-4"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <div className="badge badge-success gap-2">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                      Selected
                    </div>
                  </motion.div>
                )}

                {/* Wallet icon */}
                <motion.div
                  className="avatar"
                  whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-24 rounded-xl">
                    <img 
                      src={wallet.image} 
                      alt={wallet.name}
                      className="p-2"
                    />
                  </div>
                </motion.div>

                {/* Wallet name */}
                <h4 className="card-title text-xl mt-2">
                  {wallet.name}
                </h4>

                {/* Badge */}
                <div className="badge badge-outline badge-lg">
                  {wallet.badge}
                </div>

                {/* Description */}
                <p className="text-sm opacity-70 mt-2">
                  {wallet.description}
                </p>

                {/* Network info */}
                <div className="text-xs opacity-60 mt-1">
                  {wallet.network}
                </div>
              </div>
            </button>
          </motion.div>
        ))}
      </div>

      {selectedWallet && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="alert bg-info/10 border-info/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span className="text-sm">
            {selectedWallet === 'ethereum' 
              ? 'Make sure you have MetaMask installed in your browser' 
              : 'Make sure you have Phantom installed in your browser'
            }
          </span>
        </motion.div>
      )}
    </div>
  );
};

export default WalletSelector;
