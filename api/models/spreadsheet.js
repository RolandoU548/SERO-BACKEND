import { Schema, model } from "mongoose";

const spreadsheet = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  tableData: { type: Schema.Types.Mixed },
});

const Spreadsheet = model("Spreadsheet", spreadsheet);

export default Spreadsheet;
