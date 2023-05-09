const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

router.get("/", homeController.getLanding);
router.get("/login", authController.getLogin);
router.post("/login", ensureAuth, authController.postLogin);
router.get("/logout", ensureAuth, authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);

module.exports = router;
