import { Schema, model } from "mongoose";

const suggestion = new Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email is not valid"],
  },
  text: { type: String, required: true },
});

const Suggestion = model("Suggestion", suggestion);

export default Suggestion;
