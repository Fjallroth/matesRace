module.exports = {
  ensureAuth: function (req, res, next) {
    if (req.isAuthenticated()) {
      console.log(req.sessionID);
      console.log("ensureAuth middleware called");
      return next();
    } else {
      console.log(req.sessionID);
      console.log("user not authenticated");
      req.flash("error_msg", "Please log in to view this resource");
      return res.redirect("/login");
    }
  },
};
