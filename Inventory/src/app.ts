import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import inventoryRoutes from "./routes/inventory.routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use("/api/inventory", inventoryRoutes);
app.use(errorHandler);

export default app;
