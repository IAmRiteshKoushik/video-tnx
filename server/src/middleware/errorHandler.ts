import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  // Handle Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({
        message: 'A resource with this unique constraint already exists',
        error: err.message
      });
    }
    if (err.code === 'P2025') {
      return res.status(404).json({
        message: 'Record not found',
        error: err.message
      });
    }
    return res.status(400).json({
      message: 'Database error',
      error: err.message
    });
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation error',
      error: err.message
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      message: 'Invalid or expired token',
      error: err.message
    });
  }

  // Default error handler
  return res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
};
