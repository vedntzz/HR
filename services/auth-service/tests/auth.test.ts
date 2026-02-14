import request from 'supertest';
import app from '../src/app';

describe('Auth Service', () => {
  describe('GET /health', () => {
    it('should return healthy status', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.service).toBe('auth-service');
      expect(res.body.timestamp).toBeDefined();
    });
  });

  describe('POST /register', () => {
    it('should reject registration without required fields', async () => {
      const res = await request(app)
        .post('/register')
        .send({});
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject registration with invalid email', async () => {
      const res = await request(app)
        .post('/register')
        .send({
          email: 'not-an-email',
          password: 'Test123!@#',
          firstName: 'Test',
          lastName: 'User',
          companyId: '00000000-0000-0000-0000-000000000001',
        });
      expect(res.status).toBe(400);
    });
  });

  describe('POST /login', () => {
    it('should reject login without credentials', async () => {
      const res = await request(app)
        .post('/login')
        .send({});
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /profile', () => {
    it('should reject unauthenticated request', async () => {
      const res = await request(app).get('/profile');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject invalid token', async () => {
      const res = await request(app)
        .get('/profile')
        .set('Authorization', 'Bearer invalid-token');
      expect(res.status).toBe(401);
    });
  });
});
