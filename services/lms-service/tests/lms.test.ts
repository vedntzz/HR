import request from 'supertest';
import app from '../src/app';

describe('LMS Service', () => {
  describe('GET /health', () => {
    it('should return healthy status', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.service).toBe('lms-service');
    });
  });

  describe('GET /courses', () => {
    it('should reject unauthenticated request', async () => {
      const res = await request(app).get('/courses');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /enrollments/me', () => {
    it('should reject unauthenticated request', async () => {
      const res = await request(app).get('/enrollments/me');
      expect(res.status).toBe(401);
    });
  });
});
