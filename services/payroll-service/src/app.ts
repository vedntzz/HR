import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import payrollRoutes from './modules/payroll/payroll.routes';
import payslipRoutes from './modules/payslip/payslip.routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'payroll-service' });
});

app.use('/payroll', payrollRoutes);
app.use('/payslips', payslipRoutes);

app.use(errorHandler);

export default app;
