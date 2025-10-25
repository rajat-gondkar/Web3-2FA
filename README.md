# 🔐 Web3-2FA - Blockchain-Based Two-Factor Authentication

> Replacing traditional SMS/Email OTP with cryptographic wallet signatures for true ownership-based authentication.

## 🎯 Why This Matters

Traditional 2FA systems rely on **something you receive** (SMS codes, email OTPs) which can be:
- 📱 Intercepted (SIM swapping, email hacks)
- ⏰ Time-sensitive and inconvenient
- 🛡️ Vulnerable to phishing attacks

**Web3-2FA** uses **something you own** - your crypto wallet:
- 🔑 **Private Key Verification**: Only wallet owner can sign messages
- 🚫 **No Interceptable Codes**: Cryptographic signatures can't be stolen mid-transmission
- ⚡ **Instant Verification**: No waiting for codes, instant wallet signing
- 🌐 **Decentralized**: No reliance on telecom networks or email servers

## ✨ How It Works

### Registration Flow
```
1. Create Account → 2. Verify Email (one-time OTP) → 3. Bind Wallet (sign message)
```

Your wallet becomes **permanently bound** to your account - no SMS needed, no email codes, just pure cryptographic proof.

### Login Flow
```
1. Enter Credentials → 2. Sign with Your Wallet → ✅ Authenticated
```

Every login requires **both** your password and wallet signature - even if someone steals your password, they can't sign without your private key.

## �️ Security Advantages Over Traditional OTP

| Feature | Traditional OTP | Web3-2FA |
|---------|----------------|----------|
| **Interception Risk** | High (SIM swap, email hack) | None (private key required) |
| **Phishing Resistance** | Low (code can be entered anywhere) | High (signature tied to message) |
| **Recovery Complexity** | Moderate (reset via support) | Clear (wallet = identity) |
| **User Convenience** | Wait for code delivery | Instant wallet signing |
| **Replay Attacks** | Possible with stolen codes | Impossible (unique signatures) |
| **Account Takeover** | Possible with SIM swap | Impossible without private key |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- MetaMask or Phantom wallet
- SendGrid account (for email verification)

### Setup

1. **Clone & Install:**
```bash
git clone <repository-url>
cd Web3-2FA
cd server && npm install
cd ../client && npm install
```

2. **Configure Environment:**

Create `server/.env`:
```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

# SendGrid for Email
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=your_verified_sender_email
```

Create `client/.env`:
```env
VITE_API_URL=http://localhost:5001
```

3. **Run:**
```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev
```

4. **Access:** http://localhost:5173

## 🔧 Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, Ethers.js (Ethereum), Solana Web3.js  
**Backend:** Node.js, Express, MongoDB, JWT, SendGrid  
**Blockchain:** MetaMask & Phantom wallet integration

## 🎨 Key Features

- ✅ **Multi-Chain Support**: Works with Ethereum (MetaMask) and Solana (Phantom)
- 🔐 **Wallet-Bound Accounts**: One wallet = One account (immutable binding)
- 📧 **Email Verification**: One-time OTP during registration only
- 🚀 **Instant 2FA**: No waiting for codes, sign instantly with your wallet
- 🎯 **Protected Routes**: JWT-based session management
- 💫 **Modern UI**: Dark theme with smooth animations

## 📊 Use Cases

- **DeFi Platforms**: Secure user authentication without traditional 2FA vulnerabilities
- **NFT Marketplaces**: Wallet-based login proves actual asset ownership
- **Crypto Exchanges**: Enhanced security beyond SMS 2FA
- **DAO Governance**: Verify member identity for voting
- **Web3 Applications**: Seamless wallet-first authentication

## 🔒 Security Model

```
Layer 1: Password (Something you know)
Layer 2: Wallet Signature (Something you own - private key)
Result: True 2FA that's impossible to bypass without both factors
```

Unlike email/SMS OTP which only proves access to an inbox/phone, wallet signatures **prove cryptographic ownership** - a hacker would need both your password AND your private key.

## 📝 API Endpoints

```
POST /api/auth/register/step1    → Basic info
POST /api/auth/register/step2    → Email OTP verification  
POST /api/auth/register/step3    → Wallet binding (signs message)
POST /api/auth/login              → Credentials check
POST /api/auth/verify-wallet      → Wallet signature verification
GET  /api/auth/me                 → Get user profile (protected)

---

**💡 The Future of 2FA**: Why wait for codes when you can prove ownership instantly? Web3-2FA leverages blockchain's core strength - cryptographic proof of ownership - to create a 2FA system that's more secure, faster, and immune to traditional attack vectors.


