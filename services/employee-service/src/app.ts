import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import employeeRoutes from './modules/employee/employee.routes';
import departmentRoutes from './modules/department/department.routes';
import { errorHandler } from './middleware/errorHandler';
import { config } from './config';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

if (config.isDevelopment) {
  app.use(morgan('dev'));
}

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'employee-service' });
});

app.use('/employees', employeeRoutes);
app.use('/departments', departmentRoutes);

app.use(errorHandler);

export default app;
