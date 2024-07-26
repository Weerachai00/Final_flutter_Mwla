import { NextFunction, Request, Response } from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import sharp from "sharp";
import config from "../config/config";

if (!fs.existsSync(config.uploadDir)) {
  fs.mkdirSync(config.uploadDir, { recursive: true });
}

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const uploadFile = (fieldName: string) => upload.single(fieldName);

export const processImage =
  (width: number, height: number) =>
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      return next();
    }

    const filename =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + ".webp";
    const filepath = path.join(config.uploadDir, filename);

    console.log("Upload directory:", config.uploadDir);
    console.log("Saving file to:", filepath);

    try {
      await sharp(req.file.buffer)
        .resize(width, height, {
          fit: sharp.fit.cover,
          position: sharp.strategy.entropy,
        })
        .webp({ quality: 90 })
        .toFile(filepath);

      req.body[req.file.fieldname] = "/uploads/" + filename;
      next();
    } catch (error) {
      next(error);
    }
  };

export const uploadAndProcessImage = (
  fieldName: string,
  width: number,
  height: number
) => [uploadFile(fieldName), processImage(width, height)];
