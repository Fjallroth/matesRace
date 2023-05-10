const passport = require("passport");
const validator = require("validator");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.getLogin = (req, res) => {
  if (req.user) {
    return res.redirect("/raceMates");
  }
  res.render("login", {
    title: "Login",
  });
};

exports.postLogin = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (validator.isEmpty(req.body.password))
    validationErrors.push({ msg: "Password cannot be blank." });

  if (validationErrors.length) {
    return res.redirect("/login");
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect("/login");
    }
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (err) {
        return next(err);
      }
      if (!isMatch) {
        return res.redirect("/login");
      }
      const token = jwt.sign(user.toJSON(), process.env.JWTKey, {
        expiresIn: "8h",
      });
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "Lax",
        secure: true,
      });
      console.log(res.cookie);
      res.redirect("/raceMates");
    });
  });
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
};

exports.getSignup = (req, res) => {
  if (req.user) {
    return res.redirect("/raceMates");
  }
  res.render("signup", {
    title: "Create Account",
  });
};

exports.postSignup = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address." });
  if (!validator.isLength(req.body.password, { min: 8 }))
    validationErrors.push({
      msg: "Password must be at least 8 characters long",
    });
  if (req.body.password !== req.body.confirmPassword)
    validationErrors.push({ msg: "Passwords do not match" });

  if (validationErrors.length) {
    return res.redirect("../signup");
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  const user = new User({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
  });

  User.findOne(
    { $or: [{ email: req.body.email }, { userName: req.body.userName }] },
    (err, existingUser) => {
      if (err) {
        return next(err);
      }
      if (existingUser) {
        return res.redirect("../signup");
      }
      user.save((err) => {
        if (err) {
          return next(err);
        }
        const token = jwt.sign({ id: user._id }, process.env.JWTKey, {
          expiresIn: "8h",
        });
        res.cookie("token", token, {
          httpOnly: true,
          sameSite: "Lax",
          secure: true,
        });
        console.log(res.cookie);
        res.redirect("/raceMates");
      });
    }
  );
};
