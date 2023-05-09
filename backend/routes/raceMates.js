const express = require("express");
const router = express.Router();
const raceController = require("../controllers/raceMates");
const homeController = require("../controllers/home");

const { ensureAuth } = require("../middleware/auth");

router.get("/", homeController.getReact);

router.get("/races", ensureAuth, raceController.getRaces);

router.post("/planRace", ensureAuth, raceController.planRace);

router.put("/joinRace", ensureAuth, raceController.joinRace);

router.put(
  "/approveJoin/:raceId/:userId",
  ensureAuth,
  raceController.approveJoin
);

router.post("/selectRide", ensureAuth, raceController.selectRide);

router.put("/submitRide", ensureAuth, raceController.submitRide);

router.get("/linkStrava", ensureAuth, raceController.linkStrava);

router.get("/stravaCallback", ensureAuth, raceController.stravaCallback);

//delete ride?

module.exports = router;
