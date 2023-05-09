module.exports = {
  ensureAuth: function (req, res, next) {
    passport.authenticate(
      "jwt",
      { session: false },
      function (err, user, info) {
        if (err) {
          console.error(err);
          return res
            .status(500)
            .json({ error: "An error occurred during authentication." });
        }
        if (!user) {
          return res
            .status(401)
            .json({ error: "Unauthorized. Please log in." });
        }
        req.user = user;
        next();
      }
    )(req, res, next);
  },
};
