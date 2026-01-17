import { Router } from "express";
import { checkGrammar } from "../controllers/note.controller";

const noteRoute = Router()

noteRoute.post("/check-grammar", checkGrammar)

export default noteRoute