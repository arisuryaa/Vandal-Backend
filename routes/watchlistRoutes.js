const express = require("express");
const router = express.Router();
const { getAllWatchlist, addWatchlist } = require("../controller/watchlistController");

router.get("/", async (req, res) => {
  try {
    await getAllWatchlist(req, res);
  } catch (error) {
    console.log(error);
  }
});

router.post("/", async (req, res) => {
  try {
    await addWatchlist(req, res);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
