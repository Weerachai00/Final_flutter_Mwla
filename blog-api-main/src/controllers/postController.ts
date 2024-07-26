import { Request, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Category from "../models/Category";
import Post from "../models/Post";
import Tag from "../models/Tag";

export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, slug } = req.body;
    const post = new Post({
      title,
      slug,
      content,
      thumbnail: req.body.thumbnail,
      author: req.userId,
    });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: "Error creating post", error });
  }
};

export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find().populate("author", "username");
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error });
  }
};

export const getPost = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "username"
    );
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Error fetching post", error });
  }
};

export const updatePost = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content } = req.body;
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, author: req.userId },
      { title, content },
      { new: true }
    );
    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found or unauthorized" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Error updating post", error });
  }
};

export const deletePost = async (req: AuthRequest, res: Response) => {
  try {
    console.log(req.userId);
    console.log(req.params.id);
    const post = await Post.findOneAndDelete({
      _id: req.params.id,
      author: req.userId,
    });
    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found or unauthorized" });
    }
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting post", error });
  }
};

export const getPostsByCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    const posts = await Post.find({ categories: category._id })
      .populate("author", "username")
      .populate("categories", "name")
      .sort("-createdAt");
    res.json(posts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching posts by category", error });
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
    res.status(500).json({ message: "Error fetching posts by tag", error });
  }
};

export const searchPosts = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Missing search query" });
    }
    const posts = await Post.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
      ],
    })
      .populate("author", "username")
      .populate("categories", "name")
      .sort("-createdAt");
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error searching posts", error });
  }
};

export const togglePostPublish = async (req: AuthRequest, res: Response) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, author: req.userId });
    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found or unauthorized" });
    }
    const updatedPost = await Post.findOneAndUpdate(
      { _id: req.params.id, author: req.userId },
      { isPublished: !post.isPublished },
      { new: true }
    );
    res.json({
      message: "Post publish status toggled",
      isPublished: updatedPost?.isPublished,
    });
  } catch (error) {
    res.status(500).json({ message: "Error toggling post publish", error });
  }
};
