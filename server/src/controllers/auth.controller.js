const prisma = require("../lib/prisma");
const { comparePassword, createToken, hashPassword } = require("../utils/auth");
const { assert, validateLoginInput, validateSignupInput } = require("../utils/validators");

const FRONTEND_BASE_URL = process.env.CLIENT_URL || "http://localhost:3000";

const signup = async (req, res, next) => {
  try {
    validateSignupInput(req.body);
    const email = req.body.email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    assert(!existingUser, "User already exists", 409);

    const user = await prisma.user.create({
      data: {
        name: req.body.name.trim(),
        email,
        password: await hashPassword(req.body.password),
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    const token = createToken(user.id);

    return res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    validateLoginInput(req.body);
    const email = req.body.email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    assert(user, "Invalid email or password", 401);
    assert(user.provider === "local", "Use your social sign-in provider for this account", 400);

    const isPasswordValid = await comparePassword(req.body.password, user.password);
    assert(isPasswordValid, "Invalid email or password", 401);

    const token = createToken(user.id);

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getCurrentUser = async (req, res) => {
  res.json({ user: req.user });
};

const getOAuthProviders = async (req, res) => {
  res.json({
    providers: {
      google: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
      github: Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
    },
  });
};

const handleOAuthSuccess = (req, res) => {
  const token = createToken(req.user.id);
  const redirectURL = new URL("/oauth/callback", FRONTEND_BASE_URL);
  redirectURL.searchParams.set("token", token);
  res.redirect(redirectURL.toString());
};

const handleOAuthFailure = (req, res) => {
  const redirectURL = new URL("/login", FRONTEND_BASE_URL);
  redirectURL.searchParams.set("error", "Social login failed");
  res.redirect(redirectURL.toString());
};

module.exports = {
  signup,
  login,
  getCurrentUser,
  getOAuthProviders,
  handleOAuthSuccess,
  handleOAuthFailure,
};
