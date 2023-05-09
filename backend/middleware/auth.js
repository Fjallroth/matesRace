const jwt = require("jsonwebtoken");
module.exports = {
  ensureAuth: function (req, res, next) {
    const token = req.cookies.token; // Get the token from the cookies
    if (!token) {
      return res.status(401).json({ error: "Unauthorized. Please log in." });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWTKey);
      req.user = decoded;
      next();
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: "An error occurred during authentication." });
    }
  },
};
