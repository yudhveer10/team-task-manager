const express = require("express");
const {
  createTask,
  deleteTask,
  listTasks,
  updateTask,
} = require("../controllers/tasks.controller");
const { verifyToken, requireAdmin, requireMember } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

router.use(verifyToken);

router.get("/", requireMember, listTasks);
router.post("/", requireMember, createTask);
router.patch("/:taskId", requireMember, updateTask);
router.delete("/:taskId", requireAdmin, deleteTask);

module.exports = router;
