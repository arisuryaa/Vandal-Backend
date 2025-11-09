const express = require("express");
const router = express.Router();
const { createTransaction, getPortofolio } = require("../controller/portofolioController");

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
