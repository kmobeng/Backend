import { Request, Response, NextFunction } from "express";
import * as inventoryService from "../services/inventory.service";

export const createInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, price, quantity } = req.body;
    const result = await inventoryService.createInventoryService(
      name,
      price,
      quantity
    );

    res
      .status(201)
      .json({ message: "Inventory created successfully", data: result });
  } catch (error) {
    console.log("Error is caused by ", error);
    next(error);
  }
};

export const fetchAllInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await inventoryService.fetchAllInventoryService();
    res
      .status(200)
      .json({ message: "All Inventory fetched successfully", data: result });
  } catch (error) {
    console.log("Error is caused by ", error);
    next(error);
  }
};

export const fetchSingleInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: "ID has not been specified" });
      return;
    }

    const result = await inventoryService.fetchSingleInventoryService(id);
    res
      .status(200)
      .json({ message: "Inventory fetched successfully", data: result });
  } catch (error) {
    console.log("Error is caused by ", error);
    next(error);
  }
};

export const updateInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, price, quantity } = req.body;

    if (!id) {
      res.status(400).json({ error: "id must be specified" });
      return;
    }
    const result = await inventoryService.updateInventoryService(
      id,
      name,
      price,
      quantity
    );

    res.status(200).json({ message: "Update successful", data: result });
  } catch (error) {
    console.log("Error is caused by ", error);
    next(error);
  }
};

export const deleteInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: "Id has not been specified" });
      return;
    }

    await inventoryService.deleteInventoryService(id);
    res.status(200).json({ message: "Inventory deleted successfully" });
  } catch (error) {
    console.log("Error is caused by ", error);
    next(error);
  }
};
