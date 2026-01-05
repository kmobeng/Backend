import { Router } from "express";
import { protect } from "../controller/auth.controller";
import {
  createAlbum,
  deleteSingleAlbum,
  getAllAlbums,
  getSingleAlbum,
  updateSingleAlbum,
} from "../controller/album.controller";

const router = Router();

router.route("/album").post(protect, createAlbum).get(protect, getAllAlbums);

router
  .route("/album/:albumId")
  .get(protect, getSingleAlbum)
  .patch(protect, updateSingleAlbum)
  .delete(protect, deleteSingleAlbum);

router.route("/:userId/album").get(protect, getAllAlbums);

router.route("/:userId/album/:albumId").get(protect, getSingleAlbum);

export default router;
