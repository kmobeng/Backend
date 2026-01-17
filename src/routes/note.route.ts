import { Router } from "express";
import {
  checkGrammar,
  getAllNotes,
  getNoteInHtml,
  saveNote,
} from "../controllers/note.controller";
import { protect } from "../controllers/auth.controller";

const noteRoute = Router();

noteRoute.post("/check-grammar", checkGrammar);

noteRoute.post("/", protect, saveNote);
noteRoute.get("/", protect, getAllNotes);
noteRoute.get("/:noteId",protect,getNoteInHtml)

export default noteRoute;
