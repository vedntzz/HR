# HRFlow — Multi-Tenant HR SaaS Platform

A production-grade, microservices-based HR management platform built for small-to-medium businesses. Features attendance tracking, payroll management, recruitment pipelines, learning management, and policy administration — all with multi-tenant isolation and a premium SaaS UI.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Web Frontend                            │
│                    Next.js 14 (App Router)                      │
│              Tailwind CSS · TypeScript · Port 8080              │
└───────────────────────────┬─────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                        API Gateway                              │
│               Express · Reverse Proxy · Port 3000               │
│          Rate Limiting · CORS · Request Logging                 │
└──┬──────┬──────┬──────┬──────┬──────┬──────┬────────────────────┘
   │      │      │      │      │      │      │
   ▼      ▼      ▼      ▼      ▼      ▼      ▼
┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐┌──────┐
│ Auth ││ Emp  ││ Att  ││ Pay  ││ Rec  ││ LMS  ││ Pol  │
│:3001 ││:3002 ││:3003 ││:3004 ││:3005 ││:3006 ││:3007 │
└──┬───┘└──┬───┘└──┬───┘└──┬───┘└──┬───┘└──┬───┘└──┬───┘
   │       │       │       │       │       │       │
   ▼       ▼       ▼       ▼       ▼       ▼       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PostgreSQL (per-service DB)                   │
│  hrflow_auth │ hrflow_employee │ hrflow_attendance │ ...        │
└─────────────────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer      | Technology                                |
|------------|-------------------------------------------|
| Frontend   | Next.js 14, TypeScript, Tailwind CSS      |
| Gateway    | Express, http-proxy-middleware             |
| Services   | Express, TypeScript, Zod, pg              |
| Database   | PostgreSQL 16                              |
| Auth       | JWT (access + refresh tokens), bcryptjs   |
| Validation | Zod schemas                               |
| DevOps     | Docker, docker-compose                    |

## Microservices

| Service              | Port | Database           | Description                          |
|----------------------|------|--------------------|--------------------------------------|
| `api-gateway`        | 3000 | —                  | Reverse proxy, rate limiting, CORS   |
| `auth-service`       | 3001 | `hrflow_auth`      | Registration, login, JWT, RBAC       |
| `employee-service`   | 3002 | `hrflow_employee`  | Employee profiles, departments, org  |
| `attendance-service` | 3003 | `hrflow_attendance`| Check-in/out, attendance history     |
| `payroll-service`    | 3004 | `hrflow_payroll`   | Salary config, payslip generation    |
| `recruitment-service`| 3005 | `hrflow_recruitment`| Candidates, interviews, onboarding  |
| `lms-service`        | 3006 | `hrflow_lms`       | Courses, enrollments, progress       |
| `policy-service`     | 3007 | `hrflow_policy`    | Company policies, acknowledgements   |

## Multi-Tenant Design

Every entity includes a `company_id` field. Tenant isolation is enforced at three levels:

1. **JWT**: Tokens include `companyId` in the payload
2. **Middleware**: Auth middleware extracts tenant context from JWT
3. **Database**: Every query filters by `company_id`

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 16+ (or Docker)
- npm

### Option 1: Docker (Recommended)

```bash
# Clone and start everything
docker-compose up --build

# Frontend: http://localhost:8080
# API Gateway: http://localhost:3000
```

### Option 2: Local Development

```bash
# 1. Install all dependencies
chmod +x scripts/*.sh
./scripts/install-all.sh

# 2. Start PostgreSQL and create databases
psql -U postgres -f scripts/init-databases.sql

# 3. Run migrations for all services
./scripts/migrate-all.sh

# 4. Start all services
./scripts/dev.sh
```

### Environment Variables

Copy `.env.example` to `.env` in the root and each service directory:

```bash
cp .env.example .env
for dir in services/*/; do
  cp "$dir/.env.example" "$dir/.env" 2>/dev/null
done
```

## Project Structure

```
hr-suite/
├── api-gateway/            # Reverse proxy
│   └── src/
│       ├── config/
│       ├── middleware/
│       ├── routes/
│       ├── app.ts
│       └── server.ts
├── services/
│   ├── auth-service/       # Authentication & RBAC
│   ├── employee-service/   # Employee & department management
│   ├── attendance-service/ # Attendance tracking
│   ├── payroll-service/    # Payroll & payslips
│   ├── recruitment-service/# Candidate pipeline
│   ├── lms-service/        # Learning management
│   └── policy-service/     # Policy management
│       └── src/
│           ├── config/
│           ├── modules/
│           │   └── <feature>/
│           │       ├── <feature>.types.ts
│           │       ├── <feature>.schema.ts
│           │       ├── <feature>.repository.ts
│           │       ├── <feature>.service.ts
│           │       ├── <feature>.controller.ts
│           │       └── <feature>.routes.ts
│           ├── middleware/
│           ├── app.ts
│           └── server.ts
├── shared/                 # Shared types, middleware, utils
├── web/                    # Next.js frontend
│   └── src/
│       ├── app/            # App Router pages
│       ├── components/     # Reusable UI components
│       ├── features/       # Feature-specific components
│       ├── hooks/          # Custom React hooks
│       ├── services/       # API client functions
│       ├── lib/            # Utilities
│       └── styles/         # Global CSS
├── scripts/                # Dev scripts
├── docker-compose.yml
└── README.md
```

