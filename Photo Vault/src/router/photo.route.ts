import { Router } from "express";
import { protect } from "../controller/auth.controller";
import {
  deletePhoto,
  getAllPhotos,
  getSinglePhoto,
  updatePhoto,
  uploadPhoto,
} from "../controller/photo.controller";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

router
  .route("/")
  .post(protect, upload.single("photo"), uploadPhoto)
  .get(protect, getAllPhotos);

router
  .route("/:photoId")
  .get(protect, getSinglePhoto)
  .patch(protect, updatePhoto)
  .delete(protect, deletePhoto);

export default router;
