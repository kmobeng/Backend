import { Router } from "express";
import { protect } from "../controller/auth.controller";
import { createAlbum } from "../controller/album.controller";

const router = Router();

router.route("/").post(protect, createAlbum);

export default router;
