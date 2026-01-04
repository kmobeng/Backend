import { Router } from "express";
import {
  login,
  protect,
  restrictTo,
  signUp,
} from "../controller/auth.controller";
import { getAllUsers } from "../controller/user.controller";

const router = Router();

router.post("/signup", signUp);
router.post("/login", login);

router.use(protect);

router.use(restrictTo("admin"));
router.route("/").get(getAllUsers);

export default router;
