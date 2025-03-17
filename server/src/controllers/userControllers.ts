import type { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "..";

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    // Only allow users to view their own profile or admins to view any profile
    if (req.body.user?.id !== id && req.body.user?.role !== "ADMIN") {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        bio: true,
        profileImage: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            createdCourses: true,
            enrollments: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

export const updateUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      bio,
      profileImage,
      currentPassword,
      newPassword,
    } = req.body;

    if (req.body.user?.id !== id) {
      return res.status(403).json({ message: "Access denied" });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const updateData: Partial<{
      firstName: string;
      lastName: string;
      bio: string | null;
      profileImage: string;
      password: string;
    }> = {};

    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (bio !== undefined) updateData.bio = bio;
    if (profileImage) updateData.profileImage = profileImage;

    if (newPassword && currentPassword) {
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        currentUser.password,
      );

      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ message: "Current password is incorrect" });
      }
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(newPassword, salt);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        bio: true,
        profileImage: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};
