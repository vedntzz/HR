import request from 'supertest';
import app from '../src/app';

describe('Policy Service', () => {
  describe('GET /health', () => {
    it('should return healthy status', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.service).toBe('policy-service');
    });
  });

  describe('GET /policies', () => {
    it('should reject unauthenticated request', async () => {
      const res = await request(app).get('/policies');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /policies', () => {
    it('should reject unauthenticated create', async () => {
      const res = await request(app)
        .post('/policies')
        .send({ title: 'Test', content: 'Test content' });
      expect(res.status).toBe(401);
    });
  });
});
