import { Pool, PoolConfig } from 'pg';
import { Logger } from '../utils/logger';

export function createDatabasePool(config: PoolConfig, logger: Logger): Pool {
  const pool = new Pool({
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    ...config,
  });

  pool.on('error', (err) => {
    logger.error('Unexpected database pool error', { error: err.message });
  });

  pool.on('connect', () => {
    logger.debug('New database connection established');
  });

  return pool;
}

export function getDatabaseConfig(prefix: string): PoolConfig {
  return {
    host: process.env[`${prefix}_DB_HOST`] || process.env.DB_HOST || 'localhost',
    port: parseInt(process.env[`${prefix}_DB_PORT`] || process.env.DB_PORT || '5432', 10),
    database: process.env[`${prefix}_DB_NAME`] || `hrflow_${prefix.toLowerCase()}`,
    user: process.env[`${prefix}_DB_USER`] || process.env.DB_USER || 'postgres',
    password: process.env[`${prefix}_DB_PASSWORD`] || process.env.DB_PASSWORD || 'postgres',
  };
}
