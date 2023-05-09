const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const User = require("../models/User");

module.exports = function (passport) {
  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = process.env.JWTKey; // Use your JWT secret here

  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      User.findById(jwt_payload.id, (err, user) => {
        if (err) {
          return done(err, false);
        }
        if (!user) {
          return done(null, false, { msg: `User not found.` });
        }
        return done(null, user);
      });
    })
  );
};
