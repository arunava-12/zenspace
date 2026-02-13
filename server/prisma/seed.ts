import { PrismaClient, UserRole, ProjectStatus, TaskStatus, Priority } from '@prisma/client';
import bcrypt from 'bcrypt';
import 'dotenv/config';

// Initialize PrismaClient with explicit configuration
const prisma = new PrismaClient({});

const SALT_ROUNDS = 10;

async function main() {
  console.log('🌱 Starting database seed...\n');

  try {
    // Clear existing data (optional - comment out to keep data)
    // await prisma.comment.deleteMany({});
    // await prisma.fileAsset.deleteMany({});
    // await prisma.task.deleteMany({});
    // await prisma.projectUser.deleteMany({});
    // await prisma.project.deleteMany({});
    // await prisma.workspaceUser.deleteMany({});
    // await prisma.workspace.deleteMany({});
    // await prisma.user.deleteMany({});

    // Create demo user
    const hashedPassword = await bcrypt.hash('Demo@123', SALT_ROUNDS);
    const demoUser = await prisma.user.upsert({
      where: { email: 'demo@example.com' },
      update: {},
      create: {
        email: 'demo@example.com',
        name: 'Demo User',
        password: hashedPassword,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo@example.com',
        role: UserRole.ADMIN,
      },
    });

    console.log('✅ Created demo user:', demoUser.email);

    // Create workspace
    const workspace = await prisma.workspace.upsert({
      where: { id: 'demo-workspace' },
      update: {},
      create: {
        id: 'demo-workspace',
        name: "Demo's Workspace",
        ownerId: demoUser.id,
      },
    });

    console.log('✅ Created workspace:', workspace.name);

    // Add user to workspace
    await prisma.workspaceUser.upsert({
      where: { userId_workspaceId: { userId: demoUser.id, workspaceId: workspace.id } },
      update: {},
      create: {
        userId: demoUser.id,
        workspaceId: workspace.id,
      },
    });

    console.log('✅ Added user to workspace\n');

    // Create sample project
    const project = await prisma.project.create({
      data: {
        name: 'Website Redesign',
        description: 'Modernizing the landing page with better conversion metrics.',
        status: ProjectStatus.ACTIVE,
        priority: Priority.HIGH,
        progress: 65,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-06-30'),
        workspaceId: workspace.id,
        leadId: demoUser.id,
      },
    });

    console.log('✅ Created project:', project.name);

    // Add user as project member
    await prisma.projectUser.create({
      data: {
        userId: demoUser.id,
        projectId: project.id,
      },
    });

    // Create sample tasks
    const task1 = await prisma.task.create({
      data: {
        title: 'Design Hero Section',
        description: 'Create high-fidelity mockups for the main hero section.',
        status: TaskStatus.DONE,
        type: 'FEATURE',
        priority: Priority.HIGH,
        assigneeId: demoUser.id,
        projectId: project.id,
        dueDate: new Date('2024-04-10'),
      },
    });

    const task2 = await prisma.task.create({
      data: {
        title: 'API Integration',
        description: 'Connect the frontend forms to the backend services.',
        status: TaskStatus.IN_PROGRESS,
        type: 'IMPROVEMENT',
        priority: Priority.MEDIUM,
        assigneeId: demoUser.id,
        projectId: project.id,
        dueDate: new Date('2024-05-15'),
      },
    });

    console.log(`✅ Created ${[task1, task2].length} sample tasks\n`);

    console.log('🎉 Database seed completed successfully!\n');
    console.log('Demo Login Credentials:');
    console.log('✉️  Email: demo@example.com');
    console.log('🔑 Password: Demo@123\n');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
