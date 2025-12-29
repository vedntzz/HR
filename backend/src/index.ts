import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/config';
import { errorHandler, notFound } from './middleware/errorHandler';
import { apiRateLimiter } from './middleware/rateLimit';

// Routes
import authRoutes from './routes/authRoutes';
import leaveRoutes from './routes/leaveRoutes';
import attendanceRoutes from './routes/attendanceRoutes';
import employeeRoutes from './routes/employeeRoutes';
import payrollRoutes from './routes/payrollRoutes';

const app: Application = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Logging
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use('/api/', apiRateLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Synergy HRMS API is running',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/payroll', payrollRoutes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

// Start server
const PORT = config.port;

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 SYNERGY HRMS API SERVER                             ║
║                                                           ║
║   Environment: ${config.nodeEnv.padEnd(44)}║
║   Port: ${String(PORT).padEnd(50)}║
║   Company: ${config.companyName.padEnd(47)}║
║                                                           ║
║   📝 API Docs: http://localhost:${PORT}/health${' '.repeat(18)}║
║                                                           ║
║   ✅ Server is running successfully!                     ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

export default app;
