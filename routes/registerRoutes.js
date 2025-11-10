import express from "express";
const router = express.Router();
import createUser from "../controller/registerController.js";

router.post("/", async (req, res) => {
  try {
    await createUser(req, res);
  } catch (error) {
    console.log(error);
  }
});

export default router;
