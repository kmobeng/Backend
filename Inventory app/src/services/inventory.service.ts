import mongoose from "mongoose";
import Inventory from "../model/inventory.model";
import { createError } from "../utils/error.util";
import { create } from "ts-node";

export const createInventoryService = async (
  name: string,
  price: number,
  quantity: number
) => {
  try {
    const newInventory = await Inventory.create({ name, price, quantity });

    if (!newInventory) {
      throw createError(400, "Failed to create an inventory");
    }

    await newInventory.save();
    return newInventory;
  } catch (error) {
    throw error;
  }
};

export const fetchAllInventoryService = async () => {
  try {
    const allInventory = await Inventory.find();
    if (!allInventory) {
      throw createError(404, "No Inventory found");
    }
    return allInventory;
  } catch (error) {
    throw error;
  }
};

export const fetchSingleInventoryService = async (id: string) => {
  try {
    const singleInventory = await Inventory.findById(id);

    if (!singleInventory) {
      throw createError(404, "Inventory not found");
    }
    return singleInventory;
  } catch (error) {
    throw error;
  }
};

export const updateInventoryService = async (
  id: string,
  newName: string,
  newPrice: number,
  newQuantity: number
) => {
  try {
    const inventory = await Inventory.findById(id);
    if (!inventory) {
      throw createError(400, "Invalid ID specified");
    }

    const updatedInventory = await Inventory.findByIdAndUpdate(
      id,
      { $set: { name: newName, price: newPrice, quantity: newQuantity } },
      { new: true, runValidators: true }
    );

    return updatedInventory;
  } catch (error) {
    throw error;
  }
};

export const deleteInventoryService = async (id: string) => {
  try {
    const inventory = await Inventory.findById(id);
    if (!inventory) {
      throw createError(404, "Inventory does not exist");
    }

    await Inventory.findByIdAndDelete(id);
  } catch (error) {
    throw error;
  }
};
