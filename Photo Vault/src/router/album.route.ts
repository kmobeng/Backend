import { Router } from "express";
import { protect } from "../controller/auth.controller";
import { createAlbum, getAllAlbums } from "../controller/album.controller";

const router = Router();

router.route("/").post(protect, createAlbum).get(protect, getAllAlbums);

export default router;
