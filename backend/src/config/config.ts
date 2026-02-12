import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5001,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'demo-secret-key-for-local-dev',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  companyName: process.env.COMPANY_NAME || 'Synergy Technofin',
  companyEmail: process.env.COMPANY_EMAIL || 'hr@synergytechnofin.com',
};
