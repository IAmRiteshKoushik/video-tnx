import express from "express";
import { authenticate, authorizeAdmin } from "../middleware/auth";
import { getUserById, updateUserById } from "../controllers/userControllers";

const router = express.Router();

// Get user by ID
router.get("/:id", (req, res, next) => {
  authenticate(req, res, (err) => {
    if (err) return next(err);
    getUserById(req, res, next);
  });
});

// Update user
router.put("/:id", (req, res, next) => {
  authenticate(req, res, (err) => {
    if (err) return next(err);
    updateUserById(req, res, next);
  });
});

export default router;
