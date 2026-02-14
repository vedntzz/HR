import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import candidateRoutes from './modules/candidate/candidate.routes';
import interviewRoutes from './modules/interview/interview.routes';
import onboardingRoutes from './modules/onboarding/onboarding.routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'recruitment-service' });
});

app.use('/candidates', candidateRoutes);
app.use('/interviews', interviewRoutes);
app.use('/onboarding', onboardingRoutes);

app.use(errorHandler);

export default app;
