import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import policyRoutes from './modules/policy/policy.routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'policy-service' });
});

app.use('/policies', policyRoutes);

app.use(errorHandler);

export default app;
