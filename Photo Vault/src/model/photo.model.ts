import { Document, model, Schema } from "mongoose";

export interface IPhoto extends Document {
  title: string;
  description?: string;
  visibility: string;
  url: string;
  publicId: string;
  user: string;
  album?: string;
  createdAt: Date;
}

const PhotoSchema = new Schema({
  title: { type: String, required: [true, "title is required"] },
  description: { type: String },
  visibility: { type: String, enum: ["private", "public"], default: "public" },
  url: String,
  publicId: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "user field is required"],
  },
  album: { type: Schema.Types.ObjectId, ref: "Album" },
  createdAt: { type: Date, default: Date.now },
});

const Photo = model<IPhoto>("Photo", PhotoSchema);

export default Photo;
