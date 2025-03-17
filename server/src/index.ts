import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import courseRoutes from "./routes/courses";
import enrollmentRoutes from "./routes/enrollments";
import lessonRoutes from "./routes/lessons";
import { errorHandler } from "./middleware/errorHandler";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

export const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/lessons", lessonRoutes);

app.use((err: Error, req: express.Request, res: express.Response) => {
  errorHandler(err, req, res);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("Disconnected from database");
  process.exit(0);
});
