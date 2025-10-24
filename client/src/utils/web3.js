import { ethers } from 'ethers';

/**
 * Check if MetaMask is installed
 */
export const isMetaMaskInstalled = () => {
  return typeof window.ethereum !== 'undefined';
};

/**
 * Connect to MetaMask wallet
 * @returns {Promise<string>} - Connected wallet address
 */
export const connectWallet = async () => {
  try {
    if (!isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed. Please install MetaMask extension.');
    }

    // Request account access
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    if (accounts.length === 0) {
      throw new Error('No accounts found. Please unlock MetaMask.');
    }

    const address = accounts[0];
    console.log('✅ Wallet connected:', address);
    return address;
  } catch (error) {
    console.error('Wallet connection error:', error);
    throw error;
  }
};

/**
 * Get current connected wallet address
 * @returns {Promise<string|null>} - Current wallet address or null
 */
export const getCurrentWallet = async () => {
  try {
    if (!isMetaMaskInstalled()) {
      return null;
    }

    const accounts = await window.ethereum.request({
      method: 'eth_accounts',
    });

    return accounts.length > 0 ? accounts[0] : null;
  } catch (error) {
    console.error('Error getting current wallet:', error);
    return null;
  }
};

/**
 * Sign a message with the connected wallet
 * @param {string} message - Message to sign
 * @returns {Promise<string>} - Signature
 */
export const signMessage = async (message) => {
  try {
    if (!isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed');
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const signature = await signer.signMessage(message);

    console.log('✅ Message signed');
    return signature;
  } catch (error) {
    console.error('Message signing error:', error);
    if (error.code === 4001) {
      throw new Error('User denied message signature');
    }
    throw error;
  }
};

/**
 * Create a message for registration
 * @param {string} userId - User ID
 * @returns {string} - Message to be signed
 */
export const createRegistrationMessage = (userId) => {
  const timestamp = Date.now();
  return `Auth3 - registration\n\nUser ID: ${userId}\nTimestamp: ${timestamp}\n\nThis signature proves ownership of your wallet.`;
};

/**
 * Create a message for login verification
 * @param {string} userId - User ID
 * @returns {string} - Message to be signed
 */
export const createLoginMessage = (userId) => {
  const timestamp = Date.now();
  return `Auth3 - login\n\nUser ID: ${userId}\nTimestamp: ${timestamp}\n\nThis signature proves ownership of your wallet.`;
};

/**
 * Listen for account changes
 * @param {Function} callback - Callback function to handle account change
 */
export const onAccountsChanged = (callback) => {
  if (isMetaMaskInstalled()) {
    window.ethereum.on('accountsChanged', callback);
  }
};

/**
 * Listen for chain changes
 * @param {Function} callback - Callback function to handle chain change
 */
export const onChainChanged = (callback) => {
  if (isMetaMaskInstalled()) {
    window.ethereum.on('chainChanged', callback);
  }
};

/**
 * Disconnect wallet (just for UI purposes)
 */
export const disconnectWallet = () => {
  console.log('🔌 Wallet disconnected');
  // MetaMask doesn't have a programmatic disconnect
  // This is just for UI state management
};

/**
 * Format wallet address (0x1234...5678)
 * @param {string} address - Wallet address
 * @returns {string} - Formatted address
 */
export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

/**
 * Validate Ethereum address format
 * @param {string} address - Address to validate
 * @returns {boolean} - True if valid
 */
export const isValidAddress = (address) => {
  return ethers.isAddress(address);
};
