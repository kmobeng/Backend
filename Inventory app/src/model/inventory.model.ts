import { Schema, Document, model } from "mongoose";

export interface IInventory extends Document {
  name: string;
  price: number;
  quantity: number;
}

const inventorySchema = new Schema<IInventory>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

export default model<IInventory>("Inventory", inventorySchema);
