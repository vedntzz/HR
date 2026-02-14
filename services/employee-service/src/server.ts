import app from './app';
import { config } from './config';
import { testConnection } from './config/database';

async function start(): Promise<void> {
  await testConnection();

  app.listen(config.port, () => {
    console.log(
      `Employee service running on port ${config.port} [${config.nodeEnv}]`
    );
  });
}

start().catch((err: Error) => {
  console.error('Failed to start employee service:', err.message);
  process.exit(1);
});
