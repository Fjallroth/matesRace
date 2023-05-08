const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const flash = require("express-flash");
const logger = require("morgan");
const connectDB = require("./config/database");
const mainRoutes = require("./routes/main");
const raceRoutes = require("./routes/raceMates");
const { ensureGuest } = require("./middleware/auth");

require("dotenv").config({ path: "./config/.env" });

require("./config/passport")(passport);

connectDB();

app.set("views", path.join(__dirname, "../client/build"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "../client/build")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger("dev"));

// Sessions
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: {
      maxAge: 60000 * 60 * 8,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
  console.log(req.session);
  next();
});

// Set up CORS after session middleware
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

module.exports = app;
