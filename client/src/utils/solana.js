/**
 * Solana/Phantom Wallet Utilities
 * Handles Phantom wallet connection, message signing, and account management
 */

import bs58 from 'bs58';

/**
 * Check if Phantom wallet is installed
 * @returns {boolean}
 */
export const isPhantomInstalled = () => {
  return typeof window !== 'undefined' && window.solana?.isPhantom;
};

/**
 * Connect to Phantom wallet
 * @returns {Promise<string>} - Connected wallet address
 */
export const connectPhantom = async () => {
  try {
    if (!isPhantomInstalled()) {
      throw new Error('Phantom wallet is not installed. Please install it from https://phantom.app/');
    }

    const resp = await window.solana.connect();
    const publicKey = resp.publicKey.toString();
    
    console.log('✅ Phantom connected:', publicKey);
    return publicKey;
  } catch (error) {
    console.error('❌ Phantom connection error:', error);
    throw error;
  }
};

/**
 * Disconnect from Phantom wallet
 */
export const disconnectPhantom = async () => {
  try {
    if (window.solana) {
      await window.solana.disconnect();
      console.log('👋 Phantom disconnected');
    }
  } catch (error) {
    console.error('❌ Phantom disconnect error:', error);
  }
};

/**
 * Sign a message with Phantom wallet
 * @param {string} message - Message to sign
 * @returns {Promise<string>} - Signature in base58 format
 */
export const signMessageWithPhantom = async (message) => {
  try {
    if (!isPhantomInstalled()) {
      throw new Error('Phantom wallet is not installed');
    }

    if (!window.solana.isConnected) {
      throw new Error('Phantom wallet is not connected');
    }

    // Convert message to Uint8Array
    const encodedMessage = new TextEncoder().encode(message);

    // Sign the message
    const signedMessage = await window.solana.signMessage(encodedMessage, 'utf8');
    
    // Convert signature to base58 (Solana standard format)
    const signature = bs58.encode(signedMessage.signature);
    
    console.log('✅ Message signed with Phantom');
    return signature;
  } catch (error) {
    console.error('❌ Phantom signing error:', error);
    throw error;
  }
};

/**
 * Get current connected Phantom account
 * @returns {Promise<string|null>} - Wallet address or null
 */
export const getPhantomAccount = async () => {
  try {
    if (!isPhantomInstalled()) {
      return null;
    }

    if (window.solana.isConnected) {
      return window.solana.publicKey.toString();
    }

    return null;
  } catch (error) {
    console.error('❌ Error getting Phantom account:', error);
    return null;
  }
};

/**
 * Create registration message for Solana wallet
 * @param {string} userId - User's database ID
 * @param {string} walletAddress - Solana wallet address
 * @returns {string}
 */
export const createSolanaRegistrationMessage = (userId, walletAddress) => {
  const timestamp = Date.now();
  return `Auth3 Registration\n\nWallet: ${walletAddress}\nUser ID: ${userId}\nTimestamp: ${timestamp}\n\nThis signature proves you own this Solana wallet.`;
};

/**
 * Create login message for Solana wallet
 * @param {string} userId - User's database ID
 * @param {string} walletAddress - Solana wallet address
 * @returns {string}
 */
export const createSolanaLoginMessage = (userId, walletAddress) => {
  const timestamp = Date.now();
  const nonce = Math.random().toString(36).substring(7);
  return `Auth3 Login\n\nWallet: ${walletAddress}\nUser ID: ${userId}\nNonce: ${nonce}\nTimestamp: ${timestamp}\n\nSign this message to authenticate with your Solana wallet.`;
};

/**
 * Format Solana address for display (first 4 + last 4)
 * @param {string} address - Full Solana address
 * @returns {string}
 */
export const formatSolanaAddress = (address) => {
  if (!address || address.length < 8) return address;
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

/**
 * Listen for Phantom account changes
 * @param {Function} callback - Function to call when account changes
 */
export const onPhantomAccountChange = (callback) => {
  if (isPhantomInstalled()) {
    window.solana.on('accountChanged', (publicKey) => {
      if (publicKey) {
        callback(publicKey.toString());
      } else {
        callback(null);
      }
    });
  }
};

/**
 * Listen for Phantom disconnect
 * @param {Function} callback - Function to call when disconnected
 */
export const onPhantomDisconnect = (callback) => {
  if (isPhantomInstalled()) {
    window.solana.on('disconnect', callback);
  }
};
