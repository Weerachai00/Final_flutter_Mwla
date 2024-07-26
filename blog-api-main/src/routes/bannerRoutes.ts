import express from "express";
import {
  createBanner,
  deleteBanner,
  getBanner,
  getBanners,
  updateBanner,
} from "../controllers/bannerController";
import { auth } from "../middleware/authMiddleware";
import { isAdmin } from "../middleware/roleMiddleware";
import { uploadAndProcessImage } from "../middleware/uploadMiddleware";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Banner:
 *       type: object
 *       required:
 *         - title
 *         - imageUrl
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the banner
 *         title:
 *           type: string
 *           description: The banner title
 *         imageUrl:
 *           type: string
 *           description: The URL of the banner image
 *         link:
 *           type: string
 *           description: The link associated with the banner (optional)
 *         isActive:
 *           type: boolean
 *           description: Whether the banner is active or not
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date the banner was created
 *         updatedAt:
 *           type: string
 *           format: date
 *           description: The date the banner was last updated
 */

/**
 * @swagger
 * tags:
 *   name: Banners
 *   description: Banner management API
 */

/**
 * @swagger
 * /api/banners:
 *   post:
 *     summary: Create a new banner
 *     tags: [Banners]
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
 *               - imageUrl
 *             properties:
 *               title:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *                 format: binary
 *               link:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: The banner was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Banner'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post(
  "/",
  auth,
  isAdmin,
  uploadAndProcessImage("imageUrl", 1200, 400),
  createBanner
);

/**
 * @swagger
 * /api/banners:
 *   get:
 *     summary: Retrieve a list of banners
 *     tags: [Banners]
 *     responses:
 *       200:
 *         description: A list of banners
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Banner'
 *       500:
 *         description: Server error
 */
router.get("/", getBanners);

/**
 * @swagger
 * /api/banners/{id}:
 *   get:
 *     summary: Get a banner by id
 *     tags: [Banners]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The banner id
 *     responses:
 *       200:
 *         description: The banner description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Banner'
 *       404:
 *         description: The banner was not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getBanner);

/**
 * @swagger
 * /api/banners/{id}:
 *   put:
 *     summary: Update a banner
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The banner id
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *                 format: binary
 *               link:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: The banner was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Banner'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: The banner was not found
 *       500:
 *         description: Server error
 */
router.put(
  "/:id",
  auth,
  isAdmin,
  uploadAndProcessImage("imageUrl", 1200, 400),
  updateBanner
);

/**
 * @swagger
 * /api/banners/{id}:
 *   delete:
 *     summary: Delete a banner
 *     tags: [Banners]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The banner id
 *     responses:
 *       200:
 *         description: The banner was deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: The banner was not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", auth, isAdmin, deleteBanner);

export default router;
