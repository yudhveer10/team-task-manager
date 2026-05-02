const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");

// Verify JWT and attach user to request
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true },
    });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(401).json({ error: "Invalid token" });
  }
};

// Check if the user is an ADMIN in the given project
// Expects req.params.projectId to be set
const requireAdmin = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const membership = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: req.user.id,
          projectId,
        },
      },
    });

    if (!membership) {
      return res.status(403).json({ error: "You are not a member of this project" });
    }

    if (membership.role !== "ADMIN") {
      return res.status(403).json({ error: "Admin access required" });
    }

    req.membership = membership;
    next();
  } catch (err) {
    next(err);
  }
};

// Check if the user is ANY member of the project (admin or member)
const requireMember = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const membership = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: req.user.id,
          projectId,
        },
      },
    });

    if (!membership) {
      return res.status(403).json({ error: "You are not a member of this project" });
    }

    req.membership = membership;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { verifyToken, requireAdmin, requireMember };