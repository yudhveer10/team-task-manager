const express = require("express");
const { getCurrentUser, login, signup } = require("../controllers/auth.controller");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", verifyToken, getCurrentUser);

module.exports = router;
