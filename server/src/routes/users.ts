import express from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../index';
import { authenticate, authorizeAdmin } from '../middleware/auth';

const router = express.Router();

// Get all users (admin only)
router.get('/', authenticate, authorizeAdmin, async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
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
            enrollments: true
          }
        }
      }
    });

    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
});

// Get user by ID
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;

    // Only allow users to view their own profile or admins to view any profile
    if (req.user?.id !== id && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied' });
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
            enrollments: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
});

// Update user
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, bio, profileImage, currentPassword, newPassword } = req.body;

    // Only allow users to update their own profile
    if (req.user?.id !== id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get current user data
    const currentUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prepare update data
    const updateData: any = {};

    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (bio !== undefined) updateData.bio = bio;
    if (profileImage) updateData.profileImage = profileImage;

    // Handle password change if requested
    if (newPassword && currentPassword) {
      // Verify current password
      const isPasswordValid = await bcrypt.compare(currentPassword, currentUser.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(newPassword, salt);
    }

    // Update user
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
        updatedAt: true
      }
    });

    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    next(error);
  }
});

// Delete user
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;

    // Only allow users to delete their own account or admins to delete any account
    if (req.user?.id !== id && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete user
    await prisma.user.delete({
      where: { id }
    });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
