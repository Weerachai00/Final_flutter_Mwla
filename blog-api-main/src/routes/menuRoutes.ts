import express from "express";
import {
  createMenuItem,
  deleteMenuItem,
  getMenuItem,
  getMenuItems,
  getMenuStructure,
  reorderMenuItems,
  updateMenuItem,
} from "../controllers/menuController";
import { auth } from "../middleware/authMiddleware";
import { isAdmin } from "../middleware/roleMiddleware";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     MenuItem:
 *       type: object
 *       required:
 *         - title
 *         - url
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the menu item
 *         title:
 *           type: string
 *           description: The title of the menu item
 *         url:
 *           type: string
 *           description: The URL the menu item points to
 *         order:
 *           type: number
 *           description: The order of the menu item
 *         parent:
 *           type: string
 *           description: The id of the parent menu item (if it's a submenu item)
 *         children:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/MenuItem'
 *           description: Submenu items (if any)
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date the menu item was created
 *         updatedAt:
 *           type: string
 *           format: date
 *           description: The date the menu item was last updated
 */

/**
 * @swagger
 * tags:
 *   name: Menu
 *   description: Menu management API
 */

/**
 * @swagger
 * /api/menu:
 *   post:
 *     summary: Create a new menu item
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - url
 *             properties:
 *               title:
 *                 type: string
 *               url:
 *                 type: string
 *               order:
 *                 type: number
 *               parent:
 *                 type: string
 *     responses:
 *       201:
 *         description: The menu item was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuItem'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/", auth, isAdmin, createMenuItem);

/**
 * @swagger
 * /api/menu:
 *   get:
 *     summary: Retrieve a list of menu items
 *     tags: [Menu]
 *     responses:
 *       200:
 *         description: A list of menu items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MenuItem'
 *       500:
 *         description: Server error
 */
router.get("/", getMenuItems);

/**
 * @swagger
 * /api/menu/{id}:
 *   get:
 *     summary: Get a menu item by id
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The menu item id
 *     responses:
 *       200:
 *         description: The menu item description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuItem'
 *       404:
 *         description: The menu item was not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getMenuItem);

/**
 * @swagger
 * /api/menu/{id}:
 *   put:
 *     summary: Update a menu item
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The menu item id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               url:
 *                 type: string
 *               order:
 *                 type: number
 *               parent:
 *                 type: string
 *     responses:
 *       200:
 *         description: The menu item was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuItem'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: The menu item was not found
 *       500:
 *         description: Server error
 */
router.put("/:id", auth, isAdmin, updateMenuItem);

/**
 * @swagger
 * /api/menu/{id}:
 *   delete:
 *     summary: Delete a menu item
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The menu item id
 *     responses:
 *       200:
 *         description: The menu item was deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: The menu item was not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", auth, isAdmin, deleteMenuItem);

/**
 * @swagger
 * /api/menu/reorder:
 *   post:
 *     summary: Reorder menu items
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     order:
 *                       type: number
 *     responses:
 *       200:
 *         description: Menu items reordered successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/reorder", auth, isAdmin, reorderMenuItems);

/**
 * @swagger
 * /api/menu/structure:
 *   get:
 *     summary: Get the full menu structure
 *     tags: [Menu]
 *     responses:
 *       200:
 *         description: The full menu structure
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MenuItem'
 *       500:
 *         description: Server error
 */
router.get("/structure", getMenuStructure);

export default router;
