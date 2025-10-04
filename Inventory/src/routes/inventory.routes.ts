import { Router } from "express";
import {
  createInventory,
  deleteInventory,
  fetchAllInventory,
  fetchSingleInventory,
  updateInventory,
} from "../controllers/inventory.controller";

const router = Router();

router.post("/create", createInventory);

router.get("/all", fetchAllInventory);

router.get("/single/:id", fetchSingleInventory);

router.patch("/update/:id", updateInventory);

router.delete("/delete/:id", deleteInventory);

export default router;
