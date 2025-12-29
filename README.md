# Synergy HRMS - Modern Human Resource Management System

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)

**Production-ready HRMS with better UX than traditional tools**

[Features](#features) • [Tech Stack](#tech-stack) • [Quick Start](#quick-start) • [Documentation](#documentation)

</div>

---

## 🎯 Product Vision

**"Simple for employees, powerful for admins."**

Most HRMS tools fail because they are:
- ❌ Overloaded with features
- ❌ Ugly and hard to navigate
- ❌ Built for HR, not employees

**Synergy HRMS is different:**
- ✅ Minimal, clean UI
- ✅ Fast flows (2-3 clicks max)
- ✅ Mobile-first design
- ✅ Clear role separation
- ✅ Scalable for SaaS

---

## ✨ Features

### 🔐 Authentication & Authorization
- Email + password authentication
- JWT-based secure sessions
- Role-based access control (Admin, HR, Manager, Employee)
- Audit logging for all actions

### 👤 Employee Module
- ✅ Editable profile
- ✅ Apply for leave
- ✅ View leave balance
- ✅ View payslips
- ✅ Mark attendance (check-in/check-out)
- ✅ Notifications

### 🧑‍💼 Admin Module
- ✅ Employee CRUD operations
- ✅ Department management
- ✅ Leave approval workflow
- ✅ Payroll generation and processing
- ✅ Attendance tracking
- ✅ Reports and exports
- ✅ System settings

---

## 🛠 Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Components:** Custom ShadCN-inspired UI
- **State:** Zustand
- **Forms:** React Hook Form + Zod
- **HTTP:** Axios

### Backend
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT + bcrypt
- **Validation:** Zod + express-validator
- **Security:** Helmet, CORS, Rate Limiting

### DevOps
- **Version Control:** Git
- **Package Manager:** npm
- **Environment:** Node.js 18+
- **Database:** PostgreSQL 14+

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Git

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/yourusername/synergy-hrms.git
cd synergy-hrms
\`\`\`

### 2. Install Dependencies

\`\`\`bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
\`\`\`

### 3. Set Up Environment Variables

Create \`.env\` file in the root directory:

\`\`\`env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/synergy_hrms?schema=public"

# Backend
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5000/api
\`\`\`

### 4. Set Up Database

\`\`\`bash
cd backend

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database with sample data
npm run seed
\`\`\`

### 5. Start Development Servers

\`\`\`bash
# From root directory - runs both frontend and backend
npm run dev

# OR run separately:
# Backend (from backend directory)
cd backend && npm run dev

# Frontend (from frontend directory)
cd frontend && npm run dev
\`\`\`

### 6. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/health

### 7. Login with Demo Credentials

**Admin Account:**
- Email: \`admin@synergytechnofin.com\`
- Password: \`admin123\`

**Employee Account:**
- Email: \`vedant.ghodke@synergytechnofin.com\`
- Password: \`employee123\`

---

## 📁 Project Structure

\`\`\`
synergy-hrms/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema
│   │   └── seed.ts                # Database seeding
│   ├── src/
│   │   ├── config/                # Configuration files
│   │   ├── controllers/           # Route controllers
│   │   ├── middleware/            # Express middleware
│   │   ├── routes/                # API routes
│   │   ├── services/              # Business logic
│   │   ├── types/                 # TypeScript types
│   │   ├── utils/                 # Utility functions
│   │   └── index.ts               # Entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/                   # Next.js app directory
│   │   │   ├── (auth)/           # Auth pages
│   │   │   ├── (dashboard)/      # Dashboard pages
│   │   │   │   ├── employee/     # Employee portal
│   │   │   │   └── admin/        # Admin portal
│   │   │   └── layout.tsx
│   │   ├── components/            # React components
│   │   │   ├── ui/               # UI components
│   │   │   ├── layouts/          # Layout components
│   │   │   └── forms/            # Form components
│   │   ├── hooks/                 # Custom hooks
│   │   ├── lib/                   # Utility libraries
│   │   ├── services/              # API services
│   │   ├── styles/                # Global styles
│   │   └── types/                 # TypeScript types
│   └── package.json
│
├── .env.example                   # Environment template
├── .gitignore
├── package.json                   # Root package.json
└── README.md
\`\`\`

---

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Role-based access control (RBAC)
- ✅ Rate limiting on API endpoints
- ✅ Input validation and sanitization
- ✅ Audit logging for admin actions
- ✅ Helmet.js security headers
- ✅ CORS configuration

---

## 📊 Database Schema

### Core Tables

- **Company** - Multi-tenant support
- **User** - Authentication and authorization
- **Employee** - Employee information
- **Department** - Organization structure
- **LeavePolicy** - Leave configurations
- **LeaveRequest** - Leave applications
- **Attendance** - Daily attendance records
- **Payroll** - Salary and payments
- **AuditLog** - System audit trail

---

## 🎨 UX Design Principles

### Rule 1: One Purpose Per Page
Each screen answers only one question. No cluttered dashboards with 15 cards.

### Rule 2: Zero Learning Curve
New employees should know what to click within 5 seconds.
- Clear empty states
- Helpful tooltips
- Obvious CTAs

### Rule 3: Mobile-First
- Big, touch-friendly buttons
- No tiny text
- Sticky bottom actions

---

## 🚀 Deployment

### Build for Production

\`\`\`bash
# Build frontend
cd frontend && npm run build

# Build backend
cd backend && npm run build
\`\`\`

### Environment Setup

1. Set \`NODE_ENV=production\`
2. Update \`DATABASE_URL\` for production database
3. Set secure \`JWT_SECRET\`
4. Configure CORS for production domain

### Recommended Platforms

- **Frontend:** Vercel
- **Backend:** Railway / Render / Fly.io
- **Database:** Supabase / Neon / Railway Postgres

---

## 📝 API Documentation

### Authentication Endpoints

\`\`\`
POST /api/auth/login          - User login
POST /api/auth/register       - User registration
GET  /api/auth/profile        - Get user profile
PUT  /api/auth/profile        - Update profile
PUT  /api/auth/change-password - Change password
\`\`\`

### Employee Endpoints

\`\`\`
GET    /api/employees          - Get all employees (Admin)
GET    /api/employees/:id      - Get employee by ID
POST   /api/employees          - Create employee (Admin)
PUT    /api/employees/:id      - Update employee (Admin)
DELETE /api/employees/:id      - Deactivate employee (Admin)
GET    /api/employees/departments - Get departments
\`\`\`

### Leave Endpoints

\`\`\`
POST   /api/leave              - Create leave request
GET    /api/leave/my-requests  - Get my leave requests
GET    /api/leave/balance      - Get leave balance
GET    /api/leave/all          - Get all requests (Admin)
PUT    /api/leave/:id/status   - Update leave status (Admin)
DELETE /api/leave/:id          - Delete leave request
\`\`\`

### Attendance Endpoints

\`\`\`
POST   /api/attendance/check-in    - Check in
POST   /api/attendance/check-out   - Check out
GET    /api/attendance/my-attendance - Get my attendance
GET    /api/attendance/all         - Get all attendance (Admin)
GET    /api/attendance/stats/today - Get today's stats (Admin)
\`\`\`

### Payroll Endpoints

\`\`\`
GET    /api/payroll/my-payslips    - Get my payslips
GET    /api/payroll/:id            - Get payslip by ID
GET    /api/payroll/all            - Get all payrolls (Admin)
POST   /api/payroll/generate       - Generate payroll (Admin)
PUT    /api/payroll/:id/process    - Process payroll (Admin)
\`\`\`

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

**Vedant Ghodke**
- GitHub: [@vedntzz](https://github.com/vedntzz)

---

## 🙏 Acknowledgments

- Design inspiration from modern SaaS products
- UI components inspired by ShadCN UI
- Built with ❤️ for better employee experience

---

## 📞 Support

For issues and questions:
- GitHub Issues: [Create an issue](https://github.com/yourusername/synergy-hrms/issues)
- Email: vedant.ghodke@synergytechnofin.com

---

<div align="center">

**Built with** ❤️ **by Synergy Technofin**

⭐ Star this repo if you find it helpful!

</div>
