const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const { testMySQLConnection, connectMongoDB } = require('./src/config/db');
const { verifySMTPConnection } = require('./src/services/emailService');
const errorHandler = require('./src/middleware/errorHandler');
const { authenticateToken } = require('./src/middleware/auth');
const { predictSalary } = require('./src/controllers/mlController');
const { getStatisticsSummary } = require('./src/controllers/analyticsController');

// Route imports
const authRoutes = require('./src/routes/authRoutes');
const candidateRoutes = require('./src/routes/candidateRoutes');
const jobRoutes = require('./src/routes/jobRoutes');
const applicationRoutes = require('./src/routes/applicationRoutes');
const mlRoutes = require('./src/routes/mlRoutes');
const analyticsRoutes = require('./src/routes/analyticsRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');
const reportRoutes = require('./src/routes/reportRoutes');
const companyRoutes = require('./src/routes/companyRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');
const membershipRoutes = require('./src/routes/membershipRoutes');

const app = express();
const PORT = process.env.PORT || 5005;

// Ensure upload directory exists
const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ----------------------------------------------------------------------------
// Security & Core Middleware Pipeline
// ----------------------------------------------------------------------------
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server or tools without origin header (e.g. curl, postman, mobile webviews)
    if (!origin) return callback(null, true);
    // Allow any localhost or 127.0.0.1 port (Vite 5173, 5174, 5175, etc.)
    if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }
    // Allow all Vercel deployments, Render internal endpoints, and configured CLIENT_URL
    if (origin.endsWith('.vercel.app') || origin.endsWith('.onrender.com') || (process.env.CLIENT_URL && origin === process.env.CLIENT_URL)) {
      return callback(null, true);
    }
    // Permissive fallback in production to guarantee mobile and browser compatibility
    if (process.env.NODE_ENV === 'production') {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use(cookieParser());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(morgan('dev'));

// Static uploads directory for resume inspection
app.use('/uploads', express.static(uploadDir));

// ----------------------------------------------------------------------------
// Health Check Endpoint
// ----------------------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    service: 'Smart Recruitment Backend Orchestrator',
    timestamp: new Date().toISOString(),
    node_version: process.version,
    security: {
      helmet: 'ENABLED',
      rateLimiting: 'ENABLED',
      bcrypt: 'ENABLED',
      cryptoTokens: 'SHA-256',
    },
    services_integrated: [
      'AI Salary Prediction & Intelligent Candidate Matching (Flask Microservice :5001)',
      'Recruitment Workflow & Business Logic Services (Node.js API Services :5005)',
      'Workforce Analytics & Salary Insights Engine (Statistical Computation Core)',
      'Secure Recruitment Data Management & Reporting (MySQL 8.4 3NF + MongoDB Atlas)',
    ],
  });
});

// ----------------------------------------------------------------------------
// Mount Core Application Routes
// ----------------------------------------------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/ml', mlRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/membership', membershipRoutes);

// Academic specification top-level aliases
app.post('/api/predict-salary', authenticateToken, predictSalary);
app.get('/api/analytics', authenticateToken, getStatisticsSummary);

app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to the Smart Recruitment, Salary Prediction & Analytics System API.',
    docs: '/api/health',
  });
});

// 404 Catch-all handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use(errorHandler);

// ----------------------------------------------------------------------------
// Server Initialization
// ----------------------------------------------------------------------------
async function startServer() {
  console.log('========================================================');
  console.log('🚀 INITIALIZING SMART RECRUITMENT ENTERPRISE BACKEND');
  console.log('========================================================');

  // Verify database connectors and email service
  await testMySQLConnection();
  await connectMongoDB();
  await verifySMTPConnection();

  app.listen(PORT, () => {
    console.log(`📡 Gateway Server listening on: http://127.0.0.1:${PORT}`);
    console.log(`🩺 Health check URL: http://127.0.0.1:${PORT}/api/health`);
    console.log('========================================================');
  });
}

if (require.main === module) {
  startServer();
}

module.exports = app;
