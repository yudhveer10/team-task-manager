const express = require("express");
const {
  addProjectMember,
  createProject,
  getProjectById,
  listProjects,
  removeProjectMember,
  updateProjectMemberRole,
} = require("../controllers/projects.controller");
const { verifyToken, requireAdmin, requireMember } = require("../middleware/auth");

const router = express.Router();

router.use(verifyToken);

router.get("/", listProjects);
router.post("/", createProject);
router.get("/:projectId", requireMember, getProjectById);
router.post("/:projectId/members", requireAdmin, addProjectMember);
router.patch("/:projectId/members/:memberId", requireAdmin, updateProjectMemberRole);
router.delete("/:projectId/members/:memberId", requireAdmin, removeProjectMember);

module.exports = router;
