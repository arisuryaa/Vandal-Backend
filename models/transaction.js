// models/Transaction.js
import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    ref: "Users",
    required: true,
  },
  coinId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["buy", "sell"],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  pricePerCoin: {
    type: Number,
    required: true,
  },
  totalValue: {
    type: Number,
    required: true,
  },
  note: {
    type: String,
    default: "No note",
  },
  transactedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Transaction", transactionSchema);
