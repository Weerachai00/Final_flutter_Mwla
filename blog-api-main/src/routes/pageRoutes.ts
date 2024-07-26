import express from "express";
import {
  createPage,
  deletePage,
  getPage,
  getPages,
  searchPages,
  togglePagePublish,
  updatePage,
} from "../controllers/pageController";
import { auth } from "../middleware/authMiddleware";
import { isAdmin } from "../middleware/roleMiddleware";
import { uploadAndProcessImage } from "../middleware/uploadMiddleware";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Page:
 *       type: object
 *       required:
 *         - title
 *         - slug
 *         - content
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the page
 *         title:
 *           type: string
 *           description: The title of the page
 *         slug:
 *           type: string
 *           description: The URL slug for the page
 *         content:
 *           type: string
 *           description: The content of the page
 *         isPublished:
 *           type: boolean
 *           description: Whether the page is published or not
 *         thumbnail:
 *           type: string
 *           description: The URL of the page's thumbnail image
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date the page was created
 *         updatedAt:
 *           type: string
 *           format: date
 *           description: The date the page was last updated
 */

/**
 * @swagger
 * tags:
 *   name: Pages
 *   description: Page management API
 */

/**
 * @swagger
 * /api/pages:
 *   post:
 *     summary: Create a new page
 *     tags: [Pages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - slug
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               slug:
 *                 type: string
 *               content:
 *                 type: string
 *               isPublished:
 *                 type: boolean
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: The page was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Page'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post(
  "/",
  auth,
  isAdmin,
  uploadAndProcessImage("thumbnail", 1200, 630),
  createPage
);

/**
 * @swagger
 * /api/pages:
 *   get:
 *     summary: Retrieve a list of pages
 *     tags: [Pages]
 *     parameters:
 *       - in: query
 *         name: isPublished
 *         schema:
 *           type: boolean
 *         description: Filter pages by published status
 *     responses:
 *       200:
 *         description: A list of pages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Page'
 *       500:
 *         description: Server error
 */
router.get("/", getPages);

/**
 * @swagger
 * /api/pages/{id}:
 *   get:
 *     summary: Get a page by id
 *     tags: [Pages]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The page id
 *     responses:
 *       200:
 *         description: The page details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Page'
 *       404:
 *         description: The page was not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getPage);

/**
 * @swagger
 * /api/pages/{id}:
 *   put:
 *     summary: Update a page
 *     tags: [Pages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The page id
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               isPublished:
 *                 type: boolean
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: The page was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Page'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: The page was not found
 *       500:
 *         description: Server error
 */
router.put(
  "/:id",
  auth,
  isAdmin,
  uploadAndProcessImage("thumbnail", 1200, 630),
  updatePage
);

/**
 * @swagger
 * /api/pages/{id}:
 *   delete:
 *     summary: Delete a page
 *     tags: [Pages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The page id
 *     responses:
 *       200:
 *         description: The page was deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: The page was not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", auth, isAdmin, deletePage);

/**
 * @swagger
 * /api/pages/{id}/toggle-publish:
 *   patch:
 *     summary: Toggle page publish status
 *     tags: [Pages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The page id
 *     responses:
 *       200:
 *         description: The page publish status was toggled
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 isPublished:
 *                   type: boolean
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: The page was not found
 *       500:
 *         description: Server error
 */
router.patch("/:id/toggle-publish", auth, isAdmin, togglePagePublish);

/**
 * @swagger
 * /api/pages/search:
 *   get:
 *     summary: Search pages
 *     tags: [Pages]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: The search query
 *     responses:
 *       200:
 *         description: A list of pages matching the search query
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Page'
 *       400:
 *         description: Missing search query
 *       500:
 *         description: Server error
 */
router.get("/search", searchPages);

export default router;
