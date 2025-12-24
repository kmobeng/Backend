import { Router } from "express";
import { protect } from "../controller/auth.controller";
import { uploadPhoto } from "../controller/photo.controller";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

router.route("/").post(protect, upload.single("photo"), uploadPhoto);

export default router;
