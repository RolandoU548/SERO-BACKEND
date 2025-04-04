import { Schema, model } from "mongoose";

const paymentSchema = new Schema({
  status: { type: String, required: true },
  method: { type: String, required: true },
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  invoice: { type: String, required: true },
  service: { type: String, required: true },
  description: { type: String, required: true },
  client: { type: Schema.Types.ObjectId, ref: "Client", required: true },
});

const Payment = model("Payment", paymentSchema);

export default Payment;
