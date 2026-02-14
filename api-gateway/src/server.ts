import { createApp } from './app';
import { config } from './config';

function startServer(): void {
  const app = createApp();

  const server = app.listen(config.port, () => {
    console.log('='.repeat(60));
    console.log(`  HR API Gateway`);
    console.log(`  Environment: ${config.nodeEnv}`);
    console.log(`  Port:        ${config.port}`);
    console.log(`  CORS Origin: ${config.corsOrigin}`);
    console.log('='.repeat(60));
    console.log('');
    console.log('  Downstream services:');
    console.log(`    Auth:        ${config.services.auth}`);
    console.log(`    Employee:    ${config.services.employee}`);
    console.log(`    Attendance:  ${config.services.attendance}`);
    console.log(`    Payroll:     ${config.services.payroll}`);
    console.log(`    Recruitment: ${config.services.recruitment}`);
    console.log(`    LMS:         ${config.services.lms}`);
    console.log(`    Policy:      ${config.services.policy}`);
    console.log('');
    console.log('='.repeat(60));
  });

  function handleShutdown(signal: string): void {
    console.log(`\n[${signal}] Shutting down API Gateway gracefully...`);
    server.close(() => {
      console.log('Server closed. Exiting process.');
      process.exit(0);
    });

    setTimeout(() => {
      console.error('Forced shutdown after timeout.');
      process.exit(1);
    }, 10000).unref();
  }

  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));

  process.on('unhandledRejection', (reason: unknown) => {
    console.error('[UnhandledRejection]', reason);
  });

  process.on('uncaughtException', (error: Error) => {
    console.error('[UncaughtException]', error.message);
    console.error(error.stack);
    process.exit(1);
  });
}

startServer();
