import express from "express";
const router = express.Router();
import { getAllWatchlist, addWatchlist } from "../controller/watchlistController.js";

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

export default router;
