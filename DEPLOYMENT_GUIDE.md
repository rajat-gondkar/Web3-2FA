# 🚀 BlockQuest Deployment Guide

Complete step-by-step guide to deploy your Web3 2FA application to production.

---

## 📦 Deployment Architecture

```
┌─────────────────┐
│   Vercel        │  ← Frontend (React + Vite)
│   (Client)      │
└────────┬────────┘
         │
         │ HTTPS API Calls
         │
         ↓
┌─────────────────┐
│   Railway       │  ← Backend (Node.js + Express)
│   (Server)      │
└────────┬────────┘
         │
         │ MongoDB Connection
         │
         ↓
┌─────────────────┐
│  MongoDB Atlas  │  ← Database (Cloud)
└─────────────────┘
```

---

## 🗄️ Step 1: Setup MongoDB Atlas (If not already done)

### 1.1 Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a new project: "BlockQuest"

### 1.2 Create a Cluster
1. Click "Build a Database"
2. Choose "FREE" tier (M0 Sandbox)
3. Select your preferred region
4. Name your cluster: "blockquest-cluster"
5. Click "Create"

### 1.3 Configure Database Access
1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `blockquest_user`
5. Generate a strong password (save it!)
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

### 1.4 Configure Network Access
1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Confirm
   > Note: For production, you should whitelist only your server's IP

### 1.5 Get Connection String
1. Go to "Database" → Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string:
   ```
   mongodb+srv://blockquest_user:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your actual password
5. Add database name: `blockquest` before the `?`
   ```
   mongodb+srv://blockquest_user:yourpassword@cluster.mongodb.net/blockquest?retryWrites=true&w=majority
   ```

---

## 🔧 Step 2: Setup Email Service (Gmail)

### 2.1 Enable 2-Factor Authentication on Gmail
1. Go to https://myaccount.google.com/security
2. Enable "2-Step Verification"

### 2.2 Generate App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Other (Custom name)"
3. Name it: "BlockQuest App"
4. Click "Generate"
5. Copy the 16-character password (save it!)

---

## 🚂 Step 3: Deploy Backend to Railway

### 3.1 Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub
3. Authorize Railway

### 3.2 Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Connect your GitHub account
4. Select your `Web3-2FA` repository
5. Select root path: `/server`

### 3.3 Configure Environment Variables
1. Go to your project → "Variables" tab
2. Add these environment variables:

```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://blockquest_user:yourpassword@cluster.mongodb.net/blockquest?retryWrites=true&w=majority
JWT_SECRET=generate-a-strong-random-secret-here
JWT_EXPIRE=7d
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
EMAIL_FROM=BlockQuest <noreply@blockquest.com>
REGISTRATION_CLEANUP_ENABLED=true
```

**Generate JWT_SECRET** using this command in your terminal:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3.4 Configure Build Settings
1. Go to "Settings" → "Deploy"
2. Root Directory: `/server`
3. Install Command: `npm install`
4. Build Command: (leave empty)
5. Start Command: `npm start`

### 3.5 Deploy
1. Railway will auto-deploy
2. Wait for deployment to complete
3. Click "Generate Domain" to get your backend URL
4. Copy the URL (e.g., `https://your-app.railway.app`)

### 3.6 Test Backend
Visit: `https://your-app.railway.app/api/health`

You should see:
```json
{
  "success": true,
  "message": "BlockQuest Server is running",
  "timestamp": "2025-10-22T..."
}
```

---

## ⚡ Step 4: Deploy Frontend to Vercel

### 4.1 Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub
3. Authorize Vercel

### 4.2 Create Production Environment File
In your local project, create `client/.env.production`:

```bash
VITE_API_URL=https://your-app.railway.app/api
```

Replace `your-app.railway.app` with your actual Railway URL!

### 4.3 Commit Environment File (Optional)
If you want to commit the production env file:

```bash
cd /Users/rajat.gondkar/Desktop/BlockQuest-Week1
git add client/.env.production
git commit -m "Add production environment configuration"
git push
```

**Or** you can add it via Vercel dashboard (next step).

### 4.4 Import Project to Vercel
1. Click "Add New..." → "Project"
2. Import your `Web3-2FA` repository
3. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 4.5 Add Environment Variables
1. Click "Environment Variables"
2. Add variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-app.railway.app/api`
   - **Environment**: Production

### 4.6 Deploy
1. Click "Deploy"
2. Wait for build to complete (2-3 minutes)
3. Your site will be live at: `https://your-project.vercel.app`

---

## 🔗 Step 5: Connect Frontend & Backend

### 5.1 Update Backend Environment Variables
Go back to Railway and update:

