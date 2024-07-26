import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import config from "./config/config";
import { connectDB } from "./config/database";
import swaggerSpec from "./config/swagger";
import authRoutes from "./routes/authRoutes";
import bannerRoutes from "./routes/bannerRoutes";
import categoryRoute from "./routes/categoryRoutes";
import commentRoutes from "./routes/commentRoutes";
import menuRoutes from "./routes/menuRoutes";
import pageRoutes from "./routes/pageRoutes";
import postRoutes from "./routes/postRoutes";
import tagRoutes from "./routes/tagRoutes";
import userRoutes from "./routes/userRoutes";
import logger from "./utils/logger";

const app = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Serve static files
app.use(express.static("public"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/pages", pageRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/menus", menuRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/categories", categoryRoute);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.stack);
  res.status(500).send("Something broke!");
});

// Connect to MongoDB
connectDB();

// Start server
app.listen(config.port, () => {
  logger.info(`Server is running on port ${config.port}`);
  logger.info(
    `Swagger docs available at http://localhost:${config.port}/api-docs`
  );
});
