import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';
import { UserRole } from '@prisma/client';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: UserRole;
      };
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      email: string;
      role: UserRole;
    };

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Add user to request object
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const authorizeEducator = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== UserRole.EDUCATOR && req.user.role !== UserRole.ADMIN) {
    return res.status(403).json({ message: 'Access denied. Educator role required.' });
  }
  next();
};

export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== UserRole.ADMIN) {
    return res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
  next();
};
