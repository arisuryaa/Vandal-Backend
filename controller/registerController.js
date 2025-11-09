const users = require("../models/Users");

const createUser = async (req, res) => {
  try {
    const result = await users.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createUser,
};
