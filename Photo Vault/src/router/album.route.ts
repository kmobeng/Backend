import { Router } from "express";
import { protect } from "../controller/auth.controller";
import {
  createAlbum,
  getAllAlbums,
  getSingleAlbum,
} from "../controller/album.controller";

const router = Router({ mergeParams: true });

router.route("/").post(protect, createAlbum).get(protect, getAllAlbums);

router.route("/:albumId").get(protect, getSingleAlbum);
export default router;
