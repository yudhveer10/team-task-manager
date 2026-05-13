const express = require("express");
const passport = require("passport");
const {
  getCurrentUser,
  getOAuthProviders,
  handleOAuthFailure,
  handleOAuthSuccess,
  login,
  signup,
} = require("../controllers/auth.controller");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.get("/providers", getOAuthProviders);
router.post("/signup", signup);
router.post("/login", login);
router.get("/me", verifyToken, getCurrentUser);
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/api/auth/oauth/failure",
  }),
  handleOAuthSuccess
);
router.get("/github", passport.authenticate("github", { session: false }));
router.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: "/api/auth/oauth/failure",
  }),
  handleOAuthSuccess
);
router.get("/oauth/failure", handleOAuthFailure);

module.exports = router;
