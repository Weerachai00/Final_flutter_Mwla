import { Request, Response } from "express";
import Page, { IPage } from "../models/Page";
import logger from "../utils/logger";

export const createPage = async (req: Request, res: Response) => {
  try {
    const { title, slug, content, isPublished } = req.body;
    const page = new Page({
      title,
      slug,
      content,
      isPublished: isPublished || false,
      thumbnail: req.body.thumbnail,
    });

    await page.save();
    logger.info(`Page created: ${title}`);
    res.status(201).json(page);
  } catch (error) {
    logger.error("Error creating page", { error });
    res.status(500).json({ message: "Error creating page", error });
  }
};

export const getPages = async (req: Request, res: Response) => {
  try {
    const { isPublished } = req.query;
    let query = {};
    if (isPublished !== undefined) {
      query = { isPublished: isPublished === "true" };
    }
    const pages = await Page.find(query).sort("-createdAt");
    res.json(pages);
  } catch (error) {
    logger.error("Error fetching pages", { error });
    res.status(500).json({ message: "Error fetching pages", error });
  }
};

export const getPage = async (req: Request, res: Response) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }
    res.json(page);
  } catch (error) {
    logger.error("Error fetching page", { error });
    res.status(500).json({ message: "Error fetching page", error });
  }
};

export const updatePage = async (req: Request, res: Response) => {
  try {
    const { title, content, isPublished } = req.body;
    const updateData: Partial<IPage> = { title, content, isPublished };

    if (req.body.thumbnail) {
      updateData.thumbnail = req.body.thumbnail;
    }

    const page = await Page.findOneAndUpdate(
      { _id: req.params.id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    logger.info(`Page updated: ${page.title}`);
    res.json(page);
  } catch (error) {
    logger.error("Error updating page", { error });
    res.status(500).json({ message: "Error updating page", error });
  }
};

export const deletePage = async (req: Request, res: Response) => {
  try {
    const page = await Page.findOneAndDelete({ _id: req.params.id });
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }
    logger.info(`Page deleted: ${page.title}`);
    res.json({ message: "Page deleted successfully" });
  } catch (error) {
    logger.error("Error deleting page", { error });
    res.status(500).json({ message: "Error deleting page", error });
  }
};

export const searchPages = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const pages = await Page.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
      ],
      isPublished: true,
    }).sort("-createdAt");

    res.json(pages);
  } catch (error) {
    logger.error("Error searching pages", { error });
    res.status(500).json({ message: "Error searching pages", error });
  }
};

export const togglePagePublish = async (req: Request, res: Response) => {
  try {
    const page = await Page.findById(req.params.id);
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }

    page.isPublished = !page.isPublished;
    await page.save();

    logger.info(`Page publish status toggled: ${page.title}`);
    res.json({
      message: "Page publish status updated",
      isPublished: page.isPublished,
    });
  } catch (error) {
    logger.error("Error toggling page publish status", { error });
    res
      .status(500)
      .json({ message: "Error toggling page publish status", error });
  }
};
