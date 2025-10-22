import { PublicKey } from '@solana/web3.js';
import nacl from 'tweetnacl';
import bs58 from 'bs58';

/**
 * Verify a Solana wallet signature
 * @param {string} message - The original message that was signed
 * @param {string} signature - The signature in base58 format
 * @param {string} publicKey - The Solana public key (wallet address)
 * @returns {boolean} - True if signature is valid
 */
export const verifySolanaSignature = (message, signature, publicKey) => {
  try {
    // Convert message to Uint8Array
    const messageBytes = new TextEncoder().encode(message);
    
    // Decode signature from base58
    const signatureBytes = bs58.decode(signature);
    
    // Decode public key from base58
    const publicKeyBytes = bs58.decode(publicKey);
    
    // Verify signature using nacl (Ed25519)
    const isValid = nacl.sign.detached.verify(
      messageBytes,
      signatureBytes,
      publicKeyBytes
    );
    
    return isValid;
  } catch (error) {
    console.error('Solana signature verification error:', error);
    return false;
  }
};

/**
 * Validate if a string is a valid Solana public key
 * @param {string} address - The address to validate
 * @returns {boolean} - True if valid Solana address
 */
export const isValidSolanaAddress = (address) => {
  try {
    const publicKey = new PublicKey(address);
    return PublicKey.isOnCurve(publicKey.toBytes());
  } catch (error) {
    return false;
  }
};

/**
 * Create a message for Solana wallet signature during registration
 * @param {string} userId - User's database ID
 * @param {string} walletAddress - Solana wallet address
 * @returns {string} - Message to be signed
 */
export const createSolanaRegistrationMessage = (userId, walletAddress) => {
  const timestamp = Date.now();
  return `BlockQuest Registration\n\nWallet: ${walletAddress}\nUser ID: ${userId}\nTimestamp: ${timestamp}\n\nThis signature proves you own this Solana wallet.`;
};

/**
 * Create a message for Solana wallet signature during login
 * @param {string} userId - User's database ID
 * @param {string} walletAddress - Solana wallet address
 * @returns {string} - Message to be signed
 */
export const createSolanaLoginMessage = (userId, walletAddress) => {
  const timestamp = Date.now();
  const nonce = Math.random().toString(36).substring(7);
  return `BlockQuest Login\n\nWallet: ${walletAddress}\nUser ID: ${userId}\nNonce: ${nonce}\nTimestamp: ${timestamp}\n\nSign this message to authenticate with your Solana wallet.`;
};

/**
 * Format Solana address for display (first 4 + last 4 chars)
 * @param {string} address - Full Solana address
 * @returns {string} - Formatted address
 */
export const formatSolanaAddress = (address) => {
  if (!address || address.length < 8) return address;
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};
