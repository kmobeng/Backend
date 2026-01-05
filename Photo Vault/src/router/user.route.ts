import { Router } from "express";
import { protect, restrictTo } from "../controller/auth.controller";
import { getAllUsers } from "../controller/user.controller";
import { apiLimiter } from "../middleware/limiter.middleware";

const router = Router();

router.use(protect);
router.use(apiLimiter);

router.use(restrictTo("admin"));
router.route("/").get(getAllUsers);

export default router;
