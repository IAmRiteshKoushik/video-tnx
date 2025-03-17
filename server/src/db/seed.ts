import { PrismaClient, UserRole, CourseLevel, CourseStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
    },
  });
  console.log('Created admin user:', admin.email);

  // Create educator user
  const educatorPassword = await bcrypt.hash('educator123', 10);
  const educator = await prisma.user.upsert({
    where: { email: 'educator@example.com' },
    update: {},
    create: {
      email: 'educator@example.com',
      password: educatorPassword,
      firstName: 'Jane',
      lastName: 'Smith',
      role: UserRole.EDUCATOR,
      bio: 'Experienced web developer with 10 years of industry experience.',
    },
  });
  console.log('Created educator user:', educator.email);

  // Create student user
  const studentPassword = await bcrypt.hash('student123', 10);
  const student = await prisma.user.upsert({
    where: { email: 'student@example.com' },
    update: {},
    create: {
      email: 'student@example.com',
      password: studentPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.STUDENT,
    },
  });
  console.log('Created student user:', student.email);

  // Create a course
  const course = await prisma.course.upsert({
    where: { id: 'clm1234567890' },
    update: {},
    create: {
      id: 'clm1234567890',
      title: 'Introduction to Web Development',
      description: 'Learn the basics of HTML, CSS, and JavaScript to build modern websites from scratch.',
      category: 'Development',
      level: CourseLevel.BEGINNER,
      status: CourseStatus.PUBLISHED,
      creatorId: educator.id,
    },
  });
  console.log('Created course:', course.title);

  // Create sections
  const section1 = await prisma.section.create({
    data: {
      title: 'Getting Started with HTML',
      order: 1,
      courseId: course.id,
    },
  });

  const section2 = await prisma.section.create({
    data: {
      title: 'CSS Fundamentals',
      order: 2,
      courseId: course.id,
    },
  });

  console.log('Created sections');

  // Create lessons
  const lessons = await Promise.all([
    prisma.lesson.create({
      data: {
        title: 'Introduction to HTML',
        description: 'Learn the basics of HTML markup language',
        videoUrl: 'https://example.com/videos/intro-html',
        duration: '15:30',
        order: 1,
        sectionId: section1.id,
      },
    }),
    prisma.lesson.create({
      data: {
        title: 'HTML Document Structure',
        description: 'Understanding the structure of HTML documents',
        videoUrl: 'https://example.com/videos/html-structure',
        duration: '12:45',
        order: 2,
        sectionId: section1.id,
      },
    }),
    prisma.lesson.create({
      data: {
        title: 'Introduction to CSS',
        description: 'Learn the basics of CSS styling',
        videoUrl: 'https://example.com/videos/intro-css',
        duration: '14:15',
        order: 1,
        sectionId: section2.id,
      },
    }),
  ]);
  console.log('Created lessons');

  // Enroll student in course
  const enrollment = await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: course.id,
    },
  });
  console.log('Created enrollment');

  // Create progress for first lesson
  const progress = await prisma.lessonProgress.create({
    data: {
      userId: student.id,
      lessonId: lessons[0].id,
      completed: true,
      completedAt: new Date(),
    },
  });
  console.log('Created lesson progress');

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
