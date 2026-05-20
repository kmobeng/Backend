import express, { Application, Response, Request } from "express";
import morgan from "morgan";
import Url from "./db.model";

const app: Application = express();

app.use(morgan("dev"));
app.use(express.json());

app.get("/api", (req: Request, res: Response) => {
  res.send("Server is up and running!");
});

app.post("/api/shorten", async (req: Request, res: Response) => {
  try {
    const { url, short } = req.body;
    if (!url || !short) {
      return res
        .status(400)
        .json({ error: "Original url and short name are required" });
    }

    try {
      new URL(url);
    } catch (error) {
      return res.status(400).json({ error: "Invalid URL format" });
    }

    let urlExists: boolean = true;

    while (urlExists) {
      const existingUrl = await Url.findOne({ shortUrl: short });
      if (!existingUrl) {
        urlExists = false;
      }
    }

    const createdUrl = await Url.create({
      originalUrl: url,
      shortUrl: short,
    });

    res.status(201).json({ success: true, data: createdUrl });
  } catch (error) {
    res.status(400).json({ error: "An error occured" });
  }
});

app.get("/api/shorten/:shortUrl", async (req: Request, res: Response) => {
  try {
    const { shortUrl } = req.params;
    if (!shortUrl) {
      return res.status(400).json({ error: "Short URL is required" });
    }

    const urlData = await Url.findOne({ shortUrl });

    if (!urlData) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    urlData.accessCount += 1;
    await urlData.save();

    res.redirect(urlData.originalUrl);
  } catch (error) {
    res.status(400).json({ error: "An error occured" });
  }
});

app.patch("/api/shorten/:shortUrl", async (req: Request, res: Response) => {
  try {
    const { shortUrl } = req.params;
    const { url, short } = req.body;

    if (!shortUrl) {
      return res.status(400).json({ error: "Short URL is required" });
    }

    if (!url && !short) {
      return res.status(400).json({
        error: "At least one of original url or short name is required",
      });
    }

    try {
      new URL(url);
    } catch (error) {
      return res.status(400).json({ error: "Invalid URL format" });
    }

    const urlData = await Url.findOneAndUpdate(
      { shortUrl },
      { originalUrl: url, shortUrl: short },
      { returnDocument: "after" },
    );

    if (!urlData) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    res.json({ success: true, data: urlData });
  } catch (error) {
    res.status(400).json({ error: "An error occured" });
  }
});

app.delete("/api/shorten/:shortUrl", async (req: Request, res: Response) => {
  try {
    const { shortUrl } = req.params;
    if (!shortUrl) {
      return res.status(400).json({ error: "Short URL is required" });
    }

    const urlData = await Url.findOneAndDelete({ shortUrl });

    if (!urlData) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    res.json({ success: true, data: null });
  } catch (error) {
    res.status(400).json({ error: "An error occured" });
  }
});

app.get("/api/:shortUrl/stats", async (req: Request, res: Response) => {
  try {
    const { shortUrl } = req.params;
    if (!shortUrl) {
      return res.status(400).json({ error: "Short URL is required" });
    }

    const urlData = await Url.findOne({ shortUrl });

    if (!urlData) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    res.json({ success: true, data: urlData });
  } catch (error) {
    res.status(400).json({ error: "An error occured" });
  }
});

export default app;
