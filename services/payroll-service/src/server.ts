import app from './app';
import { config } from './config';

const start = (): void => {
  app.listen(config.port, () => {
    console.log(`Payroll service running on port ${config.port}`);
  });
};

start();
