import express from "express";
const router = express.Router();
import { getAllWatchlist, addWatchlist, removeWatchlist } from "../controller/watchlistController.js";

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

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    await removeWatchlist(id, req, res);
  } catch (error) {
    console.log(error);
  }
});

export default router;
