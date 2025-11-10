import express from "express";
const router = express.Router();
import { createTransaction, getPortofolio } from "../controller/portofolioController.js";

router.post("/transaction", async (req, res) => {
  try {
    await createTransaction(req, res);
  } catch (error) {
    console.log(error);
  }
});

router.get("/", async (req, res) => {
  try {
    await getPortofolio(req, res);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
