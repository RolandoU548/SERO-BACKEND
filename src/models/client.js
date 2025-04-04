import { Schema, model } from "mongoose";

const clientSchema = new Schema({
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email is not valid"],
  },
  phone: Number,
  image: { type: String, required: true },
  business: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, required: true },
});

const Client = model("Client", clientSchema);

export default Client;
