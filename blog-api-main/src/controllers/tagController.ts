import { Request, Response } from "express";
import Post from "../models/Post";
import Tag from "../models/Tag";
import logger from "../utils/logger";

export const createTag = async (req: Request, res: Response) => {
  try {
    const { name, slug } = req.body;
    const tag = new Tag({ name, slug });
    await tag.save();
    logger.info(`Tag created: ${name}`);
    res.status(201).json(tag);
  } catch (error) {
    logger.error("Error creating tag", { error });
    res.status(500).json({ message: "Error creating tag", error });
  }
};

export const getTags = async (req: Request, res: Response) => {
  try {
    const tags = await Tag.find().sort("name");
    res.json(tags);
  } catch (error) {
    logger.error("Error fetching tags", { error });
    res.status(500).json({ message: "Error fetching tags", error });
  }
};

export const getTag = async (req: Request, res: Response) => {
  try {
    const tag = await Tag.findOne({ slug: req.params.slug });
    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }
    res.json(tag);
  } catch (error) {
    logger.error("Error fetching tag", { error });
    res.status(500).json({ message: "Error fetching tag", error });
  }
};

export const updateTag = async (req: Request, res: Response) => {
  try {
    const { name, slug } = req.body;
    const tag = await Tag.findOneAndUpdate(
      { slug: req.params.slug },
      { name, slug },
      { new: true, runValidators: true }
    );
    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }
    logger.info(`Tag updated: ${tag.name}`);
    res.json(tag);
  } catch (error) {
    logger.error("Error updating tag", { error });
    res.status(500).json({ message: "Error updating tag", error });
  }
};

export const deleteTag = async (req: Request, res: Response) => {
  try {
    const tag = await Tag.findOneAndDelete({ slug: req.params.slug });
    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }
    logger.info(`Tag deleted: ${tag.name}`);
    res.json({ message: "Tag deleted successfully" });
  } catch (error) {
    logger.error("Error deleting tag", { error });
    res.status(500).json({ message: "Error deleting tag", error });
  }
};

export const searchTags = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }
    const tags = await Tag.find({
      name: { $regex: query, $options: "i" },
    }).sort("name");
    res.json(tags);
  } catch (error) {
    logger.error("Error searching tags", { error });
    res.status(500).json({ message: "Error searching tags", error });
  }
};

export const getPostsByTag = async (req: Request, res: Response) => {
  try {
    const tag = await Tag.findOne({ slug: req.params.slug });
    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }
    const posts = await Post.find({ tags: tag._id })
      .populate("author", "username")
      .populate("categories", "name")
      .sort("-createdAt");
    res.json(posts);
  } catch (error) {
    logger.error("Error fetching posts by tag", { error });
    res.status(500).json({ message: "Error fetching posts by tag", error });
  }
};

export const getPopularTags = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const popularTags = await Post.aggregate([
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "tags",
          localField: "_id",
          foreignField: "_id",
          as: "tagInfo",
        },
      },
      { $unwind: "$tagInfo" },
      {
        $project: {
          _id: "$tagInfo._id",
          name: "$tagInfo.name",
          slug: "$tagInfo.slug",
          count: 1,
        },
      },
    ]);
    res.json(popularTags);
  } catch (error) {
    logger.error("Error fetching popular tags", { error });
    res.status(500).json({ message: "Error fetching popular tags", error });
  }
};
