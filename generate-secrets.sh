#!/bin/bash

# Generate secure secrets for production deployment

echo "🔐 Generating Secure Secrets for BlockQuest Deployment"
echo "======================================================="
echo ""

echo "1️⃣ JWT Secret (for Railway backend):"
echo "----------------------------------------"
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
echo ""

echo "2️⃣ Alternative JWT Secret (if above doesn't work):"
echo "----------------------------------------"
openssl rand -hex 64 2>/dev/null || echo "openssl not available, use the Node.js version above"
echo ""

echo "📝 Instructions:"
echo "----------------------------------------"
echo "1. Copy one of the JWT secrets above"
echo "2. Add to Railway environment variables as: JWT_SECRET"
echo "3. Never share or commit these secrets!"
echo ""

echo "✅ Next Steps:"
echo "----------------------------------------"
echo "1. Setup MongoDB Atlas - get connection string"
echo "2. Setup Gmail App Password - get 16-char password"
echo "3. Deploy backend to Railway with these secrets"
echo "4. Deploy frontend to Vercel with backend URL"
echo ""

