import type { Request, Response, NextFunction } from "express";
import { prisma } from "..";
import * as client from "@prisma/client";

export const GetAllCourses = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { category, level, search, page = "1", limit = "10" } = req.query;

    const pageNumber = Number.parseInt(page as string);
    const limitNumber = Number.parseInt(limit as string);
    const skip = (pageNumber - 1) * limitNumber;

    // Build filter conditions
    const where: {
      status: client.CourseStatus;
      category?: string;
      level?: client.CourseLevel | undefined;
      OR?: Array<{
        title?: { contains: string; mode: "insensitive" };
        description?: { contains: string; mode: "insensitive" };
      }>;
    } = {
      status: client.CourseStatus.PUBLISHED,
    };

    if (category) {
      where.category = category as string;
    }

    if (level) {
      where.level = level as client.CourseLevel;
    }

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: "insensitive" } },
        { description: { contains: search as string, mode: "insensitive" } },
      ];
    }

    // Get courses with pagination
    const courses = await prisma.course.findMany({
      where,
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
          },
        },
        _count: {
          select: {
            enrollments: true,
            sections: true,
          },
        },
      },
      skip,
      take: limitNumber,
      orderBy: { createdAt: "desc" },
    });

    // Get total count for pagination
    const totalCourses = await prisma.course.count({ where });

    res.status(200).json({
      courses,
      pagination: {
        total: totalCourses,
        page: pageNumber,
        limit: limitNumber,
        pages: Math.ceil(totalCourses / limitNumber),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const CreateACourse = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title, description, category, level, thumbnail, sections } =
      req.body;

    // Validate input
    if (!title || !description || !category || !level) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // Create course with transaction to ensure all related data is created
    const course = await prisma.$transaction(async (prisma) => {
      // Create the course
      const newCourse = await prisma.course.create({
        data: {
          title,
          description,
          category,
          level,
          thumbnail,
          status: client.CourseStatus.DRAFT,
          creator: {
            connect: { id: req.body.user?.id },
          },
        },
      });

      // Create sections and lessons if provided
      if (sections && Array.isArray(sections) && sections.length > 0) {
        for (let i = 0; i < sections.length; i++) {
          const section = sections[i];

          const newSection = await prisma.section.create({
            data: {
              title: section.title,
              order: i + 1,
              course: {
                connect: { id: newCourse.id },
              },
            },
          });

          // Create lessons for this section if provided
          if (
            section.lessons &&
            Array.isArray(section.lessons) &&
            section.lessons.length > 0
          ) {
            for (let j = 0; j < section.lessons.length; j++) {
              const lesson = section.lessons[j];

              await prisma.lesson.create({
                data: {
                  title: lesson.title,
                  description: lesson.description,
                  videoUrl: lesson.videoUrl,
                  duration: lesson.duration,
                  order: j + 1,
                  section: {
                    connect: { id: newSection.id },
                  },
                },
              });
            }
          }
        }
      }

      return newCourse;
    });

    res.status(201).json({
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    next(error);
  }
};

export const GetCourseById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            bio: true,
            profileImage: true,
          },
        },
        sections: {
          orderBy: { order: "asc" },
          include: {
            lessons: {
              orderBy: { order: "asc" },
              select: {
                id: true,
                title: true,
                description: true,
                duration: true,
                order: true,
              },
            },
          },
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // If course is not published, only allow creator or admin to view it
    if (course.status !== client.CourseStatus.PUBLISHED) {
      // Check if user is authenticated
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({ message: "Access denied" });
      }

      // If user is not the creator, deny access
      if (
        !req.body.user ||
        (req.body.user.id !== course.creatorId &&
          req.body.user.role !== "ADMIN")
      ) {
        return res.status(403).json({ message: "Access denied" });
      }
    }

    res.status(200).json({ course });
  } catch (error) {
    next(error);
  }
};

export const GetCoursesByEducator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { status, page = "1", limit = "10" } = req.query;

    const pageNumber = Number.parseInt(page as string);
    const limitNumber = Number.parseInt(limit as string);
    const skip = (pageNumber - 1) * limitNumber;

    // Build filter conditions
    const where: {
      creatorId: string;
      status?: client.CourseStatus;
    } = {
      creatorId: req.body.user?.id as string,
    };

    if (status) {
      where.status = status as client.CourseStatus;
    }

    // Get courses with pagination
    const courses = await prisma.course.findMany({
      where,
      include: {
        _count: {
          select: {
            enrollments: true,
            sections: true,
          },
        },
      },
      skip,
      take: limitNumber,
      orderBy: { createdAt: "desc" },
    });

    // Get total count for pagination
    const totalCourses = await prisma.course.count({ where });

    res.status(200).json({
      courses,
      pagination: {
        total: totalCourses,
        page: pageNumber,
        limit: limitNumber,
        pages: Math.ceil(totalCourses / limitNumber),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const UpdateACourse = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { title, description, category, level, thumbnail, status } = req.body;

    const course = await prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (
      course.creatorId !== req.body.user?.id &&
      req.body.user?.role !== "ADMIN"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: {
        title,
        description,
        category,
        level,
        thumbnail,
        status: status ? (status as client.CourseStatus) : undefined,
      },
    });

    res.status(200).json({
      message: "Course updated successfully",
      course: updatedCourse,
    });
  } catch (error) {
    next(error);
  }
};

export const DeleteACourse = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const course = await prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (
      course.creatorId !== req.body.user?.id &&
      req.body.user?.role !== "ADMIN"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    await prisma.course.delete({
      where: { id },
    });

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    next(error);
  }
};
