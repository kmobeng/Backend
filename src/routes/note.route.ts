import { Router } from "express";
import { checkGrammar, saveNote } from "../controllers/note.controller";
import { protect } from "../controllers/auth.controller";

const noteRoute = Router()

noteRoute.post("/check-grammar", checkGrammar)

noteRoute.post('/',protect,saveNote)

export default noteRoute