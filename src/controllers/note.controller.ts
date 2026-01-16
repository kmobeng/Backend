import { Request, Response, NextFunction } from "express";
import axios from "axios";

export const checkGrammar = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { note } = req.body;
    if (!note) {
      return res.status(400).json({ status: "fail", message: "Provide note" });
    }
    const response = await axios.post(
      "https://api.languagetool.org/v2/check",
      new URLSearchParams({
        text: note,
        language: "en-US",
      })
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
