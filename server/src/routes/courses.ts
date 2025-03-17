import express from "express";
import { prisma } from "../index";
import { authenticate, authorizeEducator } from "../middleware/auth";
import { CourseStatus } from "@prisma/client";
import {
  CreateACourse,
  DeleteACourse,
  GetAllCourses,
  GetCourseById,
  GetCoursesByEducator,
  UpdateACourse,
} from "../controllers/courseControllers";

const router = express.Router();

// Get all published courses
router.get("/", (req, res, next) => {
  GetAllCourses(req, res, next);
});

// Get course by ID
router.get("/:id", (req, res, next) => {
  GetCourseById(req, res, (err) => {
    if (err) return next(err);
  });
});

// Create a new course
router.post("/", (req, res, next) => {
  authenticate(req, res, (err) => {
    if (err) return next(err);
    authorizeEducator(req, res, (err) => {
      if (err) return next(err);
      CreateACourse(req, res, (err) => {
        if (err) return next(err);
      });
    });
  });
});

// Update a course
router.put("/:id", (req, res, next) => {
  authenticate(req, res, (err) => {
    if (err) return next(err);
    authorizeEducator(req, res, (err) => {
      if (err) return next(err);
      UpdateACourse(req, res, (err) => {
        if (err) return next(err);
      });
    });
  });
});

// Delete a course
router.delete("/:id", (req, res, next) => {
  authenticate(req, res, (err) => {
    if (err) return next(err);
    authorizeEducator(req, res, (err) => {
      if (err) return next(err);
      DeleteACourse(req, res, (err) => {
        if (err) return next(err);
      });
    });
  });
});

// Get courses created by the authenticated educator
router.get("/educator/my-courses", (req, res, next) => {
  authenticate(req, res, (err) => {
    if (err) return next(err);
    authorizeEducator(req, res, (err) => {
      if (err) return next(err);
      GetCoursesByEducator(req, res, (err) => {
        if (err) return next(err);
      });
    });
  });
});

export default router;
