import { Schema, model } from "mongoose";

const invitationDatabaseFormSchema = new Schema({
  invitationHash: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  expired: { type: Boolean, required: true, default: false },
});

const InvitationDatabaseForm = model(
  "InvitationDatabaseForm",
  invitationDatabaseFormSchema
);

export default InvitationDatabaseForm;
