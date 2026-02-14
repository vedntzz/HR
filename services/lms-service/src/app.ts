import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import courseRoutes from './modules/course/course.routes';
import enrollmentRoutes from './modules/enrollment/enrollment.routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'lms-service' });
});

app.use('/courses', courseRoutes);
app.use('/enrollments', enrollmentRoutes);

app.use(errorHandler);

export default app;
