import mongoose, { InferSchemaType, model } from "mongoose";

const NoteSchema = new mongoose.Schema({
  content: { type: String, required: [true, "Please provide note content"] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

NoteSchema.pre("save", async function () {
  this.updatedAt = new Date(Date.now());
});

type INoteSchema = InferSchemaType<typeof NoteSchema> & Document;

const Note = model<INoteSchema>("Note");

export default Note;
