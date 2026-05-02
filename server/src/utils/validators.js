const { ProjectRole, TaskPriority, TaskStatus } = require("@prisma/client");

const isEmail = (value) => /\S+@\S+\.\S+/.test(value);

const isNonEmptyString = (value) =>
  typeof value === "string" && value.trim().length > 0;

const normalizeEnumValue = (value) =>
  typeof value === "string" ? value.trim().toUpperCase() : value;

const assert = (condition, message, status = 400) => {
  if (!condition) {
    const error = new Error(message);
    error.status = status;
    throw error;
  }
};

const validateSignupInput = ({ name, email, password }) => {
  assert(isNonEmptyString(name), "Name is required");
  assert(isEmail(email), "A valid email is required");
  assert(typeof password === "string" && password.length >= 6, "Password must be at least 6 characters");
};

const validateLoginInput = ({ email, password }) => {
  assert(isEmail(email), "A valid email is required");
  assert(typeof password === "string" && password.length >= 6, "Password must be at least 6 characters");
};

const validateProjectInput = ({ name }) => {
  assert(isNonEmptyString(name), "Project name is required");
};

const validateMemberInput = ({ email, role }) => {
  assert(isEmail(email), "A valid email is required");
  const normalizedRole = normalizeEnumValue(role);
  assert(Object.values(ProjectRole).includes(normalizedRole), "Role must be ADMIN or MEMBER");
  return normalizedRole;
};

const validateTaskInput = ({ title, status, priority, dueDate }, { partial = false } = {}) => {
  if (!partial || title !== undefined) {
    assert(isNonEmptyString(title), "Task title is required");
  }

  if (status !== undefined) {
    const normalizedStatus = normalizeEnumValue(status);
    assert(Object.values(TaskStatus).includes(normalizedStatus), "Invalid task status");
  }

  if (priority !== undefined) {
    const normalizedPriority = normalizeEnumValue(priority);
    assert(Object.values(TaskPriority).includes(normalizedPriority), "Invalid task priority");
  }

  if (dueDate !== undefined && dueDate !== null) {
    assert(!Number.isNaN(new Date(dueDate).getTime()), "Invalid due date");
  }
};

module.exports = {
  assert,
  normalizeEnumValue,
  validateSignupInput,
  validateLoginInput,
  validateProjectInput,
  validateMemberInput,
  validateTaskInput,
};
