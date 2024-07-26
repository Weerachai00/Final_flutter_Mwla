import { Request, Response } from "express";
import Banner, { IBanner } from "../models/Banner";
import logger from "../utils/logger";

export const createBanner = async (req: Request, res: Response) => {
  try {
    const { title, link, isActive } = req.body;
    const imageUrl = req.body.imageUrl; // This will be set by the upload middleware

    if (!imageUrl) {
      return res.status(400).json({ message: "Image is required for banner" });
    }

    const banner = new Banner({
      title,
      imageUrl,
      link,
      isActive: isActive !== undefined ? isActive : true,
    });

    await banner.save();
    logger.info(`Banner created: ${title}`);
    res.status(201).json(banner);
  } catch (error) {
    logger.error("Error creating banner", { error });
    res.status(500).json({ message: "Error creating banner", error });
  }
};

export const getBanners = async (req: Request, res: Response) => {
  try {
    const banners = await Banner.find();
    res.json(banners);
  } catch (error) {
    logger.error("Error fetching banners", { error });
    res.status(500).json({ message: "Error fetching banners", error });
  }
};

export const getBanner = async (req: Request, res: Response) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }
    res.json(banner);
  } catch (error) {
    logger.error("Error fetching banner", { error });
    res.status(500).json({ message: "Error fetching banner", error });
  }
};

export const updateBanner = async (req: Request, res: Response) => {
  try {
    const { title, link, isActive } = req.body;
    const imageUrl = req.body.imageUrl; // This will be set by the upload middleware if a new image is uploaded

    const updateData: Partial<IBanner> = { title, link, isActive };
    if (imageUrl) {
      updateData.imageUrl = imageUrl;
    }

    const banner = await Banner.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    logger.info(`Banner updated: ${banner.title}`);
    res.json(banner);
  } catch (error) {
    logger.error("Error updating banner", { error });
    res.status(500).json({ message: "Error updating banner", error });
  }
};

export const deleteBanner = async (req: Request, res: Response) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }
    logger.info(`Banner deleted: ${banner.title}`);
    res.json({ message: "Banner deleted successfully" });
  } catch (error) {
    logger.error("Error deleting banner", { error });
    res.status(500).json({ message: "Error deleting banner", error });
  }
};
