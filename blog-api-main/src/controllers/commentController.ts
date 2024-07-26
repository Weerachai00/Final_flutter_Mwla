import { Request, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Comment from "../models/Comment";
import Post from "../models/Post";
import logger from "../utils/logger";

export const createComment = async (req: AuthRequest, res: Response) => {
  try {
    const { content, postId } = req.body;
    const userId = req.userId;

    // Check if the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = new Comment({
      content,
      post: postId,
      author: userId,
      isApproved: false, // By default, comments are not approved
    });

    await comment.save();
    logger.info(`Comment created for post: ${postId}`);
    res.status(201).json(comment);
  } catch (error) {
    logger.error("Error creating comment", { error });
    res.status(500).json({ message: "Error creating comment", error });
  }
};

export const getComments = async (req: Request, res: Response) => {
  try {
    const { postId } = req.query;
    let query = {};
    if (postId) {
      query = { post: postId };
    }
    const comments = await Comment.find(query)
      .populate("author", "username")
      .populate("post", "title");
    res.json(comments);
  } catch (error) {
    logger.error("Error fetching comments", { error });
    res.status(500).json({ message: "Error fetching comments", error });
  }
};

export const getComment = async (req: Request, res: Response) => {
  try {
    const comment = await Comment.findById(req.params.id)
      .populate("author", "username")
      .populate("post", "title");
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.json(comment);
  } catch (error) {
    logger.error("Error fetching comment", { error });
    res.status(500).json({ message: "Error fetching comment", error });
  }
};

export const updateComment = async (req: AuthRequest, res: Response) => {
  try {
    const { content } = req.body;
    const comment = await Comment.findOne({
      _id: req.params.id,
      author: req.userId,
    });

    if (!comment) {
      return res.status(404).json({
        message:
          "Comment not found or you are not authorized to edit this comment",
      });
    }

    comment.content = content;
    comment.isApproved = false; // Reset approval status on edit
    await comment.save();

    logger.info(`Comment updated: ${comment._id}`);
    res.json(comment);
  } catch (error) {
    logger.error("Error updating comment", { error });
    res.status(500).json({ message: "Error updating comment", error });
  }
};

export const deleteComment = async (req: AuthRequest, res: Response) => {
  try {
    const comment = await Comment.findOneAndDelete({
      _id: req.params.id,
      author: req.userId,
    });
    if (!comment) {
      return res.status(404).json({
        message:
          "Comment not found or you are not authorized to delete this comment",
      });
    }
    logger.info(`Comment deleted: ${comment._id}`);
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    logger.error("Error deleting comment", { error });
    res.status(500).json({ message: "Error deleting comment", error });
  }
};

export const approveComment = async (req: AuthRequest, res: Response) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    comment.isApproved = true;
    await comment.save();

    logger.info(`Comment approved: ${comment._id}`);
    res.json({ message: "Comment approved successfully", comment });
  } catch (error) {
    logger.error("Error approving comment", { error });
    res.status(500).json({ message: "Error approving comment", error });
  }
};
