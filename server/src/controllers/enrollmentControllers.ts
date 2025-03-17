import type { Request, Response, NextFunction } from "express";
import { prisma } from "..";
import * as client from "@prisma/client";

export const EnrollInACourse = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { courseId } = req.params;
    const userId = req.body.user?.id;

    // Check if course exists and is published
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
        status: client.CourseStatus.PUBLISHED,
      },
    });

    if (!course) {
      return res
        .status(404)
        .json({ message: "Course not found or not available for enrollment" });
    }

    // Check if user is already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: userId!,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      return res
        .status(409)
        .json({ message: "Already enrolled in this course" });
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        user: {
          connect: { id: userId },
        },
        course: {
          connect: { id: courseId },
        },
      },
    });

    res.status(201).json({
      message: "Successfully enrolled in course",
      enrollment,
    });
  } catch (error) {
    next(error);
  }
};

export const FetchUserEnrolledCourse = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.body.user?.id;

    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId: userId!,
      },
      include: {
        course: {
          include: {
            creator: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
            sections: {
              include: {
                lessons: {
                  select: {
                    id: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Get progress for each course
    const enrolledCourses = await Promise.all(
      enrollments.map(async (enrollment) => {
        // Count total lessons in the course
        const totalLessons = enrollment.course.sections.reduce(
          (total, section) => total + section.lessons.length,
          0,
        );

        // Get all lesson IDs for this course
        const lessonIds = enrollment.course.sections.flatMap((section) =>
          section.lessons.map((lesson) => lesson.id),
        );

        // Count completed lessons
        const completedLessons = await prisma.lessonProgress.count({
          where: {
            userId: userId!,
            lessonId: {
              in: lessonIds,
            },
            completed: true,
          },
        });

        // Calculate progress percentage
        const progressPercentage =
          totalLessons > 0
            ? Math.round((completedLessons / totalLessons) * 100)
            : 0;

        // Get the last accessed lesson
        const lastProgress = await prisma.lessonProgress.findFirst({
          where: {
            userId: userId!,
            lessonId: {
              in: lessonIds,
            },
          },
          orderBy: {
            updatedAt: "desc",
          },
          include: {
            lesson: true,
          },
        });

        return {
          id: enrollment.id,
          enrolledAt: enrollment.enrolledAt,
          course: enrollment.course,
          progress: progressPercentage,
          lastWatched: lastProgress?.lesson || null,
        };
      }),
    );

    res.status(200).json({ enrolledCourses });
  } catch (error) {
    next(error);
  }
};

export const UnenrollACourse = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { courseId } = req.params;
    const userId = req.body.user?.id;

    // Check if enrollment exists
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: userId!,
          courseId,
        },
      },
    });

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    // Delete enrollment
    await prisma.enrollment.delete({
      where: {
        userId_courseId: {
          userId: userId!,
          courseId,
        },
      },
    });

    // Also delete all progress records for this course
    const lessonIds = await prisma.lesson.findMany({
      where: {
        section: {
          courseId,
        },
      },
      select: {
        id: true,
      },
    });

    await prisma.lessonProgress.deleteMany({
      where: {
        userId: userId!,
        lessonId: {
          in: lessonIds.map((lesson) => lesson.id),
        },
      },
    });

    res.status(200).json({ message: "Successfully unenrolled from course" });
  } catch (error) {
    next(error);
  }
};

export const GetEnrolledStudents = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { courseId } = req.params;

    // Check if course exists and user is the creator
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Only allow the creator or admin to view enrollments
    if (
      course.creatorId !== req.body.user?.id &&
      req.body.user?.role !== "ADMIN"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Get enrollments with student data
    const enrollments = await prisma.enrollment.findMany({
      where: {
        courseId,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profileImage: true,
          },
        },
      },
      orderBy: {
        enrolledAt: "desc",
      },
    });

    res.status(200).json({ enrollments });
  } catch (error) {
    next(error);
  }
};
