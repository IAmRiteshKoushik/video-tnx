import express from "express";
import { authenticate, authorizeEducator } from "../middleware/auth";
import {
  CreateNewLesson,
  CreateNewSection,
  DeleteALesson,
  DeleteSection,
  FetchEnrolledLesson,
  MarkLessonAsCompleted,
  UpdateALesson,
  UpdateSection,
} from "../controllers/lessonControllers";

const router = express.Router();

// Create a new section
router.post("/sections", (req, res, next) => {
  authenticate(req, res, (err) => {
    if (err) return next(err);
    authorizeEducator(req, res, (err) => {
      if (err) return next(err);
      CreateNewSection(req, res, next);
    });
  });
});

// Update a section
router.put("/sections/:id", (req, res, next) => {
  authenticate(req, res, (err) => {
    if (err) return next(err);
    authorizeEducator(req, res, (err) => {
      if (err) return next(err);
      UpdateSection(req, res, next);
    });
  });
});

// Delete a section
router.delete("/sections/:id", (req, res, next) => {
  authenticate(req, res, (err) => {
    if (err) return next(err);
    authorizeEducator(req, res, (err) => {
      if (err) return next(err);
      DeleteSection(req, res, next);
    });
  });
});

// Create a new lesson
router.post("/", (req, res, next) => {
  authenticate(req, res, (err) => {
    if (err) return next(err);
    authorizeEducator(req, res, (err) => {
      if (err) return next(err);
      CreateNewLesson(req, res, next);
    });
  });
});

// Update a lesson
router.put("/:id", (req, res, next) => {
  authenticate(req, res, (err) => {
    if (err) return next(err);
    authorizeEducator(req, res, (err) => {
      if (err) return next(err);
      UpdateALesson(req, res, next);
    });
  });
});

// Delete a lesson
router.delete("/:id", (req, res, next) => {
  authenticate(req, res, (err) => {
    if (err) return next(err);
    authorizeEducator(req, res, (err) => {
      if (err) return next(err);
      DeleteALesson(req, res, next);
    });
  });
});

// Get a specific lesson (for enrolled students)
router.get("/:id", (req, res, next) => {
  authenticate(req, res, (err) => {
    if (err) return next(err);
    FetchEnrolledLesson(req, res, next);
  });
});

// Mark lesson as completed
router.post("/:id/complete", (req, res, next) => {
  authenticate(req, res, (err) => {
    if (err) return next(err);
    MarkLessonAsCompleted(req, res, next);
  });
});

export default router;
