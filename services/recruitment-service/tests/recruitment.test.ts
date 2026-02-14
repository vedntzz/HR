import request from 'supertest';
import app from '../src/app';

describe('Recruitment Service', () => {
  describe('GET /health', () => {
    it('should return healthy status', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.service).toBe('recruitment-service');
    });
  });

  describe('GET /candidates', () => {
    it('should reject unauthenticated request', async () => {
      const res = await request(app).get('/candidates');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /candidates/pipeline', () => {
    it('should reject unauthenticated request', async () => {
      const res = await request(app).get('/candidates/pipeline');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /interviews/candidate/:id', () => {
    it('should reject unauthenticated feedback', async () => {
      const res = await request(app)
        .post('/interviews/candidate/test-id')
        .send({});
      expect(res.status).toBe(401);
    });
  });
});
