const express = require('express')
const router = express.Router()
const raceController = require('../controllers/raceMates') 
const homeController = require('../controllers/home')

const { ensureAuth } = require('../middleware/auth')

router.get('/', homeController.getReact)

router.get('/races', raceController.getRaces)

router.post('/planRace', raceController.planRace) // add ensure Auth

router.put('/joinRace', raceController.joinRace) // add ensure Auth

router.get('/selectRide', ensureAuth, raceController.selectRide)

router.put('/submitRide', ensureAuth, raceController.submitRide)

router.get('/linkStrava', ensureAuth, raceController.linkStrava)

router.get('/StravaCallback', ensureAuth, raceController.stravaCallback)

//delete ride? 


module.exports = router