import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create company
  const company = await prisma.company.upsert({
    where: { id: 'default-company' },
    update: {},
    create: {
      id: 'default-company',
      name: 'Synergy Technofin',
      email: 'info@synergytechnofin.com',
      phone: '+91 98765 43210',
      address: 'Mumbai, Maharashtra, India',
    },
  });

  console.log('✅ Company created:', company.name);

  // Create departments
  const departments = await Promise.all([
    prisma.department.upsert({
      where: { code_companyId: { code: 'AGR', companyId: company.id } },
      update: {},
      create: {
        name: 'Agribusiness',
        code: 'AGR',
        description: 'Agricultural business operations',
        companyId: company.id,
      },
    }),
    prisma.department.upsert({
      where: { code_companyId: { code: 'FIN', companyId: company.id } },
      update: {},
      create: {
        name: 'Finance',
        code: 'FIN',
        description: 'Financial services and operations',
        companyId: company.id,
      },
    }),
    prisma.department.upsert({
      where: { code_companyId: { code: 'INF', companyId: company.id } },
      update: {},
      create: {
        name: 'Infrastructure',
        code: 'INF',
        description: 'Infrastructure development',
        companyId: company.id,
      },
    }),
    prisma.department.upsert({
      where: { code_companyId: { code: 'TECH', companyId: company.id } },
      update: {},
      create: {
        name: 'Technology',
        code: 'TECH',
        description: 'Technology and IT services',
        companyId: company.id,
      },
    }),
  ]);

  console.log('✅ Departments created:', departments.length);

  // Create leave policies
  const policies = await Promise.all([
    prisma.leavePolicy.create({
      data: {
        name: 'Annual Leave',
        leaveType: 'ANNUAL',
        daysAllowed: 24,
        carryForward: true,
        maxCarryForward: 12,
        companyId: company.id,
      },
    }),
    prisma.leavePolicy.create({
      data: {
        name: 'Sick Leave',
        leaveType: 'SICK',
        daysAllowed: 10,
        carryForward: false,
        companyId: company.id,
      },
    }),
    prisma.leavePolicy.create({
      data: {
        name: 'Emergency Leave',
        leaveType: 'EMERGENCY',
        daysAllowed: 5,
        carryForward: false,
        companyId: company.id,
      },
    }),
  ]);

  console.log('✅ Leave policies created:', policies.length);

  // Create admin employee
  const adminEmployee = await prisma.employee.upsert({
    where: { employeeCode: 'STF-ADMIN-001' },
    update: {},
    create: {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@synergytechnofin.com',
      employeeCode: 'STF-ADMIN-001',
      designation: 'System Administrator',
      departmentId: departments[3].id,
      joiningDate: new Date(),
      salary: 100000,
      companyId: company.id,
    },
  });

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@synergytechnofin.com' },
    update: {},
    create: {
      email: 'admin@synergytechnofin.com',
      password: hashedPassword,
      role: 'ADMIN',
      companyId: company.id,
      employeeId: adminEmployee.id,
    },
  });

  console.log('✅ Admin user created:', adminUser.email);

  // Create sample employee
  const sampleEmployee = await prisma.employee.upsert({
    where: { employeeCode: 'STF-2024-001' },
    update: {},
    create: {
      firstName: 'Vedant',
      lastName: 'Ghodke',
      email: 'vedant.ghodke@synergytechnofin.com',
      employeeCode: 'STF-2024-001',
      designation: 'Software Engineer',
      departmentId: departments[3].id,
      joiningDate: new Date('2024-01-15'),
      salary: 75000,
      companyId: company.id,
    },
  });

  const sampleUserPassword = await bcrypt.hash('employee123', 10);
  const sampleUser = await prisma.user.upsert({
    where: { email: 'vedant.ghodke@synergytechnofin.com' },
    update: {},
    create: {
      email: 'vedant.ghodke@synergytechnofin.com',
      password: sampleUserPassword,
      role: 'EMPLOYEE',
      companyId: company.id,
      employeeId: sampleEmployee.id,
    },
  });

  console.log('✅ Sample employee created:', sampleUser.email);

  console.log('✅ Database seeded successfully!');
  console.log('\n📝 Login Credentials:');
  console.log('Admin: admin@synergytechnofin.com / admin123');
  console.log('Employee: vedant.ghodke@synergytechnofin.com / employee123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
