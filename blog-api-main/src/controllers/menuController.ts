import { Request, Response } from "express";
import { Types } from "mongoose";
import MenuItem, { IMenuItem } from "../models/Menu";
import logger from "../utils/logger";

export const createMenuItem = async (req: Request, res: Response) => {
  try {
    const { title, url, order, parent } = req.body;
    const menuItem = new MenuItem({
      title,
      url,
      order,
      parent,
    });

    await menuItem.save();
    logger.info(`Menu item created: ${title}`);
    res.status(201).json(menuItem);
  } catch (error) {
    logger.error("Error creating menu item", { error });
    res.status(500).json({ message: "Error creating menu item", error });
  }
};
export const getMenuItem = async (req: Request, res: Response) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.json(menuItem);
  } catch (error) {
    logger.error("Error fetching menu item", { error });
    res.status(500).json({ message: "Error fetching menu item", error });
  }
};

export const updateMenuItem = async (req: Request, res: Response) => {
  try {
    const { title, url, order, parent } = req.body;
    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { title, url, order, parent },
      { new: true, runValidators: true }
    );

    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    logger.info(`Menu item updated: ${menuItem.title}`);
    res.json(menuItem);
  } catch (error) {
    logger.error("Error updating menu item", { error });
    res.status(500).json({ message: "Error updating menu item", error });
  }
};

export const deleteMenuItem = async (req: Request, res: Response) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    logger.info(`Menu item deleted: ${menuItem.title}`);
    res.json({ message: "Menu item deleted successfully" });
  } catch (error) {
    logger.error("Error deleting menu item", { error });
    res.status(500).json({ message: "Error deleting menu item", error });
  }
};

export const reorderMenuItems = async (req: Request, res: Response) => {
  try {
    const { items } = req.body; // Expect an array of { id: string, order: number }

    // Use a transaction to ensure all updates succeed or fail together
    const session = await MenuItem.startSession();
    await session.withTransaction(async () => {
      for (const item of items) {
        await MenuItem.findByIdAndUpdate(item.id, { order: item.order });
      }
    });
    session.endSession();

    logger.info("Menu items reordered");
    res.json({ message: "Menu items reordered successfully" });
  } catch (error) {
    logger.error("Error reordering menu items", { error });
    res.status(500).json({ message: "Error reordering menu items", error });
  }
};

interface MenuItemJSON {
  _id: Types.ObjectId;
  title: string;
  url: string;
  order: number;
  parent?: Types.ObjectId;
  children?: MenuItemJSON[];
}

const buildMenuTree = (
  items: IMenuItem[],
  parentId: string | null = null
): IMenuItem[] => {
  const children = items.filter((item) =>
    parentId ? item.parent?.toString() === parentId : !item.parent
  );

  return children.map((child) => ({
    ...child.toJSON(),
    children: buildMenuTree(items, child.id.toString()),
  })) as IMenuItem[];
};

export const getMenuStructure = async (req: Request, res: Response) => {
  try {
    const menuItems = await MenuItem.find().sort("order");
    const menuStructure = buildMenuTree(menuItems);
    res.json(menuStructure);
  } catch (error) {
    logger.error("Error fetching menu structure", { error });
    res.status(500).json({ message: "Error fetching menu structure", error });
  }
};

export const getMenuItems = async (req: Request, res: Response) => {
  try {
    const menuItems = await MenuItem.find().sort("order").populate("children");
    res.json(menuItems);
  } catch (error) {
    logger.error("Error fetching menu items", { error });
    res.status(500).json({ message: "Error fetching menu items", error });
  }
};
