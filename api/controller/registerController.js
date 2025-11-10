import users from "../models/Users.js";

const createUser = async (req, res) => {
  try {
    const result = await users.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
  }
};

export default createUser;
