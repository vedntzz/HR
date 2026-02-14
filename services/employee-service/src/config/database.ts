import { Pool, PoolConfig } from 'pg';
import { config } from './index';

const poolConfig: PoolConfig = {
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.name,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
};

export const pool = new Pool(poolConfig);

pool.on('error', (err: Error) => {
  console.error('Unexpected database pool error:', err.message);
});

export async function testConnection(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query('SELECT NOW()');
    console.log('Database connection established successfully');
  } finally {
    client.release();
  }
}

export async function closePool(): Promise<void> {
  await pool.end();
  console.log('Database pool closed');
}
