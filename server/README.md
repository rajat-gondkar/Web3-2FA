# BlockQuest Server - Backend API

Blockchain-based 2FA Authentication Server built with Node.js, Express, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (running locally or MongoDB Atlas)
- Gmail account with App Password (for sending OTP emails)

### Installation

1. **Install dependencies:**
```bash
cd server
npm install
```

2. **Setup environment variables:**
```bash
cp .env.example .env
```

3. **Edit `.env` file with your configuration:**
- Set your MongoDB URI
- Configure email credentials (Gmail App Password)
- Set JWT secret

4. **Start the server:**
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5001`

## 📧 Email Configuration (Gmail)

1. Go to your Google Account settings
2. Security → 2-Step Verification (enable it)
3. App Passwords → Generate new app password
4. Copy the 16-character password
5. Use it in your `.env` file as `EMAIL_PASSWORD`

## 🔌 API Endpoints

### Registration Flow

**Step 1: Basic Information**
```
POST /api/auth/register/step1
Body: { username, email, password, confirmPassword }
Response: { success, message, userId, email }
```

**Step 2: Email OTP Verification**
```
POST /api/auth/register/step2
Body: { userId, otp }
Response: { success, message, userId }
```

**Step 3: Wallet Integration**
```
POST /api/auth/register/step3
Body: { userId, walletAddress, signedMessage, signature }
Response: { success, message, user }
```

**Resend OTP**
```
POST /api/auth/resend-otp
Body: { userId }
Response: { success, message }
```

### Login Flow

**Login (Step 1)**
```
POST /api/auth/login
Body: { username, password }
Response: { success, tempToken, walletAddress, userId }
```

**Verify Wallet (Step 2)**
```
POST /api/auth/verify-wallet
Body: { tempToken, walletAddress, signedMessage, signature }
Response: { success, token, user }
```

### Protected Routes

**Get Current User**
```
GET /api/auth/me
Headers: { Authorization: "Bearer <token>" }
Response: { success, user }
```

## 🗄️ Database Models

### User Schema
- username, email, passwordHash
- walletAddress, registrationTxHash
- isEmailVerified, isWalletVerified
- registrationStep (1-4), registrationComplete
- timestamps

### OTP Schema
- email, otp
- verified, attempts
- createdAt

## 🔒 Security Features

- Password hashing with bcrypt (10 rounds)
- JWT authentication with expiration
- OTP rate limiting (3 per 15 minutes)
- Attempt limiting (3 per OTP)
- Wallet signature verification
- CORS protection

## 📦 Deployment

### Environment Variables for Production
```
NODE_ENV=production
MONGODB_URI=<your-mongodb-atlas-uri>
CLIENT_URL=<your-frontend-url>
JWT_SECRET=<strong-random-secret>
```

### Deploy to Railway/Render/Heroku
1. Push code to GitHub
2. Connect repository to platform
3. Set environment variables
4. Deploy!

## 🛠️ Tech Stack

- Node.js & Express
- MongoDB & Mongoose
- JWT Authentication
- Nodemailer (Email)
- Ethers.js (Wallet verification)
- bcryptjs (Password hashing)
