import type express from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../index";
import { UserRole } from "@prisma/client";

export const authenticate = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      email: string;
      role: UserRole;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.body.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const authorizeEducator = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  if (
    !req.body.user ||
    (req.body.user.role !== UserRole.EDUCATOR &&
      req.body.user.role !== UserRole.ADMIN)
  ) {
    return res
      .status(403)
      .json({ message: "Access denied. Educator role required." });
  }
  next();
};

export const authorizeAdmin = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  if (!req.body.user || req.body.user.role !== UserRole.ADMIN) {
    return res
      .status(403)
      .json({ message: "Access denied. Admin role required." });
  }
  next();
};
