const axios = require('axios')
const Races = require('../models/Race')
const User = require('../models/User')
const moment = require('moment');
const qs = require('qs');
const { base } = require('../models/Race');
require('dotenv').config({path: './config/.env'})
const STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID 
const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET 
const callbackURL = 'http://127.0.0.1:2121/raceMates/stravaCallback'

async function getUserRefresh(userid, userStravaToken, userTokenExpire) {
    const now = moment().unix();
    if (now < userTokenExpire) {
      // Access token is still valid
      return;
    }
    // Access token has expired, refresh it
    const response = await axios.post(`https://www.strava.com/oauth/token?client_id=${STRAVA_CLIENT_ID}&client_secret=${STRAVA_CLIENT_SECRET}&code=${userStravaRefresh}&grant_type=refresh_token`, qs.stringify({
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    const data = response.data;
    await updateUserWithData(data, userid);
}

// async function getUserRefreshWithRefreshToken(userid, userStravaRefresh){
//     await fetch(`https://www.strava.com/oauth/token?client_id=${STRAVA_CLIENT_ID}&client_secret=${STRAVA_CLIENT_SECRET}&code=${userStravaRefresh}&grant_type=refresh_token`, {
//       method: 'POST',
//       headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json'
//       }
//     })
//     .then(res => res.json())
//     .then(data =>{updateUserWithData(data, userid)})
// }

async function getUserData(userid, userStravaToken) {
  try {
    const response = await axios.post(
      `http://www.strava.com/oauth/token?client_id=${STRAVA_CLIENT_ID}&client_secret=${STRAVA_CLIENT_SECRET}&code=${userStravaToken}&grant_type=authorization_code`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );
    const data = response.data;
    updateUserWithData(data, userid);
  } catch (err) {
    console.log(err);
  }}
async function updateUserWithData(data, userid){
        await User.findOneAndUpdate({_id:userid}, {
        userStravaAccount: data.athlete.id, 
        userStravaAccess: data.access_token, 
        userStravaFirstName: data.athlete.firstname,
        userStravaLastName: data.athlete.lastname,
        userStravaRefresh: data.refresh_token,
        userStravaPic: data.athlete.profile,
        usertokenExpire: data.expires_at,
        userSex: data.athlete.sex
      },{
        new: true})
         
    }

module.exports = {
    getRaces: async (req, res) => {
        const now = moment().unix();
        const { userStravaRefresh, userTokenExpire } = req.user;
        if (now >= userTokenExpire) {
          await getUserRefresh(req.user.id, userStravaRefresh);
        }
        console.log(req.user);
        try {
          const races = await Races.find({ "participants.user": req.user.id });
          console.log({ races });
          res.json({ "races": races , "user": req.user.id });
        } catch (err) {
          console.log(err);
          res.status(500).json({ message: 'Server Error' });
        }
      },
      planRace: async (req, res)=>{
        console.log(req.body);
        console.log(req.user._id);
        if (!req.user.userStravaAccess) {
          res.status(400).json({ message: 'Strava is not yet linked' });
          return;
        }
        try {
          let segmentArray = req.body.segments.split(',');
          let getSegmentObj = async function(segmentArray) {
            let segmentObjs = [];
            for (let i = 0; i < segmentArray.length; i++) {
              const segmentId = segmentArray[i];
              const response = await axios.get(`https://www.strava.com/api/v3/segments/${segmentId}`, {
                headers: {
                  'Authorization': `Bearer ${req.user.userStravaAccess}`
                }
              });
              const segmentName = response.data.name;
              let segObj = {"segment": segmentArray[i], "segmentName": segmentName, "segmentTime": ""};
              segmentObjs.push(segObj);
            }
            return segmentObjs;
            
          };
      
          const segments = await getSegmentObj(segmentArray);
      
          await Races.create({
            organiserID: req.user.id, 
            raceName: req.body.raceName,
            startDate: Math.floor(new Date(req.body.startDay).getTime()/1000).toFixed(0),
            endDate: Math.floor((new Date(req.body.endDay).getTime()/1000).toFixed(0)),
            segments: segmentArray,
            raceInfo: req.body.raceInfo,
            partPass: req.body.partPass,
            participants: [{"user": req.user.id, "userName": req.user.userName, "segments": segments, "submittedRide": false}]
          });
      
          console.log('Race has been added!');
          res.json("Race Created!");
        } catch(err) {
          console.log(err);
          res.status(500).json({ message: 'Server Error' });
        }
      },
      joinRace: async (req, res) => {
        try {
          const race = await Races.findOne({ _id: req.body.raceID, partPass: req.body.racePassword });
      
          if (race.participants.find(o => o.user == req.user.id)) {
            console.log("already participating");
            res.json({ message: 'User is already participating' });
          } else if (race.joinRequests.includes(req.user.id)) {
            console.log("Join request already submitted");
            res.json({ message: 'Join request already submitted' });
          } else {
            await Races.findByIdAndUpdate(
              { _id: req.body.raceID, partPass: req.body.racePassword },
              { $addToSet: { joinRequests: req.user.id } }
            );
            console.log("Join request submitted");
            res.json({ message: 'Join request submitted' });
          }
        } catch (err) {
          console.log(err);
          res.status(500).json({ message: 'Server Error' });
        }
      },

    selectRide: async (req, res) => {
        try {
          const raceSegments = req.body.segments.map(e => parseInt(e))
          const response = await axios.get(`https://www.strava.com/api/v3/athlete/activities?after=${req.body.startDate}&before=${req.body.endDate}&access_token=${req.user.userStravaAccess}`);
          const rides = response.data;
          const rideid = rides.map(e => (e.id))
          async function ridesegs(rideid){
            const rideResponse = await axios.get(`https://www.strava.com/api/v3/activities/${rideid}?access_token=${req.user.userStravaAccess}`)
            const ride = rideResponse.data;
            const matchingSegments = rideResponse.data.segment_efforts.map(e => (raceSegments.includes(e.segment.id))? {"id": e.segment.id, "name": e.name, "segmentTime": e.elapsed_time} : undefined).filter(e => e !== undefined)
            if(matchingSegments.length >= raceSegments.length){
            return {
              name: ride.name,
              id: ride.id,
              matchingSegments: matchingSegments,
              segment_efforts: ride.segment_efforts,
              type: ride.type
            }
          }
          else{
            return false
          }
        }
        const promises = rideid.map(e => ridesegs(e))
        const results = await Promise.all(promises)
        const fullRideDetails = results.map(result => result !== false ? result: ("this ride does not have all of the segments"))
          console.log(fullRideDetails)
          res.json({"rides": fullRideDetails});
        } catch(err) {
          console.log(err);
          res.status(500).json({ message: 'Server Error' });
        }
      },
    //     if(req.user.userStravaAccess !== undefined){
    //         console.log((`https://www.strava.com/api/v3/athlete/activities?after=1675267823&access_token=${req.user.userStravaAccess}`))
    //         const res = await fetch(`https://www.strava.com/api/v3/athlete/activities?after=1675267823&access_token=${req.user.userStravaAccess}`) 
    //         const data = await res.json() //pass in the race start datetime
    // } 
    // else{
    //     res.redirect('linkStrava')
    // }
    
    submitRide: async (req, res)=>{
        const user = req.user.id

        try{
            //get segments from ride
            await Races.findOneAndUpdate(
                 {_id:req.body.raceId, "participants.user": user},
                 { $set: { "participants.$[elem].segments": req.body.segments,
                 "participants.$[elem].submittedRide": true } },
                 { arrayFilters: [ { "elem.user": user } ], new: true }
            )
            console.log("ride selected")
            res.json({"updated": true})
        }catch(err){
            console.log(err)
            res.status(500).json({ message: 'Server Error' });
        }
    },
    approveJoinRequest: async (req, res) => {
      const userId = req.user.id;
      const raceId = req.body.raceId;
      const participantId = req.body.participantId;
    
      try {
        // Check if the user is the race organizer
        const race = await Races.findById(raceId);
        if (!race) {
          return res.status(404).json({ message: 'Race not found' });
        }
        if (race.organiserID !== userId) {
          return res.status(403).json({ message: 'Only the organizer can approve join requests' });
        }
    
        // Check if the join request exists
        if (!race.joinRequests.includes(participantId)) {
          return res.status(404).json({ message: 'Join request not found' });
        }
    
        // Add participant to the race
        await Races.findByIdAndUpdate(
          raceId,
          { $addToSet: { participants: { user: participantId } } },
          { new: true }
        );
    
        // Remove the join request from the race
        await Races.findByIdAndUpdate(
          raceId,
          { $pull: { joinRequests: participantId } },
          { new: true }
        );
    
        console.log("Join request approved");
        res.json({ message: 'Join request approved' });
      } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server Error' });
      }
    },
    
    linkStrava: (req, res, next) => {
        if (req.user) {
            console.log(req.user)
            console.log("linkStrava")
            const url =(`https://www.strava.com/oauth/authorize?client_id=${STRAVA_CLIENT_ID}&redirect_uri=${callbackURL}&response_type=code&scope=activity:read_all&state=${req.user.id}`)
            console.log(url)
            return res.redirect(301, url)
            }
          //res.redirect('/raceMates')

          
        },
      stravaCallback: async (req, res, next) => {
        console.log(req.query.state)
        try{
            console.log(req.query.code)
            console.log(req.session)
            await User.findOneAndUpdate({_id:req.query.state},{
                userStravaToken: req.query.code
            })
        }
        catch(err){
            console.log(err)
            res.sendStatus(500);
            return;
        } 
        const userid = req.query.state
        const userStravaToken = req.query.code
        getUserData(userid, userStravaToken)
        res.redirect('/raceMates')
    }}       