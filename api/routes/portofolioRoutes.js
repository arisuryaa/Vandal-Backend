import express from "express";
const router = express.Router();
import { createTransaction, deleteTransaction, getAllTransaction, getPortofolio } from "../controller/portofolioController.js";

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

router.get("/allTransaction", async (req, res) => {
  try {
    await getAllTransaction(req, res);
  } catch (error) {
    console.log(error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await deleteTransaction(id, req, res);
  } catch (error) {
    console.log(error);
  }
});

router.put("/:coin", async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
  }
});

export default router;
