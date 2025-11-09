const express = require("express");
const router = express.Router();
const { createUser } = require("../controller/registerController");

router.post("/", async (req, res) => {
  try {
    await createUser(req, res);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
