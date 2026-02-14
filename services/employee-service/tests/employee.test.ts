import request from 'supertest';
import app from '../src/app';

describe('Employee Service', () => {
  describe('GET /health', () => {
    it('should return healthy status', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.service).toBe('employee-service');
    });
  });

  describe('GET /employees', () => {
    it('should reject unauthenticated request', async () => {
      const res = await request(app).get('/employees');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /departments', () => {
    it('should reject unauthenticated request', async () => {
      const res = await request(app).get('/departments');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /employees', () => {
    it('should reject unauthenticated create', async () => {
      const res = await request(app)
        .post('/employees')
        .send({ firstName: 'Test', lastName: 'User' });
      expect(res.status).toBe(401);
    });
  });
});
