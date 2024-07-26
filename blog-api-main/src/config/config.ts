import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../../.env") });

interface Config {
  port: number;
  mongodbUri: string;
  jwtSecret: string;
  nodeEnv: string;
  uploadDir: string;
}

const config: Config = {
  port: parseInt(process.env.PORT || "3000", 10),
  mongodbUri: process.env.MONGODB_URI || "mongodb://localhost:27017/blog_api",
  jwtSecret: process.env.JWT_SECRET || "fallback_jwt_secret",
  nodeEnv: process.env.NODE_ENV || "development",
  uploadDir: process.env.UPLOAD_DIR || path.join(__dirname, "../../uploads"),
};

export default config;
