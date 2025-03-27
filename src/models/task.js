import { Schema, model } from "mongoose";

const taskSchema = new Schema({
  completed: { type: Boolean, required: true, default: false },
  date: { type: Date, required: true },
  text: { type: String, required: true },
});

const Task = model("Task", taskSchema);

export default Task;