## API Endpoints

### Auth (`/api/auth`)
| Method | Endpoint    | Auth | Description          |
|--------|-------------|------|----------------------|
| POST   | /register   | No   | Register new user    |
| POST   | /login      | No   | Login, returns JWT   |
| POST   | /refresh    | No   | Refresh access token |
| GET    | /profile    | Yes  | Get current profile  |

### Employees (`/api/employees`)
| Method | Endpoint            | Auth     | Description           |
|--------|---------------------|----------|-----------------------|
| GET    | /employees          | Yes      | List employees        |
| GET    | /employees/:id      | Yes      | Get employee by ID    |
| POST   | /employees          | HR/Admin | Create employee       |
| PUT    | /employees/:id      | HR/Admin | Update employee       |
| GET    | /employees/team/mine| Yes      | Get my team members   |
| GET    | /departments        | Yes      | List departments      |
| POST   | /departments        | HR/Admin | Create department     |

### Attendance (`/api/attendance`)
| Method | Endpoint    | Auth     | Description             |
|--------|-------------|----------|-------------------------|
| POST   | /check-in   | Yes      | Check in for today      |
| POST   | /check-out  | Yes      | Check out               |
| GET    | /me         | Yes      | My attendance history   |
| GET    | /me/today   | Yes      | Today's status          |
| GET    | /all        | HR/Admin | All attendance records  |

### Payroll (`/api/payroll`)
| Method | Endpoint          | Auth     | Description           |
|--------|-------------------|----------|-----------------------|
| GET    | /payroll/me       | Yes      | My payroll config     |
| GET    | /payslips/me      | Yes      | My payslips           |
| GET    | /payslips/me/:id  | Yes      | Payslip detail        |
| POST   | /payslips/generate| HR/Admin | Generate payslip      |

### Recruitment (`/api/recruitment`)
| Method | Endpoint                        | Auth     | Description              |
|--------|---------------------------------|----------|--------------------------|
| GET    | /candidates                     | HR/Admin | List candidates          |
| GET    | /candidates/pipeline            | HR/Admin | Pipeline counts by stage |
| POST   | /candidates                     | HR/Admin | Add candidate            |
| PUT    | /candidates/:id/stage           | HR/Admin | Update candidate stage   |
| POST   | /interviews/candidate/:id       | HR/Admin | Submit interview feedback|
| GET    | /interviews/candidate/:id       | HR/Admin | Get feedback             |

### LMS (`/api/lms`)
| Method | Endpoint                    | Auth     | Description           |
|--------|------------------------------|----------|-----------------------|
| GET    | /courses                     | Yes      | List courses          |
| POST   | /courses                     | HR/Admin | Create course         |
| GET    | /enrollments/me              | Yes      | My enrollments        |
| POST   | /enrollments/assign          | HR/Admin | Assign course         |
| PUT    | /enrollments/:id/progress    | Yes      | Update progress       |

### Policies (`/api/policies`)
| Method | Endpoint                     | Auth     | Description           |
|--------|------------------------------|----------|-----------------------|
| GET    | /policies                    | Yes      | List policies         |
| POST   | /policies                    | HR/Admin | Create policy         |
| POST   | /policies/:id/acknowledge    | Yes      | Acknowledge policy    |
| GET    | /policies/:id/acknowledgements| HR/Admin| View acknowledgements |

## RBAC Roles

| Role     | Access Level                                         |
|----------|------------------------------------------------------|
| admin    | Full access to all features and all companies        |
| hr       | Full access within their company                     |
| manager  | Team management, view access to most features        |
| employee | Personal data, attendance, payslips, policies, LMS   |

## Code Quality Standards

- TypeScript strict mode everywhere
- Zod validation on all inputs
- Centralized error handling (AppError class hierarchy)
- No file exceeds 250 lines
- No function exceeds 50 lines
- Controller → Service → Repository separation
- No business logic in routes or controllers
- Structured JSON logging
- Tenant isolation enforced at every layer

## Production Deployment

1. Set strong `JWT_SECRET` and database credentials in environment
2. Run `docker-compose -f docker-compose.yml up -d`
3. Run migrations: `./scripts/migrate-all.sh`
4. Configure reverse proxy (nginx/Cloudflare) in front of port 3000
5. Set `CORS_ORIGIN` to your frontend domain
6. Enable TLS termination at the proxy layer

## License

Proprietary — All rights reserved.
