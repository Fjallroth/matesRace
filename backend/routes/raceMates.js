const express = require('express')
const router = express.Router()
const raceController = require('../controllers/matesRace') 
const { ensureAuth } = require('../middleware/auth')

router.get('/', ensureAuth, raceController.getRaces)

router.post('/planRace', ensureAuth, raceController.createNewRace)

router.put('/joinRace', ensureAuth, raceController.joinRace)

router.get('/selectRide', ensureAuth, raceController.selectRide)

router.put('/submitRide', ensureAuth, raceController.submitRide)

router.get('/linkStrava', ensureAuth, raceController.linkStrava)

router.get('/StravaCallback', ensureAuth, raceController.stravaCallback)

//delete ride? 


module.exports = router