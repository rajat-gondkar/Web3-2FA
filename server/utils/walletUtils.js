import { ethers } from 'ethers';

/**
 * Verify that a message was signed by a specific wallet address
 * @param {string} message - The original message that was signed
 * @param {string} signature - The signature from the wallet
 * @param {string} expectedAddress - The wallet address we expect signed this
 * @returns {boolean} - True if signature is valid and matches address
 */
export const verifyWalletSignature = (message, signature, expectedAddress) => {
  try {
    // Recover the address that signed the message
    const recoveredAddress = ethers.verifyMessage(message, signature);
    
    // Compare addresses (case-insensitive)
    const isValid = recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
    
    if (isValid) {
      console.log(`✅ Wallet signature verified: ${expectedAddress}`);
    } else {
      console.log(`❌ Wallet signature mismatch. Expected: ${expectedAddress}, Got: ${recoveredAddress}`);
    }
    
    return isValid;
  } catch (error) {
    console.error(`❌ Signature verification error: ${error.message}`);
    return false;
  }
};

/**
 * Create a unique message for wallet signing
 * @param {string} purpose - Purpose of the signature (e.g., 'registration', 'login')
 * @param {string} userId - User ID for identification
 * @returns {string} - Message to be signed
 */
export const createSignatureMessage = (purpose, userId) => {
  const timestamp = Date.now();
  return `BlockQuest - ${purpose}\n\nUser ID: ${userId}\nTimestamp: ${timestamp}\n\nThis signature proves ownership of your wallet.`;
};

/**
 * Validate Ethereum address format
 * @param {string} address - Wallet address to validate
 * @returns {boolean} - True if valid Ethereum address
 */
export const isValidEthereumAddress = (address) => {
  try {
    return ethers.isAddress(address);
  } catch (error) {
    return false;
  }
};
