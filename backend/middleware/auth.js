module.exports = {
  ensureAuth: function (req, res, next) {
    if (req.isAuthenticated()) {
      console.log(req.sessionID);
      console.log("ensureAuth middleware called");
      return next();
    } else {
      console.log(req.sessionID);
      console.log("user not authenicated");
      return res.redirect("/");
    }
  },
};
