import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createAuthRouter } from './modules/auth/auth.routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({
    success: true,
    service: 'auth-service',
    timestamp: new Date().toISOString(),
  });
});

app.use('/', createAuthRouter());

app.use(errorHandler);

export { app };
