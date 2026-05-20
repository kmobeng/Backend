import express, { Application, Response, Request } from "express";
import morgan from "morgan";

const app: Application = express();

app.use(morgan("dev"));
app.use(express.json());

app.use("/api", (req: Request, res: Response) => {
  res.send("Server is up and running!");
});

export default app;
