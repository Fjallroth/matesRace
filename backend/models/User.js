const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: { type: String, unique: true },
  userStravaAccount: { type: String, required: false },
  userStravaToken: { type: String, required: false },
  userStravaAccess: { type: String, required: false },
  userStravaRefresh: { type: String, required: false },
  userStravaFirstName: { type: String, required: false },
  userStravaLastName: { type: String, required: false },
  userStravaPic: { type: String, required: false },
  email: { type: String, unique: true },
  usertokenExpire: { type: Number, required: false },
  userSex: { type: String, required: false },
  userActivitylist: { type: Array, required: false },
  password: String,
});

// Password hash middleware.

UserSchema.pre("save", function save(next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

// Helper method for validating user's password.

UserSchema.methods.comparePassword = function comparePassword(
  candidatePassword,
  cb
) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

module.exports = mongoose.model("User", UserSchema);
