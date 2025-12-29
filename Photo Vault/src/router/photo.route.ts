import { Router } from "express";
import { protect } from "../controller/auth.controller";
import {
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
  .route("/photos/:photoId")
  .get(protect, getSinglePhoto)
  .patch(protect, updatePhoto);

router.route("/:username").get(protect, getAllPhotos);

export default router;
