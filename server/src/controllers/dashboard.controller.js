const prisma = require("../lib/prisma");

const getDashboard = async (req, res, next) => {
  try {
    const memberships = await prisma.projectMember.findMany({
      where: { userId: req.user.id },
      select: { projectId: true },
    });

    const projectIds = memberships.map((membership) => membership.projectId);

    if (projectIds.length === 0) {
      return res.json({
        summary: {
          totalProjects: 0,
          totalTasks: 0,
          todoTasks: 0,
          inProgressTasks: 0,
          completedTasks: 0,
          overdueTasks: 0,
        },
        tasks: [],
      });
    }

    const now = new Date();

    const [allTasks, overdueTasks] = await Promise.all([
      prisma.task.findMany({
        where: {
          projectId: { in: projectIds },
        },
        include: {
          project: {
            select: { id: true, name: true },
          },
          assignee: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: [
          { dueDate: "asc" },
          { createdAt: "desc" },
        ],
      }),
      prisma.task.count({
        where: {
          projectId: { in: projectIds },
          dueDate: { lt: now },
          status: { not: "DONE" },
        },
      }),
    ]);

    const summary = {
      totalProjects: projectIds.length,
      totalTasks: allTasks.length,
      todoTasks: allTasks.filter((task) => task.status === "TODO").length,
      inProgressTasks: allTasks.filter((task) => task.status === "IN_PROGRESS").length,
      completedTasks: allTasks.filter((task) => task.status === "DONE").length,
      overdueTasks,
    };

    return res.json({ summary, tasks: allTasks });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDashboard,
};
