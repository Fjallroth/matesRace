const jwt = require("jsonwebtoken");
const User = require("../models/User");
module.exports = {
  ensureAuth: async function (req, res, next) {
    const token = req.cookies.token; // Get the token from the cookies
    if (!token) {
      return res.status(401).json({ error: "Unauthorized. Please log in." });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWTKey);
      console.log(decoded);
      req.user = await User.findOne({ _id: decoded._id });
      console.log(req.user);

      next();
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: "An error occurred during authentication." });
    }
  },
};
