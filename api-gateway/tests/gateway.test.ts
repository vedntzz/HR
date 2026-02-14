import request from 'supertest';
import app from '../src/app';

describe('API Gateway', () => {
  describe('GET /health', () => {
    it('should return healthy status', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.service).toBe('api-gateway');
    });
  });

  describe('Unknown routes', () => {
    it('should return 404 for unknown paths', async () => {
      const res = await request(app).get('/nonexistent');
      expect(res.status).toBe(404);
    });
  });
});
