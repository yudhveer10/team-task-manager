const { ProjectRole } = require("@prisma/client");
const prisma = require("../lib/prisma");
const { assert, normalizeEnumValue, validateMemberInput, validateProjectInput } = require("../utils/validators");

const listProjects = async (req, res, next) => {
  try {
    const projects = await prisma.projectMember.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        project: {
          include: {
            owner: {
              select: { id: true, name: true, email: true },
            },
            _count: {
              select: { members: true, tasks: true },
            },
          },
        },
      },
    });

    return res.json({
      projects: projects.map((entry) => ({
        membershipRole: entry.role,
        ...entry.project,
      })),
    });
  } catch (err) {
    next(err);
  }
};

const createProject = async (req, res, next) => {
  try {
    validateProjectInput(req.body);

    const project = await prisma.project.create({
      data: {
        name: req.body.name.trim(),
        description: req.body.description?.trim() || null,
        ownerId: req.user.id,
        members: {
          create: {
            userId: req.user.id,
            role: ProjectRole.ADMIN,
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    });

    return res.status(201).json({ project });
  } catch (err) {
    next(err);
  }
};

const getProjectById = async (req, res, next) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.projectId },
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
        tasks: {
          include: {
            assignee: {
              select: { id: true, name: true, email: true },
            },
            createdBy: {
              select: { id: true, name: true, email: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    assert(project, "Project not found", 404);
    return res.json({ project });
  } catch (err) {
    next(err);
  }
};

const addProjectMember = async (req, res, next) => {
  try {
    const normalizedRole = validateMemberInput(req.body);
    const email = req.body.email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true },
    });

    assert(user, "User with this email does not exist", 404);

    const project = await prisma.project.findUnique({
      where: { id: req.params.projectId },
      select: { id: true, ownerId: true },
    });

    assert(project, "Project not found", 404);

    const existingMembership = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: user.id,
          projectId: req.params.projectId,
        },
      },
    });

    assert(!existingMembership, "User is already a member of this project", 409);

    const membership = await prisma.projectMember.create({
      data: {
        userId: user.id,
        projectId: req.params.projectId,
        role: normalizedRole,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return res.status(201).json({ membership });
  } catch (err) {
    next(err);
  }
};

const updateProjectMemberRole = async (req, res, next) => {
  try {
    const normalizedRole = normalizeEnumValue(req.body.role);
    assert(Object.values(ProjectRole).includes(normalizedRole), "Role must be ADMIN or MEMBER");

    const membership = await prisma.projectMember.findUnique({
      where: { id: req.params.memberId },
      include: {
        project: {
          select: { ownerId: true },
        },
      },
    });

    assert(membership, "Project member not found", 404);
    assert(membership.projectId === req.params.projectId, "Project member does not belong to this project", 400);
    assert(membership.userId !== membership.project.ownerId, "Project owner role cannot be changed");

    const updatedMembership = await prisma.projectMember.update({
      where: { id: req.params.memberId },
      data: { role: normalizedRole },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return res.json({ membership: updatedMembership });
  } catch (err) {
    next(err);
  }
};

const removeProjectMember = async (req, res, next) => {
  try {
    const membership = await prisma.projectMember.findUnique({
      where: { id: req.params.memberId },
      include: {
        project: {
          select: { ownerId: true },
        },
      },
    });

    assert(membership, "Project member not found", 404);
    assert(membership.projectId === req.params.projectId, "Project member does not belong to this project", 400);
    assert(membership.userId !== membership.project.ownerId, "Project owner cannot be removed");

    await prisma.projectMember.delete({
      where: { id: req.params.memberId },
    });

    await prisma.task.updateMany({
      where: {
        projectId: req.params.projectId,
        assigneeId: membership.userId,
      },
      data: {
        assigneeId: null,
      },
    });

    return res.json({ message: "Member removed successfully" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listProjects,
  createProject,
  getProjectById,
  addProjectMember,
  updateProjectMemberRole,
  removeProjectMember,
};
