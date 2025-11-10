import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },
  photoUrl: {
    type: String,
    default: "user.png",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model("users", userSchema);
