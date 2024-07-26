import mongoose from "mongoose";
import logger from "../utils/logger";
import config from "./config";

export const connectDB = async () => {
  try {
    await mongoose.connect(config.mongodbUri);
    logger.info("MongoDB connected successfully");
  } catch (error) {
    logger.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
