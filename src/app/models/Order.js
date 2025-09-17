import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  order_id: { type: String, required: true },
  items: { type: Array, required: true },
  total: { type: Number, required: true },
  payment_method: { type: String, required: true },
  user_email: { type: String, required: true },
  status: { type: String, default: "Pending" },
  customer_name: String,
  customer_phone: String,
  customer_address: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