```bash
CLIENT_URL=https://your-project.vercel.app
ALLOWED_ORIGINS=https://your-project.vercel.app,http://localhost:5173
```

Replace `your-project.vercel.app` with your actual Vercel URL!

### 5.2 Trigger Redeploy
Railway will automatically redeploy with new environment variables.

---

## ✅ Step 6: Test Your Deployment

### 6.1 Test Backend Health
Visit: `https://your-app.railway.app/api/health`

### 6.2 Test Frontend
1. Visit: `https://your-project.vercel.app`
2. Test registration flow:
   - Create new account
   - Verify email OTP
   - Connect wallet (MetaMask or Phantom)
   - Complete registration
3. Test login flow:
   - Login with credentials
   - Verify with wallet signature
   - Access dashboard

### 6.3 Test Wallet Connections
- **MetaMask**: Install and test Ethereum wallet connection
- **Phantom**: Install and test Solana wallet connection

---

## 🔒 Step 7: Security Checklist

- [ ] MongoDB Atlas: Restrict IP addresses to Railway's IPs (check Railway logs)
- [ ] Strong JWT_SECRET (64+ characters)
- [ ] Gmail App Password (not regular password)
- [ ] HTTPS enabled on both frontend and backend
- [ ] CORS properly configured with allowed origins
- [ ] Environment variables not committed to Git (except .example files)
- [ ] Rate limiting enabled (if needed)

---

## 📊 Step 8: Setup Custom Domain (Optional)

### For Frontend (Vercel)
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate to provision

### For Backend (Railway)
1. Go to Settings → Domains
2. Add custom domain
3. Update DNS records
4. Update `CLIENT_URL` and `ALLOWED_ORIGINS` in Railway

---

## 🐛 Troubleshooting

### Frontend can't connect to backend
- **Check**: `VITE_API_URL` in Vercel environment variables
- **Check**: CORS configuration in backend includes your Vercel URL
- **Check**: Backend is running (visit health endpoint)

### Email OTP not sending
- **Check**: Gmail app password is correct
- **Check**: 2FA is enabled on Gmail account
- **Check**: Railway logs for email errors

### Wallet connection fails
- **Check**: You're using HTTPS (required for wallet extensions)
- **Check**: MetaMask/Phantom extension is installed
- **Check**: Browser console for errors

### Database connection fails
- **Check**: MongoDB Atlas IP whitelist includes 0.0.0.0/0
- **Check**: Connection string is correct in Railway
- **Check**: Database user has proper permissions

---

## 📈 Monitoring & Logs

### Railway (Backend)
- View logs: Project → "Deployments" → Click deployment → "View Logs"
- Monitor metrics: CPU, Memory, Network usage

### Vercel (Frontend)
- View deployment logs: Project → "Deployments" → Click deployment
- Monitor analytics: Project → "Analytics"

### MongoDB Atlas
- Monitor database: Cluster → "Metrics"
- View operations: "Real-time Performance Panel"

---

## 💰 Cost Estimates

### Free Tier Limits
- **MongoDB Atlas**: 512 MB storage (enough for thousands of users)
- **Railway**: $5 credit/month (usually enough for hobby projects)
- **Vercel**: 100 GB bandwidth/month, unlimited deployments
- **Gmail**: 2000 emails/day

### When to Upgrade
- MongoDB: When you exceed 512 MB
- Railway: When you exceed $5/month usage
- Vercel: When you exceed bandwidth or need advanced features

---

## 🔄 Continuous Deployment

Both Vercel and Railway support automatic deployments:

1. Push code to GitHub
2. Both services automatically detect changes
3. Auto-build and deploy
4. Rollback available if needed

---

## 📝 Environment Variables Summary

### Backend (Railway)
```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret
JWT_EXPIRE=7d
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=app-password
EMAIL_FROM=BlockQuest <noreply@blockquest.com>
CLIENT_URL=https://your-project.vercel.app
ALLOWED_ORIGINS=https://your-project.vercel.app,http://localhost:5173
REGISTRATION_CLEANUP_ENABLED=true
```

### Frontend (Vercel)
```bash
VITE_API_URL=https://your-app.railway.app/api
```

---

## 🎉 You're Done!

Your BlockQuest Web3 2FA application is now live in production!

**Frontend**: https://your-project.vercel.app
**Backend**: https://your-app.railway.app
**Database**: MongoDB Atlas Cloud

Share your app with the world! 🚀

---

## 🆘 Need Help?

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com
- **DaisyUI**: https://daisyui.com

---

**Last Updated**: October 22, 2025
**Version**: 1.0.0
