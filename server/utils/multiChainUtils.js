import { verifyWalletSignature as verifyEthereumSignature, isValidEthereumAddress } from './walletUtils.js';
import { verifySolanaSignature, isValidSolanaAddress } from './solanaWalletUtils.js';

/**
 * Verify wallet signature for any supported blockchain
 * @param {string} message - The original message that was signed
 * @param {string} signature - The signature from the wallet
 * @param {string} walletAddress - The wallet address
 * @param {string} walletType - Type of wallet ('ethereum' or 'solana')
 * @returns {boolean} - True if signature is valid
 */
export const verifyMultiChainSignature = (message, signature, walletAddress, walletType) => {
  try {
    if (walletType === 'ethereum') {
      return verifyEthereumSignature(message, signature, walletAddress);
    } else if (walletType === 'solana') {
      return verifySolanaSignature(message, signature, walletAddress);
    } else {
      console.error(`❌ Unsupported wallet type: ${walletType}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Multi-chain signature verification error: ${error.message}`);
    return false;
  }
};

/**
 * Validate wallet address format for any supported blockchain
 * @param {string} address - Wallet address to validate
 * @param {string} walletType - Type of wallet ('ethereum' or 'solana')
 * @returns {boolean} - True if valid address for the specified blockchain
 */
export const isValidWalletAddress = (address, walletType) => {
  try {
    if (walletType === 'ethereum') {
      return isValidEthereumAddress(address);
    } else if (walletType === 'solana') {
      return isValidSolanaAddress(address);
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

/**
 * Get blockchain network display name
 * @param {string} walletType - Type of wallet
 * @returns {string} - Display name
 */
export const getBlockchainDisplayName = (walletType) => {
  const names = {
    ethereum: 'Ethereum',
    solana: 'Solana'
  };
  return names[walletType] || 'Unknown';
};

/**
 * Get wallet provider display name
 * @param {string} walletType - Type of wallet
 * @returns {string} - Provider name
 */
export const getWalletProviderName = (walletType) => {
  const providers = {
    ethereum: 'MetaMask',
    solana: 'Phantom'
  };
  return providers[walletType] || 'Unknown';
};
