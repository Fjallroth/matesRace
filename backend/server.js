const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo")(session);
const flash = require("express-flash");
const logger = require("morgan");
const connectDB = require("./config/database");
const mainRoutes = require("./routes/main");
const raceRoutes = require("./routes/raceMates");
let cors = require("cors");
const path = require("path");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { ensureAuth } = require("./middleware/auth");
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

app.use((req, res, next) => {
  console.log(req.session); //check if this works with JWT
  next();
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
