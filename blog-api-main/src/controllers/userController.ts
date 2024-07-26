import { Request, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import User from "../models/User";
import logger from "../utils/logger";

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    logger.error("Error fetching user profile", { error });
    res.status(500).json({ message: "Error fetching user profile", error });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    logger.error("Error creating user", { error });
    res.status(500).json({ message: "Error creating user", error });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { username, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { username, email },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    logger.info(`User profile updated: ${user.email}`);
    res.json(user);
  } catch (error) {
    logger.error("Error updating user profile", { error });
    res.status(500).json({ message: "Error updating user profile", error });
  }
};

export const deleteAccount = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    logger.info(`User account deleted: ${user.email}`);
    res.json({ message: "User account deleted successfully" });
  } catch (error) {
    logger.error("Error deleting user account", { error });
    res.status(500).json({ message: "Error deleting user account", error });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    logger.error("Error fetching users", { error });
    res.status(500).json({ message: "Error fetching users", error });
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    logger.info(`User role updated: ${user.email}, New role: ${role}`);
    res.json(user);
  } catch (error) {
    logger.error("Error updating user role", { error });
    res.status(500).json({ message: "Error updating user role", error });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { username, email } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, {
      username,
      email,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    logger.info(`User profile updated: ${user.email}`);
    res.json(user);
  } catch (error) {
    logger.error("Error updating user profile", { error });
    res.status(500).json({ message: "Error updating user profile", error });
  }
};
