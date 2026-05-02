const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const hashPassword = async (password) => bcrypt.hash(password, 10);

const comparePassword = async (password, hashedPassword) =>
  bcrypt.compare(password, hashedPassword);

const createToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

module.exports = {
  hashPassword,
  comparePassword,
  createToken,
};
