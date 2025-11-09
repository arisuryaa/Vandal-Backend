const mongoose = require("mongoose");

const watchlistSchema = mongoose.Schema({
  firebaseUid: {
    type: String,
    ref: "Users",
    required: true,
  },
  coinId: {
    type: String,
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("watchlist", watchlistSchema);
