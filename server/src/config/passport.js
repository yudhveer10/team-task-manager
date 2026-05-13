const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const { Strategy: GitHubStrategy } = require("passport-github2");
const prisma = require("../lib/prisma");
const { hashPassword } = require("../utils/auth");

const createOAuthUser = async ({ email, name, avatarUrl, provider, providerId }) => {
  const userData = {
    name: name || email.split("@")[0],
    email,
    password: await hashPassword(`oauth-${provider}-${providerId}`),
    provider,
    avatarUrl: avatarUrl || null,
  };

  if (provider === "google") {
    userData.googleId = providerId;
  }

  if (provider === "github") {
    userData.githubId = providerId;
  }

  return prisma.user.create({ data: userData });
};

const upsertOAuthUser = async ({ email, name, avatarUrl, provider, providerId }) => {
  const providerWhere =
    provider === "google" ? { googleId: providerId } : { githubId: providerId };

  let user = await prisma.user.findFirst({
    where: {
      OR: [providerWhere, { email }],
    },
  });

  if (!user) {
    return createOAuthUser({ email, name, avatarUrl, provider, providerId });
  }

  const updateData = {
    name: name || user.name,
    avatarUrl: avatarUrl || user.avatarUrl,
    provider,
  };

  if (provider === "google" && !user.googleId) {
    updateData.googleId = providerId;
  }

  if (provider === "github" && !user.githubId) {
    updateData.githubId = providerId;
  }

  return prisma.user.update({
    where: { id: user.id },
    data: updateData,
  });
};

const configurePassport = () => {
  const serverURL = process.env.SERVER_URL || `http://localhost:${process.env.PORT || 5000}`;

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: `${serverURL}/api/auth/google/callback`,
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const email = profile.emails?.[0]?.value;

            if (!email) {
              return done(new Error("Google account did not return an email address"));
            }

            const user = await upsertOAuthUser({
              email,
              name: profile.displayName,
              avatarUrl: profile.photos?.[0]?.value,
              provider: "google",
              providerId: profile.id,
            });

            return done(null, user);
          } catch (error) {
            return done(error);
          }
        }
      )
    );
  }

  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport.use(
      new GitHubStrategy(
        {
          clientID: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
          callbackURL: `${serverURL}/api/auth/github/callback`,
          scope: ["user:email"],
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const email =
              profile.emails?.find((entry) => entry.verified)?.value ||
              profile.emails?.[0]?.value;

            if (!email) {
              return done(new Error("GitHub account did not return a verified email"));
            }

            const user = await upsertOAuthUser({
              email,
              name: profile.displayName || profile.username,
              avatarUrl: profile.photos?.[0]?.value,
              provider: "github",
              providerId: profile.id,
            });

            return done(null, user);
          } catch (error) {
            return done(error);
          }
        }
      )
    );
  }
};

module.exports = {
  passport,
  configurePassport,
};
