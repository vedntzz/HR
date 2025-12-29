# Deployment Guide

## Prerequisites

- Docker and Docker Compose
- PostgreSQL 14+
- Node.js 18+

## Quick Start with Docker

1. **Clone and setup:**
   \`\`\`bash
   git clone <repository-url>
   cd synergy-hrms
   \`\`\`

2. **Start all services:**
   \`\`\`bash
   docker-compose up -d
   \`\`\`

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## Manual Deployment

### Backend Deployment (Railway/Render)

1. **Prepare environment variables:**
   \`\`\`env
   DATABASE_URL=<your-postgres-url>
   JWT_SECRET=<your-secret-key>
   NODE_ENV=production
   PORT=5000
   \`\`\`

2. **Build and deploy:**
   \`\`\`bash
   cd backend
   npm run build
   npm run prisma:migrate
   npm run seed
   npm start
   \`\`\`

### Frontend Deployment (Vercel)

1. **Set environment variables:**
   \`\`\`env
   NEXT_PUBLIC_API_URL=<your-backend-url>/api
   \`\`\`

2. **Deploy:**
   \`\`\`bash
   cd frontend
   npm run build
   npm start
   \`\`\`

## Database Setup

1. **Create PostgreSQL database**
2. **Run migrations:**
   \`\`\`bash
   cd backend
   npx prisma migrate deploy
   \`\`\`

3. **Seed initial data:**
   \`\`\`bash
   npm run seed
   \`\`\`

## Production Checklist

- [ ] Set secure JWT_SECRET
- [ ] Configure CORS for production domain
- [ ] Enable HTTPS
- [ ] Set up database backups
- [ ] Configure monitoring (Sentry)
- [ ] Set up logging
- [ ] Enable rate limiting
- [ ] Review security headers
- [ ] Test all critical flows
- [ ] Set up CI/CD pipeline

## Monitoring

- Backend health: GET /health
- Database connection: Check logs
- Frontend: Browser console

## Troubleshooting

**Database connection issues:**
- Verify DATABASE_URL format
- Check database is accessible
- Ensure migrations are run

**Frontend API errors:**
- Verify NEXT_PUBLIC_API_URL
- Check CORS configuration
- Ensure backend is running

**Authentication issues:**
- Verify JWT_SECRET matches
- Check token expiration
- Clear browser cache
