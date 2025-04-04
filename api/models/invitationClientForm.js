import { Schema, model } from "mongoose";

const invitationClientFormSchema = new Schema({
  invitationHash: { type: String, required: true },
  expiredForm: { type: Boolean, required: true, default: false },
});

const InvitationClientForm = model(
  "InvitationClientForm",
  invitationClientFormSchema
);

export default InvitationClientForm;
