import express from "express";
import {
  createTag,
  deleteTag,
  getPopularTags,
  getPostsByTag,
  getTag,
  getTags,
  searchTags,
  updateTag,
} from "../controllers/tagController";
import { auth } from "../middleware/authMiddleware";
import { isAdmin } from "../middleware/roleMiddleware";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Tag:
 *       type: object
 *       required:
 *         - name
 *         - slug
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the tag
 *         name:
 *           type: string
 *           description: The name of the tag
 *         slug:
 *           type: string
 *           description: The URL slug for the tag
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date the tag was created
 *         updatedAt:
 *           type: string
 *           format: date
 *           description: The date the tag was last updated
 */

/**
 * @swagger
 * tags:
 *   name: Tags
 *   description: Tag management API
 */

/**
 * @swagger
 * /api/tags:
 *   post:
 *     summary: Create a new tag
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - slug
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *     responses:
 *       201:
 *         description: The tag was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tag'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/", auth, isAdmin, createTag);

/**
 * @swagger
 * /api/tags:
 *   get:
 *     summary: Retrieve a list of tags
 *     tags: [Tags]
 *     responses:
 *       200:
 *         description: A list of tags
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tag'
 *       500:
 *         description: Server error
 */
router.get("/", getTags);

/**
 * @swagger
 * /api/tags/{slug}:
 *   get:
 *     summary: Get a tag by slug
 *     tags: [Tags]
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *         description: The tag slug
 *     responses:
 *       200:
 *         description: The tag details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tag'
 *       404:
 *         description: The tag was not found
 *       500:
 *         description: Server error
 */
router.get("/:slug", getTag);

/**
 * @swagger
 * /api/tags/{slug}:
 *   put:
 *     summary: Update a tag
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *         description: The tag slug
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *     responses:
 *       200:
 *         description: The tag was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tag'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: The tag was not found
 *       500:
 *         description: Server error
 */
router.put("/:slug", auth, isAdmin, updateTag);

/**
 * @swagger
 * /api/tags/{slug}:
 *   delete:
 *     summary: Delete a tag
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *         description: The tag slug
 *     responses:
 *       200:
 *         description: The tag was deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: The tag was not found
 *       500:
 *         description: Server error
 */
router.delete("/:slug", auth, isAdmin, deleteTag);

/**
 * @swagger
 * /api/tags/search:
 *   get:
 *     summary: Search tags
 *     tags: [Tags]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: The search query
 *     responses:
 *       200:
 *         description: A list of tags matching the search query
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tag'
 *       400:
 *         description: Missing search query
 *       500:
 *         description: Server error
 */
router.get("/search", searchTags);

/**
 * @swagger
 * /api/tags/{slug}/posts:
 *   get:
 *     summary: Get posts by tag
 *     tags: [Tags]
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *         description: The tag slug
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: A list of posts with the specified tag
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 posts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *       404:
 *         description: Tag not found
 *       500:
 *         description: Server error
 */
router.get("/:slug/posts", getPostsByTag);

/**
 * @swagger
 * /api/tags/popular:
 *   get:
 *     summary: Get popular tags
 *     tags: [Tags]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of popular tags to retrieve
 *     responses:
 *       200:
 *         description: A list of popular tags
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   slug:
 *                     type: string
 *                   count:
 *                     type: integer
 *       500:
 *         description: Server error
 */
router.get("/popular", getPopularTags);

export default router;
