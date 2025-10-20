# Blockchain-Based 2FA Authentication System

## Project Overview

A modern web authentication system that uses blockchain wallet transactions as a form of Two-Factor Authentication (2FA). Users register by connecting their crypto wallet and performing a transaction, which binds their wallet address to their account. Subsequent logins require wallet signature verification, ensuring only the registered wallet owner can access the account.

---

## Core Concept

### Traditional Flow
1. User enters username/password
2. System validates credentials
3. User gains access

### Our Enhanced Flow
1. User enters username/password
2. System validates credentials
3. **User must sign a transaction with their registered crypto wallet (Blockchain 2FA)**
4. System verifies the signature matches the registered wallet
5. User gains access

### Multi-Step Registration Process
**Registration is a mandatory 3-step process - all steps must be completed:**

**Step 1: Basic Information**
- Username
- Email address
- Password
- Confirm password
- Client-side validation before proceeding

**Step 2: Email Verification**
- 6-digit OTP sent to provided email
- User enters OTP code
- Verification required to proceed

**Step 3: Wallet Integration (Mandatory)**
- Connect crypto wallet (MetaMask/WalletConnect)
- Sign verification message
- Wallet binding to account
- **Registration only completes after wallet signature**

---

## Key Features

- 🔐 **Username/Password Authentication** - Traditional first layer of security
- 📧 **Email OTP Verification** - Email verification during registration
- ⛓️ **Blockchain-Based 2FA** - Wallet signature verification as second factor
- 🎨 **Modern Dark Theme UI** - Aesthetic, minimalist design
- 🔒 **Mandatory Wallet Binding** - Registration cannot complete without wallet connection
- ✍️ **Transaction Signing** - No actual cryptocurrency transfer, just signature verification
- 🚫 **Unauthorized Access Prevention** - Only the registered wallet can authenticate
- 📝 **Multi-Step Registration** - 3-step process: Basic Info → Email OTP → Wallet Integration

---

## Tech Stack

### Frontend
- **Framework**: React.js with Vite (Fast, modern development)
- **Styling**: 
  - Tailwind CSS (Utility-first CSS framework)
  - Framer Motion (Smooth animations)
- **Web3 Integration**:
  - ethers.js or web3.js (Blockchain interaction)
  - WalletConnect (Multi-wallet support)
  - MetaMask SDK (Primary wallet integration)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: 
  - MongoDB (User data, wallet addresses)
  - Mongoose (ODM)
- **Authentication**:
  - JWT (JSON Web Tokens)
  - bcrypt (Password hashing)
- **Email Service**:
  - Nodemailer (Email sending)
  - Gmail SMTP / SendGrid / AWS SES
- **OTP Generation**:
  - crypto (Node.js built-in)
  - OTP stored temporarily in database/Redis
- **Blockchain Verification**:
  - ethers.js (Server-side signature verification)

### Blockchain
- **Network**: Ethereum (Mainnet/Testnet) or Polygon (Lower gas fees)
- **Wallet Support**: MetaMask, WalletConnect, Coinbase Wallet

### Additional Tools
- **Environment Variables**: dotenv
- **API Testing**: Postman
- **Version Control**: Git
- **Session Management**: Redis (Optional - for OTP storage)
- **Email Templates**: HTML/CSS for professional OTP emails

---

