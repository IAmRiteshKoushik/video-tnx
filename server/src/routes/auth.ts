import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../index";
import { authenticate } from "../middleware/auth";
import { FetchMyDetails, HandleLogin } from "../controllers/authControllers";

const authRouter = Router();

// Login user
authRouter.post("/login", (req, res, next) => {
  HandleLogin(req, res, next);
});

// Get current user
authRouter.get("/me", (req, res, next) => {
  authenticate(req, res, (err) => {
    if (err) return next(err);
    FetchMyDetails(req, res, next);
  });
});

export default authRouter;
