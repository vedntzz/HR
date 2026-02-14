import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { attendanceRoutes } from './modules/attendance/attendance.routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({
    success: true,
    service: 'attendance-service',
    timestamp: new Date().toISOString(),
  });
});

app.use('/', attendanceRoutes);

app.use(errorHandler);

export { app };
