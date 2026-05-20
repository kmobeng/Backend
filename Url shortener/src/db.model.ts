import mongoose from "mongoose";

const urlSchema = new mongoose.Schema(
  {
    originalUrl: { type: String, required: true },
    shortUrl: { type: String, required: true },
    accessCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

interface IUrl extends mongoose.Document {
  originalUrl: string;
  shortUrl: string;
  accessCount: number;
}

const Url = mongoose.model<IUrl>("Url", urlSchema);

export default Url;
