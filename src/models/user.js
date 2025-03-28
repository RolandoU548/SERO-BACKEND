import { Schema, model } from "mongoose";

const userSchema = new Schema({
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email is not valid"],
  },
  password: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  role: { type: [String], required: true, enum: ["admin", "user"] },
  status: String,
  phone: Number,
  address: String,
  birthday: Date,
  refreshToken: String,
});

const User = model("User", userSchema);

export default User;
