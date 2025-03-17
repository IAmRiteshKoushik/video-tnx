import type { Request, NextFunction, Response } from "express";
import { prisma } from "..";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const HandleLogin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" },
    );

    const { password: _, ...userData } = user;
    res.status(200).json({
      message: "Login successful",
      user: userData,
      token,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const FetchMyDetails = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.body.user?.id },
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

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};
