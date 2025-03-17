import express from "express";
import { prisma } from "../index";
import { authenticate } from "../middleware/auth";
import {
  EnrollInACourse,
  FetchUserEnrolledCourse,
  GetEnrolledStudents,
  UnenrollACourse,
} from "../controllers/enrollmentControllers";

const router = express.Router();

// Enroll in a course
router.post("/:courseId", (req, res, next) => {
  authenticate(req, res, (err) => {
    if (err) return next(err);
    EnrollInACourse(req, res, next);
  });
});

// Get user's enrolled courses
router.get("/my-courses", (req, res, next) => {
  authenticate(req, res, (err) => {
    if (err) return next(err);
    FetchUserEnrolledCourse(req, res, next);
  });
});

// Unenroll from a course
router.delete("/:courseId", (req, res, next) => {
  authenticate(req, res, (err) => {
    if (err) return next(err);
    UnenrollACourse(req, res, next);
  });
});

// Get students enrolled in a course (for educators)
router.get("/course/:courseId/students", (req, res, next) => {
  authenticate(req, res, (err) => {
    if (err) return next(err);
    GetEnrolledStudents(req, res, next);
  });
});

export default router;
