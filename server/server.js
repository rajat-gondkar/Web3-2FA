import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database.js';
import authRoutes from './routes/authRoutes.js';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (dev only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Routes
app.use('/api/auth', authRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'BlockQuest Server is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Start server
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log('');
  console.log('╔════════════════════════════════════════════════╗');
  console.log('║                                                ║');
  console.log('║        🔐 BlockQuest Server Started 🚀        ║');
  console.log('║                                                ║');
  console.log('╚════════════════════════════════════════════════╝');
  console.log('');
  console.log(`🌐 Server running on port: ${PORT}`);
  console.log(`📍 API URL: http://localhost:${PORT}`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('');
  console.log('Available endpoints:');
  console.log('  POST /api/auth/register/step1');
  console.log('  POST /api/auth/register/step2');
  console.log('  POST /api/auth/register/step3');
  console.log('  POST /api/auth/resend-otp');
  console.log('  POST /api/auth/login');
  console.log('  POST /api/auth/verify-wallet');
  console.log('  GET  /api/auth/me (protected)');
  console.log('  GET  /api/health');
  console.log('');
});

export default app;
