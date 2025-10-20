# 🔐 BlockQuest - Blockchain-Based 2FA Authentication

A modern web authentication system that uses blockchain wallet signatures as a form of Two-Factor Authentication (2FA). Users register by connecting their crypto wallet, and subsequent logins require wallet signature verification.

## ✨ Features

- **3-Step Mandatory Registration**: Basic Info → Email OTP → Wallet Integration
- **Email OTP Verification**: Secure email verification during signup
- **Blockchain-Based 2FA**: Every login requires wallet signature
- **Wallet Binding**: One wallet per account, immutable after registration
- **Protected Routes**: JWT-based authentication
- **MetaMask Integration**: Seamless Web3 wallet connection

## 🛠️ Tech Stack

### Frontend
- React 18 + Vite
- Tailwind CSS
- React Router DOM
- Ethers.js (Web3)
- Axios
- Framer Motion
- React Hot Toast

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Nodemailer (Email)
- Ethers.js (Signature Verification)
- bcryptjs (Password Hashing)

## 🚀 Getting Started

### Quick Setup (Recommended)

Run the automated setup script:
```bash
./setup-env.sh
```

This interactive script will guide you through configuring all environment variables.

For detailed instructions, see [QUICKSTART.md](QUICKSTART.md)

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- MetaMask browser extension
- Gmail account with App Password

### Installation

1. **Clone the repository:**
```bash
cd BlockQuest-Week1
```

2. **Setup Backend:**
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

3. **Setup Frontend:**
```bash
cd client
npm install
cp .env.example .env
npm run dev
```

4. **Access the application:**
- Frontend: http://localhost:5173
- Backend: http://localhost:5001

## 📧 Email Setup (Gmail)

1. Enable 2-Step Verification in Google Account
2. Generate App Password: Security → App Passwords
3. Use the 16-character password in `server/.env`

## 🔄 User Flow

### Registration (3 Steps - Cannot Skip)
1. **Basic Information**
   - Username, email, password
   - Validation & duplicate checks
   
2. **Email Verification**
   - 6-digit OTP sent to email
   - Max 3 attempts per OTP
   - Resend available (rate limited)
   
3. **Wallet Integration** (Mandatory)
   - Connect MetaMask wallet
   - Sign message (no gas fees)
   - Wallet bound to account

### Login (2 Steps)
1. **Credentials**
   - Username/email + password
   - Temporary token issued
   
2. **Wallet 2FA**
   - Connect registered wallet
   - Sign verification message
   - Full JWT token issued

## 📁 Project Structure

```
BlockQuest-Week1/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── utils/          # Utility functions
│   │   └── App.jsx
│   └── package.json
├── server/                 # Express backend
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── controllers/        # Business logic
│   ├── middleware/         # Auth middleware
│   ├── utils/              # Helper functions
│   ├── config/             # Database config
│   └── server.js
└── PROJECT_DOCUMENTATION.md
```

## 🔒 Security Features

- Password hashing (bcrypt)
- JWT authentication
- OTP rate limiting
- Attempt limiting
- Server-side signature verification
- Wallet uniqueness validation
- CORS protection
- Protected routes

## 📝 API Endpoints

- `POST /api/auth/register/step1` - Basic registration
- `POST /api/auth/register/step2` - Email OTP verification
- `POST /api/auth/register/step3` - Wallet integration
- `POST /api/auth/resend-otp` - Resend OTP
- `POST /api/auth/login` - Login with credentials
- `POST /api/auth/verify-wallet` - Wallet 2FA verification
- `GET /api/auth/me` - Get current user (protected)

## 🎨 UI Features

- Dark theme design
- Gradient accents
- Smooth animations
- Loading states
- Toast notifications
- Progress indicators
- Responsive design

## 📄 License

MIT License

## 👤 Author

Rajat Gondkar

---

**Note**: This is a demonstration project. For production use, implement additional security measures and thorough testing.
