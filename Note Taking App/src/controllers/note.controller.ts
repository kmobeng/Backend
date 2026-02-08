import { Request, Response, NextFunction } from "express";
import axios from "axios";
import { remark } from "remark";
import strip from "strip-markdown";
import Note from "../model/note.model";
import { IUser } from "../model/user.model";
import html from "remark-html";
import sanitizeHtml from "sanitize-html";

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}

export const checkGrammar = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const { note } = req.body;
    if (!note) {
      return res.status(400).json({ status: "fail", message: "Provide note" });
    }
    const plainText = String(await remark().use(strip).process(note));
    const response = await axios.post(
      "https://api.languagetool.org/v2/check",
      new URLSearchParams({
        text: plainText,
        language: "en-US",
      }),
    );

    return res
      .status(200)
      .json({ status: "success", data: response.data.matches });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "fail", message: "Internal server error" });
  }
};

export const saveNote = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response> => {
  try {
    const { note } = req.body;
    if (!note) {
      return res
        .status(400)
        .json({ status: "success", message: "No note content provided" });
    }
    const saved = await Note.create({ user: req.user._id, content: note });
    if (!saved) {
      return res
        .status(400)
        .json({ status: "failed", message: "Unable to save note" });
    }
    return res.status(201).json({ status: "success", data: saved });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "fail", message: "Internal server error" });
  }
};

export const getAllNotes = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const notes = await Note.find({ user: req.user._id });
    if (!notes) {
      return res
        .status(404)
        .json({ status: "fail", message: "No notes found" });
    }
    return res.status(200).json({ status: "success", data: notes });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "fail", message: "Internal server error" });
  }
};

export const getNoteInHtml = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const {noteId}= req.params
    const note= await Note.findById(noteId)
    if (!note) {
      return res.status(404).json({status:"fail", message:"No note found"})
    }
const renderedHtml = String(
  await remark().use(html).process(note.content)
);

const safeHtml = sanitizeHtml(renderedHtml);

return res.status(200).json({status: "success", data: safeHtml})
  } catch (error) {
    return res
      .status(500)
      .json({ status: "fail", message: "Internal server error" });
  }
};
