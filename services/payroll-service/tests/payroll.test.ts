import request from 'supertest';
import app from '../src/app';

describe('Payroll Service', () => {
  describe('GET /health', () => {
    it('should return healthy status', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.service).toBe('payroll-service');
    });
  });

  describe('GET /payroll/me', () => {
    it('should reject unauthenticated request', async () => {
      const res = await request(app).get('/payroll/me');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /payslips/me', () => {
    it('should reject unauthenticated request', async () => {
      const res = await request(app).get('/payslips/me');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /payslips/generate', () => {
    it('should reject unauthenticated generation', async () => {
      const res = await request(app)
        .post('/payslips/generate')
        .send({});
      expect(res.status).toBe(401);
    });
  });
});
