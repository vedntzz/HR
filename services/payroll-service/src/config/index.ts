import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  db: {
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
  };
  jwtSecret: string;
}

export const config: Config = {
  port: parseInt(process.env.PORT || '3004', 10),
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME || 'hrflow_payroll',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  },
  jwtSecret: process.env.JWT_SECRET || 'default-secret',
};
