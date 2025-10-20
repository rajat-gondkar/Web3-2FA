#!/bin/bash

# BlockQuest Setup Script
# This script will install all dependencies for both client and server

echo "╔════════════════════════════════════════════════╗"
echo "║                                                ║"
echo "║        🔐 BlockQuest Setup Script 🚀          ║"
echo "║                                                ║"
echo "╚════════════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Setup Server
echo "📦 Installing server dependencies..."
cd server
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from example..."
    cp .env.example .env
    echo "⚠️  Please edit server/.env with your configuration!"
fi
npm install
echo "✅ Server setup complete!"
echo ""

# Setup Client
echo "📦 Installing client dependencies..."
cd ../client
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from example..."
    cp .env.example .env
fi
npm install
echo "✅ Client setup complete!"
echo ""

cd ..

echo "╔════════════════════════════════════════════════╗"
echo "║                                                ║"
echo "║          🎉 Setup Complete! 🎉                ║"
echo "║                                                ║"
echo "╚════════════════════════════════════════════════╝"
echo ""
echo "📋 Next steps:"
echo "1. Edit server/.env with your MongoDB URI and email credentials"
echo "2. Start MongoDB if running locally"
echo "3. Run 'cd server && npm run dev' to start backend"
echo "4. Run 'cd client && npm run dev' to start frontend"
echo ""
echo "🌐 URLs:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:5001"
echo ""
