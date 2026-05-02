const express = require("express");
const { getDashboard } = require("../controllers/dashboard.controller");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.get("/", verifyToken, getDashboard);

module.exports = router;
