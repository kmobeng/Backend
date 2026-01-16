import { Router } from "express";
import { checkGrammar } from "../controllers/note.controller";

const router = Router()

router.post("/check-grammar", checkGrammar)

export default router