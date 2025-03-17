import express from 'express';
import { prisma } from '../index';
import { authenticate, authorizeEducator } from '../middleware/auth';

const router = express.Router();

// Create a new section
router.post('/sections', authenticate, authorizeEducator, async (req, res, next) => {
  try {
    const { courseId, title, order } = req.body;

    // Validate input
    if (!courseId || !title) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    // Check if course exists and user is the creator
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.creatorId !== req.user?.id && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get max order if not provided
    let sectionOrder = order;
    if (!sectionOrder) {
      const maxOrderSection = await prisma.section.findFirst({
        where: { courseId },
        orderBy: { order: 'desc' }
      });
      sectionOrder = maxOrderSection ? maxOrderSection.order + 1 : 1;
    }

    // Create section
    const section = await prisma.section.create({
      data: {
        title,
        order: sectionOrder,
        course: {
          connect: { id: courseId }
        }
      }
    });

    res.status(201).json({
      message: 'Section created successfully',
      section
    });
  } catch (error) {
    next(error);
  }
});

// Update a section
router.put('/sections/:id', authenticate, authorizeEducator, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, order } = req.body;

    // Check if section exists
    const section = await prisma.section.findUnique({
      where: { id },
      include: {
        course: true
      }
    });

    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    // Check if user is the course creator
    if (section.course.creatorId !== req.user?.id && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update section
    const updatedSection = await prisma.section.update({
      where: { id },
      data: {
        title,
        order
      }
    });

    res.status(200).json({
      message: 'Section updated successfully',
      section: updatedSection
    });
  } catch (error) {
    next(error);
  }
});

// Delete a section
router.delete('/sections/:id', authenticate, authorizeEducator, async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if section exists
    const section = await prisma.section.findUnique({
      where: { id },
      include: {
        course: true
      }
    });

    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    // Check if user is the course creator
    if (section.course.creatorId !== req.user?.id && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Delete section (cascades to lessons)
    await prisma.section.delete({
      where: { id }
    });

    res.status(200).json({ message: 'Section deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Create a new lesson
router.post('/', authenticate, authorizeEducator, async (req, res, next) => {
  try {
    const { sectionId, title, description, videoUrl, duration, order } = req.body;

    // Validate input
    if (!sectionId || !title) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    // Check if section exists and user is the course creator
    const section = await prisma.section.findUnique({
      where: { id: sectionId },
      include: {
        course: true
      }
    });

    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    if (section.course.creatorId !== req.user?.id && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get max order if not provided
    let lessonOrder = order;
    if (!lessonOrder) {
      const maxOrderLesson = await prisma.lesson.findFirst({
        where: { sectionId },
        orderBy: { order: 'desc' }
      });
      lessonOrder = maxOrderLesson ? maxOrderLesson.order + 1 : 1;
    }

    // Create lesson
    const lesson = await prisma.lesson.create({
      data: {
        title,
        description,
        videoUrl,
        duration,
        order: lessonOrder,
        section: {
          connect: { id: sectionId }
        }
      }
    });

    res.status(201).json({
      message: 'Lesson created successfully',
      lesson
    });
  } catch (error) {
    next(error);
  }
});

// Update a lesson
router.put('/:id', authenticate, authorizeEducator, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, videoUrl, duration, order } = req.body;

    // Check if lesson exists
    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        section: {
          include: {
            course: true
          }
        }
      }
    });

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Check if user is the course creator
    if (lesson.section.course.creatorId !== req.user?.id && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update lesson
    const updatedLesson = await prisma.lesson.update({
      where: { id },
      data: {
        title,
        description,
        videoUrl,
        duration,
        order
      }
    });

    res.status(200).json({
      message: 'Lesson updated successfully',
      lesson: updatedLesson
    });
  } catch (error) {
    next(error);
  }
});

// Delete a lesson
router.delete('/:id', authenticate, authorizeEducator, async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if lesson exists
    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        section: {
          include: {
            course: true
          }
        }
      }
    });

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Check if user is the course creator
    if (lesson.section.course.creatorId !== req.user?.id && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Delete lesson
    await prisma.lesson.delete({
      where: { id }
    });

    res.status(200).json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Get a specific lesson (for enrolled students)
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    // Get lesson with course info
    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        section: {
          include: {
            course: true
          }
        }
      }
    });

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Check if user is enrolled in the course or is the creator
    const courseId = lesson.section.courseId;
    const isCreator = lesson.section.course.creatorId === userId;

    if (!isCreator && req.user?.role !== 'ADMIN') {
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: userId!,
            courseId
          }
        }
      });

      if (!enrollment) {
        return res.status(403).json({ message: 'Access denied. You must be enrolled in this course.' });
      }
    }

    // Get user progress for this lesson
    const progress = await prisma.lessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId: userId!,
          lessonId: id
        }
      }
    });

    // If no progress record exists, create one
    if (!progress) {
      await prisma.lessonProgress.create({
        data: {
          user: {
            connect: { id: userId }
          },
          lesson: {
            connect: { id }
          },
          completed: false
        }
      });
    }

    res.status(200).json({
      lesson,
      progress: progress || { completed: false }
    });
  } catch (error) {
    next(error);
  }
});

// Mark lesson as completed
router.post('/:id/complete', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    // Check if lesson exists
    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        section: true
      }
    });

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    // Check if user is enrolled in the course
    const courseId = lesson.section.courseId;
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: userId!,
          courseId
        }
      }
    });

    if (!enrollment) {
      return res.status(403).json({ message: 'Access denied. You must be enrolled in this course.' });
    }

    // Update or create progress record
    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: userId!,
          lessonId: id
        }
      },
      update: {
        completed: true,
        completedAt: new Date()
      },
      create: {
        user: {
          connect: { id: userId }
        },
        lesson: {
          connect: { id }
        },
        completed: true,
        completedAt: new Date()
      }
    });

    res.status(200).json({
      message: 'Lesson marked as completed',
      progress
    });
  } catch (error) {
    next(error);
  }
});

export default router;
