const express = require("express");
const app = express();
const passport = require("passport");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");
const connectDB = require("./config/database");
const mainRoutes = require("./routes/main");
const raceRoutes = require("./routes/raceMates");
let cors = require("cors");
const path = require("path");
require("dotenv").config({ path: "./config/.env" });

require("./config/passport")(passport);

connectDB();

app.set("views", path.join(__dirname, "../client/build"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "../client/build")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger("dev"));
app.use(cookieParser());
app.use(passport.initialize());

session({
  secret: "keyboard cat",
  cookie: { maxAge: 60000 * 60 * 8, sameSite: "lax" },
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
});

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://mates-race.vercel.app/"
        : "http://localhost:2121",
  })
);
app.use("/", mainRoutes);
app.use("/raceMates", raceRoutes);
app.listen(process.env.PORT, () => {
  console.log("Server is running, you better catch it!");
});
module.exports = app;
