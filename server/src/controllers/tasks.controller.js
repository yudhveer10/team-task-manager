const prisma = require("../lib/prisma");
const { assert, normalizeEnumValue, validateTaskInput } = require("../utils/validators");

const ensureProjectMember = async (projectId, userId) => {
  const membership = await prisma.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId,
        projectId,
      },
    },
  });

  return membership;
};

const listTasks = async (req, res, next) => {
  try {
    const filters = {
      projectId: req.params.projectId,
    };

    if (req.query.status) {
      filters.status = normalizeEnumValue(req.query.status);
    }

    if (req.query.assigneeId) {
      filters.assigneeId = req.query.assigneeId;
    }

    if (req.query.overdue === "true") {
      filters.dueDate = { lt: new Date() };
      filters.status = { not: "DONE" };
    }

    const tasks = await prisma.task.findMany({
      where: filters,
      orderBy: [
        { dueDate: "asc" },
        { createdAt: "desc" },
      ],
      include: {
        assignee: {
          select: { id: true, name: true, email: true },
        },
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return res.json({ tasks });
  } catch (err) {
    next(err);
  }
};

const createTask = async (req, res, next) => {
  try {
    validateTaskInput(req.body);

    let assigneeId = req.body.assigneeId || null;

    if (assigneeId) {
      const membership = await ensureProjectMember(req.params.projectId, assigneeId);
      assert(membership, "Assignee must be a member of the project", 400);
    }

    const task = await prisma.task.create({
      data: {
        title: req.body.title.trim(),
        description: req.body.description?.trim() || null,
        status: normalizeEnumValue(req.body.status) || "TODO",
        priority: normalizeEnumValue(req.body.priority) || "MEDIUM",
        dueDate: req.body.dueDate ? new Date(req.body.dueDate) : null,
        assigneeId,
        projectId: req.params.projectId,
        createdById: req.user.id,
      },
      include: {
        assignee: {
          select: { id: true, name: true, email: true },
        },
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return res.status(201).json({ task });
  } catch (err) {
    next(err);
  }
};

const updateTask = async (req, res, next) => {
  try {
    validateTaskInput(req.body, { partial: true });

    const existingTask = await prisma.task.findUnique({
      where: { id: req.params.taskId },
    });

    assert(existingTask, "Task not found", 404);
    assert(existingTask.projectId === req.params.projectId, "Task does not belong to this project", 400);

    let assigneeId = req.body.assigneeId;
    if (assigneeId !== undefined && assigneeId !== null) {
      const membership = await ensureProjectMember(req.params.projectId, assigneeId);
      assert(membership, "Assignee must be a member of the project", 400);
    }

    const updatedTask = await prisma.task.update({
      where: { id: req.params.taskId },
      data: {
        title: req.body.title?.trim(),
        description: req.body.description !== undefined ? req.body.description?.trim() || null : undefined,
        status: req.body.status ? normalizeEnumValue(req.body.status) : undefined,
        priority: req.body.priority ? normalizeEnumValue(req.body.priority) : undefined,
        dueDate: req.body.dueDate !== undefined ? (req.body.dueDate ? new Date(req.body.dueDate) : null) : undefined,
        assigneeId: assigneeId === undefined ? undefined : assigneeId,
      },
      include: {
        assignee: {
          select: { id: true, name: true, email: true },
        },
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return res.json({ task: updatedTask });
  } catch (err) {
    next(err);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: req.params.taskId },
    });

    assert(task, "Task not found", 404);
    assert(task.projectId === req.params.projectId, "Task does not belong to this project", 400);

    await prisma.task.delete({
      where: { id: req.params.taskId },
    });

    return res.json({ message: "Task deleted successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listTasks,
  createTask,
  updateTask,
  deleteTask,
};
