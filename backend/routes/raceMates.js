const express = require('express')
const router = express.Router()
const raceController = require('../controllers/raceMates') 
const homeController = require('../controllers/home')

const { ensureAuth } = require('../middleware/auth')

router.get('/', ensureAuth, homeController.getReact)

router.get('/races', raceController.getRaces)

router.post('/planRace', raceController.planRace) // add ensure Auth

router.put('/joinRace', raceController.joinRace) // add ensure Auth

router.post('/selectRide', raceController.selectRide)

router.put('/submitRide',  raceController.submitRide)

router.get('/linkStrava',  raceController.linkStrava)

router.get('/stravaCallback',  raceController.stravaCallback)

//delete ride? 


module.exports = router