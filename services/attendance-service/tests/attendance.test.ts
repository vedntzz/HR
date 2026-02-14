import request from 'supertest';
import app from '../src/app';

describe('Attendance Service', () => {
  describe('GET /health', () => {
    it('should return healthy status', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.service).toBe('attendance-service');
    });
  });

  describe('POST /check-in', () => {
    it('should reject unauthenticated check-in', async () => {
      const res = await request(app).post('/check-in');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /check-out', () => {
    it('should reject unauthenticated check-out', async () => {
      const res = await request(app).post('/check-out');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /me', () => {
    it('should reject unauthenticated request', async () => {
      const res = await request(app).get('/me');
      expect(res.status).toBe(401);
    });
  });
});