## Project Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     USER INTERFACE                       │
│  (React + Tailwind + Dark Theme + Wallet Integration)   │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND LOGIC                        │
│  - Form Validation                                       │
│  - Wallet Connection (MetaMask/WalletConnect)           │
│  - Transaction Signing                                   │
│  - API Communication                                     │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    BACKEND API                           │
│  - Express.js Routes                                     │
│  - JWT Authentication                                    │
│  - Signature Verification                                │
│  - User Management                                       │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                     DATABASE                             │
│  MongoDB Collections:                                    │
│  - users: {                                             │
│      username,                                           │
│      email,                                              │
│      passwordHash,                                       │
│      walletAddress,                                      │
│      registrationTxHash,                                 │
│      isEmailVerified,                                    │
│      isWalletVerified,                                   │
│      registrationStep,                                   │
│      createdAt                                           │
│    }                                                     │
│  - otps: {                                              │
│      email,                                              │
│      otp,                                                │
│      expiresAt,                                          │
│      verified                                            │
│    }                                                     │
└─────────────────────────────────────────────────────────┘
```

---

## Detailed Implementation Steps

### Phase 1: Project Setup & Environment Configuration

#### Step 1.1: Initialize Project Structure
```
BlockQuest-Week1/
├── client/                  # Frontend React app
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Login, Register, Home
│   │   ├── utils/           # Web3 helpers
│   │   ├── contexts/        # Auth context
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
├── server/                  # Backend Express API
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API endpoints
│   ├── middleware/          # Auth middleware
│   ├── controllers/         # Business logic
│   ├── utils/               # Helper functions
│   ├── config/              # Database config
│   └── server.js
├── .env
├── .gitignore
└── README.md
```

#### Step 1.2: Install Dependencies

**Frontend Dependencies:**
```json
{
  "react": "^18.x",
  "react-dom": "^18.x",
  "react-router-dom": "^6.x",
  "ethers": "^6.x",
  "axios": "^1.x",
  "tailwindcss": "^3.x",
  "framer-motion": "^10.x",
  "react-hot-toast": "^2.x"
}
```

**Backend Dependencies:**
```json
{
  "express": "^4.x",
  "mongoose": "^8.x",
  "bcryptjs": "^2.x",
  "jsonwebtoken": "^9.x",
  "dotenv": "^16.x",
  "cors": "^2.x",
  "ethers": "^6.x",
  "express-validator": "^7.x",
  "nodemailer": "^6.x",
  "crypto": "built-in",
  "redis": "^4.x (optional)"
}
```

---

### Phase 2: Database Design

#### User Schema (MongoDB)
```javascript
{
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  walletAddress: {
    type: String,
    unique: true,
    sparse: true, // Allows null until wallet is connected
    lowercase: true
  },
  registrationTxHash: {
    type: String,
    sparse: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isWalletVerified: {
    type: Boolean,
    default: false
  },
  registrationStep: {
    type: Number,
    default: 1, // 1: Basic Info, 2: Email OTP, 3: Wallet Integration
    enum: [1, 2, 3, 4] // 4 means completed
  },
  registrationComplete: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  }
}
```

#### OTP Schema (MongoDB)
```javascript
{
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  otp: {
    type: String,
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  attempts: {
    type: Number,
    default: 0,
    max: 3
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

---

### Phase 3: Backend Implementation

#### Step 3.1: Authentication Endpoints

**POST /api/auth/register/step1 (Basic Information)**
- Accept: `username`, `email`, `password`, `confirmPassword`
- Validate input fields:
  - Username: 3-20 characters, alphanumeric
  - Email: Valid email format
  - Password: Min 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special char
  - Passwords match
- Check if username/email already exists
- Hash password with bcrypt
- Create user document with `registrationStep: 1`
- Generate 6-digit OTP
- Send OTP email
- Store OTP in database (expires in 10 minutes)
- Return: `{ success: true, userId: xxx, message: "OTP sent to email" }`

**POST /api/auth/register/step2 (Email OTP Verification)**
- Accept: `userId`, `otp`
- Validate OTP:
  - Check if OTP exists for user's email
  - Check if OTP matches
  - Limit attempts (max 3 attempts per OTP)
  - Check if already verified
- If valid:
  - Update user: `isEmailVerified: true`, `registrationStep: 2`
  - Mark OTP as verified (prevents reuse)
- Return: `{ success: true, message: "Email verified. Please connect wallet" }`

**POST /api/auth/register/step3 (Wallet Integration)**
- Accept: `userId`, `walletAddress`, `signedMessage`
- Validate user is at step 2 (email verified)
- Check if wallet already registered by another user
- Verify wallet signature matches the wallet address
- Update user:
  - `walletAddress`: provided address
  - `isWalletVerified: true`
  - `registrationStep: 4`
  - `registrationComplete: true`
- Return: `{ success: true, message: "Registration complete! Please login" }`

**POST /api/auth/resend-otp**
- Accept: `userId` or `email`
- Check rate limiting (max 3 OTPs per 15 minutes)
- Generate new OTP
- Send email
- Return: `{ success: true, message: "OTP resent" }`

**POST /api/auth/login**
- Accept: `username` or `email`, `password`
- Validate user exists and registration is complete (`registrationComplete: true`)
- If user exists but registration incomplete:
  - Return: `{ success: false, registrationStep: X, userId: xxx, message: "Complete registration first" }`
- Validate password
- If valid, generate a temporary token
- Return: `{ tempToken, walletAddress }` (valid for 5 minutes, used for wallet verification)
- Status: "PENDING_WALLET_VERIFICATION"

**POST /api/auth/verify-wallet**
- Accept: `tempToken`, `walletAddress`, `signedMessage`
- Verify temp token is valid
- Verify wallet signature
- Check if wallet matches registered wallet
- If valid, generate full JWT token
- Return: `authToken` (full access)

**GET /api/auth/me**
- Require JWT authentication
- Return user profile (without sensitive data)

#### Step 3.2: Wallet Verification Logic

```javascript
// Pseudo-code for signature verification
function verifyWalletSignature(message, signature, expectedAddress) {
  // Recover address from signature
  const recoveredAddress = ethers.verifyMessage(message, signature);
  
  // Compare with expected address (case-insensitive)
  return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
}
```

---

### Phase 4: Frontend Implementation

#### Step 4.1: Wallet Integration

**Wallet Connection:**
- Detect MetaMask/WalletConnect
- Request account access
- Get wallet address
- Handle wallet switch/disconnect events

**Message Signing:**
- Create a unique message (timestamp + user identifier)
- Request signature from wallet
- No actual transaction (no gas fees)
- Use `personal_sign` method

#### Step 4.2: Multi-Step Registration Flow

```
══════════════════════════════════════════════════════════
                    STEP 1: BASIC INFORMATION
══════════════════════════════════════════════════════════
1. User lands on registration page
   ↓
2. Fill form fields:
   - Username (with real-time availability check)
   - Email address
   - Password
   - Confirm Password
   ↓
3. Client-side validation:
   - Username: 3-20 chars, alphanumeric
   - Email: Valid format
   - Password: Min 8 chars, uppercase, lowercase, number, special char
   - Passwords match
   ↓
4. Click "Next: Verify Email"
   ↓
5. API Call: POST /api/auth/register/step1
   ↓
6. Backend:
   - Validates data
   - Checks username/email not taken
   - Hashes password
   - Creates user (registrationStep: 1)
   - Generates 6-digit OTP
   - Sends email with OTP
   ↓
7. Success → Navigate to Step 2

══════════════════════════════════════════════════════════
                    STEP 2: EMAIL VERIFICATION
══════════════════════════════════════════════════════════
8. User sees OTP input screen
   - "Enter the 6-digit code sent to your email"
   - Shows email address (partially masked: r***@gmail.com)
   - "Resend OTP" button (with cooldown timer)
   ↓
9. User checks email and enters OTP
   ↓
10. Click "Verify Email"
    ↓
11. API Call: POST /api/auth/register/step2
    - Payload: { userId, otp }
    ↓
12. Backend:
    - Validates OTP exists for user's email
    - Checks if OTP matches
    - Limits attempts (max 3 per OTP)
    - Updates user: isEmailVerified: true, registrationStep: 2
    - Marks OTP as verified (prevents reuse)
    ↓
13. Success → Navigate to Step 3

══════════════════════════════════════════════════════════
                    STEP 3: WALLET INTEGRATION (MANDATORY)
══════════════════════════════════════════════════════════
14. User sees wallet connection screen
    - "Connect Your Wallet to Complete Registration"
    - "This is required and cannot be skipped"
    - Shows supported wallets (MetaMask, WalletConnect, etc.)
    ↓
15. Click "Connect Wallet"
    ↓
16. MetaMask popup appears
    ↓
17. User approves connection
    ↓
18. Wallet connected → Display address
    - Show: "Connected: 0x1234...5678"
    - Verify wallet not already registered
    ↓
19. Click "Sign Message to Complete Registration"
    - Message: "Register wallet for BlockQuest - [timestamp] - [userId]"
    ↓
20. MetaMask signature request appears
    - NO GAS FEE (just signing)
    ↓
21. User signs message
    ↓
22. API Call: POST /api/auth/register/step3
    - Payload: { userId, walletAddress, signedMessage }
    ↓
23. Backend:
    - Verifies user at step 2
    - Verifies signature
    - Checks wallet not used by others
    - Updates user:
      * walletAddress
      * isWalletVerified: true
      * registrationStep: 4
      * registrationComplete: true
    ↓
24. Success Screen:
    - "Registration Complete! 🎉"
    - "Your wallet is now linked to your account"
    - Confetti animation
    ↓
25. Auto-redirect to login page (after 3 seconds)
```

**Important Notes:**
- Cannot skip any step
- Cannot proceed to next step without completing previous
- Wallet connection is MANDATORY - no "Skip" button
- If user closes browser, they can resume from their last completed step
- Session persists via userId stored in localStorage (for registration only)

#### Step 4.3: Login Flow

```
1. User enters username & password
   ↓
2. Click "Login"
   ↓
3. Backend validates credentials
   ↓
4. If valid → Return tempToken
   ↓
5. UI shows "Please verify with your wallet"
   ↓
6. Auto-trigger wallet connection
   ↓
7. Request signature for verification
   ↓
8. Send tempToken + signature to backend
   ↓
9. Backend verifies wallet matches registered wallet
   ↓
10. If valid → Return full authToken
    ↓
11. Store token in localStorage
    ↓
12. Redirect to dashboard/home page
```

#### Step 4.4: UI/UX Design Components

**Color Scheme (Dark Theme):**
- Background: `#0f0f0f` (Pure dark)
- Cards/Panels: `#1a1a1a` (Slightly lighter)
- Accent: `#6366f1` (Indigo) or `#8b5cf6` (Purple)
- Text Primary: `#ffffff`
- Text Secondary: `#a1a1aa`
- Success: `#10b981`
- Error: `#ef4444`
- Warning: `#f59e0b`

**Components to Build:**

**Registration Components:**
- `RegisterPage.jsx` - Main registration container with step management
- `RegisterStep1.jsx` - Basic information form
- `RegisterStep2.jsx` - Email OTP verification
- `RegisterStep3.jsx` - Wallet connection (mandatory)
- `ProgressBar.jsx` - Visual step indicator (1 → 2 → 3)
- `OTPInput.jsx` - 6-digit OTP input component
- `ResendOTPButton.jsx` - Button with countdown timer

**Login Components:**
- `LoginPage.jsx` - Modern login form with wallet integration
- `WalletVerificationModal.jsx` - Popup for wallet 2FA

**Shared Components:**
- `WalletConnect.jsx` - Reusable wallet connection button
- `ProtectedRoute.jsx` - Route guard for authenticated pages
- `Navbar.jsx` - Navigation with wallet status
- `HomePage.jsx` - Blank authenticated page
- `EmailDisplay.jsx` - Masked email display (r***@gmail.com)
- `SuccessAnimation.jsx` - Confetti/checkmark animation

**Design Elements:**
- Glassmorphism effects
- Smooth hover transitions
- Loading states with spinners
- Toast notifications for feedback
- Gradient borders
- Blur effects

---

### Phase 5: Security Considerations

#### 5.1: Security Measures
- **Password Hashing**: Use bcrypt with salt rounds ≥10
- **JWT Security**: 
  - Short expiration times (1 hour for full token)
  - Temporary tokens expire in 5 minutes
  - Store securely (httpOnly cookies or localStorage)
- **OTP Security**:
  - 6-digit random OTP
  - Max 3 verification attempts per OTP
  - Rate limiting: Max 3 OTP requests per 15 minutes
  - OTP invalidated after successful verification
  - Hash OTP before storing (optional but recommended)
- **Email Security**:
  - Use secure SMTP (TLS/SSL)
  - Professional email templates
  - SPF/DKIM records for deliverability
- **Wallet Verification**:
  - Always verify signature server-side
  - Use unique messages with timestamps
  - Prevent replay attacks with nonces
  - Verify wallet not already bound to another account
- **Input Validation**: Sanitize all inputs (SQL injection, XSS)
- **Rate Limiting**: Prevent brute force attacks
- **CORS Configuration**: Whitelist specific origins
- **Registration Integrity**: Prevent step skipping with server-side validation

#### 5.2: Potential Attack Vectors & Mitigations

| Attack Vector | Mitigation |
|---------------|------------|
| Stolen password | Blockchain 2FA prevents access |
| Wallet private key theft | Still requires password |
| Replay attack | Use timestamp + nonce in messages |
| Man-in-the-middle | HTTPS only, verify signatures server-side |
| Brute force | Rate limiting, account lockout |
| OTP interception | One-time use only, limit attempts (max 3) |
| Email spoofing | Use verified email service, SPF/DKIM |
| Step skipping | Server validates registrationStep before proceeding |
| Multiple OTP requests | Rate limit to 3 per 15 minutes |
| Partial registration spam | Auto-delete incomplete registrations after 24-48 hours |

---

### Phase 6: Testing Strategy

#### 6.1: Unit Tests
- Test password hashing/verification
- Test JWT generation/validation
- Test signature verification logic
- Test wallet address validation

#### 6.2: Integration Tests
- Test complete registration flow
- Test complete login flow
- Test wallet mismatch scenarios
- Test expired token handling

#### 6.3: Manual Testing Scenarios

**Registration Flow:**
- ✅ Complete all 3 steps successfully
- ❌ Try to skip Step 2 (email verification)
- ❌ Try to skip Step 3 (wallet connection)
- ✅ Enter valid OTP
- ❌ Enter invalid OTP (should limit to 3 attempts)
- ❌ Enter already used/verified OTP
- ✅ Resend OTP successfully
- ❌ Exceed OTP resend limit
- ❌ Register with already used username
- ❌ Register with already used email
- ❌ Register with already used wallet
- ✅ Resume registration from last completed step (refresh browser)
- ❌ Try to use incomplete account to login

**Login Flow:**
- ✅ Login with complete account + correct wallet
- ❌ Login with incomplete registration
- ❌ Login with different wallet
- ❌ Login without wallet connection
- ❌ Login with wrong password
- ✅ Access protected routes with valid token
- ❌ Access protected routes without token

---

### Phase 7: Deployment

#### 7.1: Environment Variables

**Frontend (.env):**
```
VITE_API_URL=http://localhost:5000/api
VITE_CHAIN_ID=1 # Ethereum mainnet
```

**Backend (.env):**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blockquest
JWT_SECRET=your-super-secret-key
JWT_EXPIRE=1h
TEMP_TOKEN_EXPIRE=5m
NODE_ENV=development

# Email Configuration (Gmail Example)
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=BlockQuest <noreply@blockquest.com>

# OTP Configuration
OTP_MAX_ATTEMPTS=3
OTP_RATE_LIMIT_MINUTES=15
OTP_MAX_REQUESTS=3

# Redis (Optional - for OTP caching)
REDIS_URL=redis://localhost:6379
```

#### 7.2: Deployment Platforms

**Frontend:**
- Vercel (Recommended)
- Netlify
- GitHub Pages

**Backend:**
- Railway
- Render
- Heroku
- DigitalOcean

**Database:**
- MongoDB Atlas (Free tier available)

---

## User Experience Flow Diagram

### Multi-Step Registration (Mandatory 3 Steps)
```
[Landing Page] 
      ↓
[Click "Register"]
      ↓
╔═══════════════════════════════════════════════════════════╗
║                    STEP 1 OF 3                            ║
║              BASIC INFORMATION                            ║
╚═══════════════════════════════════════════════════════════╝
[Fill Form:]
  • Username (real-time availability check)
  • Email Address
  • Password (strength indicator)
  • Confirm Password
      ↓
[Client-side Validation]
      ↓
[Click "Next: Verify Email"]
      ↓
[Backend: Create User (Step 1), Generate & Send OTP]
      ↓
╔═══════════════════════════════════════════════════════════╗
║                    STEP 2 OF 3                            ║
║              EMAIL VERIFICATION                           ║
╚═══════════════════════════════════════════════════════════╝
[Screen: "Check your email!"]
[Display: "We sent a code to r***@gmail.com"]
      ↓
[User Checks Email → Finds OTP]
      ↓
[Enter 6-Digit OTP]
  • "Resend OTP" button (with 60s cooldown)
  • Max 3 attempts per OTP
      ↓
[Click "Verify Email"]
      ↓
[Backend: Validate OTP, Update registrationStep]
      ↓
[✓ Email Verified!]
      ↓
╔═══════════════════════════════════════════════════════════╗
║                    STEP 3 OF 3                            ║
║        WALLET INTEGRATION (MANDATORY)                     ║
╚═══════════════════════════════════════════════════════════╝
[Screen: "Connect Your Wallet"]
[Message: "This step is required to complete registration"]
[No Skip Button - MUST Complete]
      ↓
[Click "Connect Wallet"]
      ↓
[MetaMask Popup: Request Connection]
      ↓
[User Approves Connection]
      ↓
[✓ Wallet Connected: 0x1234...5678]
      ↓
[Backend: Verify wallet not already registered]
      ↓
[Click "Sign Message to Complete"]
      ↓
[MetaMask Popup: Signature Request (NO GAS FEE)]
[Message: "Register wallet for BlockQuest - [timestamp]"]
      ↓
[User Signs Message]
      ↓
[Backend: Verify Signature, Update User]
  • walletAddress saved
  • isWalletVerified: true
  • registrationComplete: true
      ↓
╔═══════════════════════════════════════════════════════════╗
║            REGISTRATION COMPLETE! 🎉                      ║
╚═══════════════════════════════════════════════════════════╝
[Confetti Animation]
[Success Message: "Your wallet is now linked!"]
      ↓
[Auto-redirect to Login in 3... 2... 1...]
```

**Key Points:**
- ❌ Cannot skip Step 2 or Step 3
- ❌ Cannot proceed without completing previous step
- ✅ Can resume from last completed step if browser closed
- 🔢 Max 3 attempts per OTP
- 🔄 Can resend OTP (rate limited to 3 per 15 minutes)
- 🔒 Wallet connection is MANDATORY

### Login
```
[Login Page]
      ↓
[Enter Username & Password]
      ↓
[Click "Login"]
      ↓
[Credentials Validated ✓]
      ↓
[Prompt: "Verify with Wallet"]
      ↓
[Auto-Connect Wallet]
      ↓
[Request Signature → MetaMask Popup]
      ↓
[User Signs Verification Message]
      ↓
[Backend Verifies: Signature ✓ & Wallet Match ✓]
      ↓
[Login Success - JWT Issued]
      ↓
[Redirect to Dashboard]
```

---

## Advantages of This System

1. **Triple-Layer Security**: Email verification + password + blockchain signature
2. **No Gas Fees**: Uses message signing, not actual transactions
3. **Immutable Binding**: Wallet cannot be changed after registration
4. **Decentralized Verification**: Blockchain signature is cryptographically secure
5. **User Control**: Users maintain custody of their authentication keys (wallet)
6. **Modern UX**: Familiar for crypto users
7. **Verified Email**: Ensures users have access to their registered email
8. **Progressive Registration**: User-friendly multi-step process prevents overwhelming users
9. **Forced Wallet Connection**: Cannot bypass blockchain 2FA during registration
10. **Resumable Process**: Users can complete registration across multiple sessions

---

## Potential Enhancements (Future Scope)

- 🔄 Multi-wallet support per account
- 📱 Mobile app with WalletConnect
- 🌐 Multi-chain support (Ethereum, Polygon, BSC)
- 📧 Email verification for password reset
- 🔑 Account recovery mechanism (backup codes)
- 📊 Login history dashboard
- 🎨 Light/Dark theme toggle
- 🌍 Multi-language support
- 📲 SMS OTP as alternative to email
- 🔐 Biometric authentication for mobile
- 🎫 NFT-based access badges
- 📈 Analytics dashboard for registration funnel
- 🤖 CAPTCHA for bot prevention

---

## Development Timeline Estimate

| Phase | Task | Estimated Time |
|-------|------|----------------|
| 1 | Project setup & configuration | 2-3 hours |
| 2 | Database design & setup (Users + OTPs) | 2-3 hours |
| 3 | Email service setup (Nodemailer) | 1-2 hours |
| 4 | Backend API development | 8-10 hours |
|   | → Registration endpoints (3 steps) | 3-4 hours |
|   | → OTP generation & verification | 2-3 hours |
|   | → Email sending functionality | 1-2 hours |
|   | → Login & wallet verification | 2-3 hours |
| 5 | Frontend UI development | 10-12 hours |
|   | → Multi-step registration form | 4-5 hours |
|   | → OTP input component | 1-2 hours |
|   | → Progress indicator | 1 hour |
|   | → Login page | 2-3 hours |
|   | → Wallet integration UI | 2-3 hours |
| 6 | Wallet integration (ethers.js) | 4-5 hours |
| 7 | Testing & debugging | 5-7 hours |
|   | → Registration flow testing | 2-3 hours |
|   | → OTP testing | 1-2 hours |
|   | → Wallet verification testing | 2-3 hours |
| 8 | Styling & polish (Dark theme) | 4-5 hours |
| 9 | Email template design | 1-2 hours |
| **Total** | | **37-49 hours** |

---

## Learning Resources

### Blockchain Development
- [Ethers.js Documentation](https://docs.ethers.org/)
- [MetaMask Developer Docs](https://docs.metamask.io/)
- [WalletConnect Documentation](https://docs.walletconnect.com/)

### Frontend
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)

### Backend
- [Express.js Guide](https://expressjs.com/)
- [MongoDB University](https://university.mongodb.com/)
- [JWT Introduction](https://jwt.io/introduction)
- [Nodemailer Documentation](https://nodemailer.com/)
- [Gmail App Passwords Setup](https://support.google.com/accounts/answer/185833)

### Email Services
- [SendGrid API](https://docs.sendgrid.com/) (Alternative to Gmail)
- [AWS SES](https://aws.amazon.com/ses/) (For production)

---

## Email Template Design

### OTP Email Template (HTML)
```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Arial', sans-serif; background: #f4f4f4; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; 
                     border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); 
                  padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { color: white; margin: 0; }
        .content { padding: 40px; text-align: center; }
        .otp-code { font-size: 36px; font-weight: bold; letter-spacing: 8px; 
                    color: #6366f1; background: #f3f4f6; padding: 20px; 
                    border-radius: 10px; margin: 30px 0; }
        .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 BlockQuest</h1>
        </div>
        <div class="content">
            <h2>Verify Your Email</h2>
            <p>Your verification code is:</p>
            <div class="otp-code">123456</div>
            <p>Enter this code to verify your email address.</p>
            <p>If you didn't request this code, please ignore this email.</p>
        </div>
        <div class="footer">
            <p>&copy; 2025 BlockQuest. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
```

### Welcome Email Template (After Registration)
Send a welcome email after successful registration completion with:
- Confirmation of account creation
- Wallet address confirmation (partially masked)
- Security tips
- Next steps

---

## Conclusion

This project combines traditional web authentication with blockchain technology to create a robust, modern authentication system with a **mandatory 3-step registration process**:

1. **Basic Information Entry** - Username, email, password
2. **Email OTP Verification** - Ensures email validity
3. **Wallet Integration** - Mandatory blockchain 2FA binding

The blockchain-based 2FA adds an extra layer of security that's cryptographically verifiable and user-controlled. Users **cannot skip** the wallet connection step, ensuring every account has blockchain 2FA enabled from day one. The dark-themed, aesthetic UI will provide a modern user experience while maintaining security as the top priority.

Ready to start implementation when you are! 🚀

---

**Last Updated**: October 18, 2025  
**Project Name**: BlockQuest - Blockchain 2FA Authentication  
**Version**: 1.0  
**Author**: Rajat Gondkar
