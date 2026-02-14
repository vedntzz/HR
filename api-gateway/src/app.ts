import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { rateLimiter } from './middleware/rateLimiter';
import { requestLogger } from './middleware/requestLogger';
import { createProxyRouter } from './routes/proxy';

interface AppError extends Error {
  statusCode?: number;
  status?: string;
}

function createHealthCheckHandler() {
  return (_req: Request, res: Response): void => {
    res.status(200).json({
      status: 'healthy',
      service: 'api-gateway',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.nodeEnv,
    });
  };
}

function createNotFoundHandler() {
  return (req: Request, res: Response): void => {
    res.status(404).json({
      error: 'Not Found',
      message: `Route ${req.method} ${req.originalUrl} does not exist`,
      availableRoutes: [
        '/health',
        '/api/auth/*',
        '/api/employees/*',
        '/api/attendance/*',
        '/api/payroll/*',
        '/api/recruitment/*',
        '/api/lms/*',
        '/api/policies/*',
      ],
    });
  };
}

function createErrorHandler() {
  return (err: AppError, req: Request, res: Response, _next: NextFunction): void => {
    const statusCode = err.statusCode ?? 500;
    const message = config.nodeEnv === 'production'
      ? 'Internal Server Error'
      : err.message;

    console.error(`[Error] ${req.method} ${req.originalUrl}: ${err.message}`);

    if (config.nodeEnv !== 'production') {
      console.error(err.stack);
    }

    res.status(statusCode).json({
      error: err.status ?? 'Internal Server Error',
      message,
      ...(config.nodeEnv !== 'production' && { stack: err.stack }),
    });
  };
}

export function createApp(): express.Application {
  const app = express();

  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }));

  app.use(cors({
    origin: config.corsOrigin === '*' ? true : config.corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  }));

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  app.use(requestLogger);
  app.use(rateLimiter);

  app.get('/health', createHealthCheckHandler());

  const proxyRouter = createProxyRouter();
  app.use(proxyRouter);

  app.use(createNotFoundHandler());
  app.use(createErrorHandler());

  return app;
}
