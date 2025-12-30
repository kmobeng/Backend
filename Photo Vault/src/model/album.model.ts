import { InferSchemaType, model, Schema } from "mongoose";

const AlbumSchema = new Schema({
  name: {
    type: String,
    required: [true, "Album name is required"],
    trim: true,
  },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

type IAlbum = InferSchemaType<typeof AlbumSchema>;

const Album = model<IAlbum>("Album", AlbumSchema);

export default Album;
