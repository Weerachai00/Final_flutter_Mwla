import { NextFunction, Response } from "express";
import User from "../models/User";
import { AuthRequest } from "./authMiddleware";

export const isAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.userId);
    if (user && user.role === "admin") {
      next();
    } else {
      res.status(403).json({ message: "Access denied. Admin role required." });
    }
  } catch (error) {
    res.status(500).json({ message: "Error checking user role", error });
  }
};
