import mongoose from "mongoose";

const portofolioSchema = mongoose.Schema({
  firebaseUid: {
    type: String,
    ref: "Users",
    required: true,
  },
  coinId: {
    type: String,
    required: true,
  },
  totalSpend: {
    type: String,
    require: true,
  },
  quantity: {
    type: String,
    require: true,
  },
  averagePrice: {
    type: String,
    require: true,
  },
  addedAt: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model("portofolio", portofolioSchema);
