const axios = require('axios')
const Races = require('../models/Race')
const User = require('../models/User')
require('dotenv').config({path: './config/.env'})
const STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID 
const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET 
const callbackURL = 'http://127.0.0.1:2121/raceMates/stravaCallback'//change this

async function getUserData(userid, userStravaToken){
    await fetch(`http://www.strava.com/oauth/token?client_id=${STRAVA_CLIENT_ID}&client_secret=${STRAVA_CLIENT_SECRET}&code=${userStravaToken}&grant_type=authorization_code`, {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
    })
    .then(res => res.json())
    .then(data =>{updateUserWithData(data, userid)})
    }
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
// async function getActivitySegments(data, userid){
//     //const userid = req.user.id
//     const activityID = //get activity ID
//     fetch(`https://www.strava.com/api/v3/activities/${activityID}?access_token=${req.user.userStravaAccess}`)
//     .then(res => res.json())
//     .then(data=> getEfforts(data, userid) ) }

    //this needs work
// async function getEfforts(data, userid){
//     const efforts = data.segment_efforts
//     if(typeof efforts !== "undefined"){
//         for(let i=0; i < efforts.length ; i++){ 
//             //change to update
//           await Race.create({
//               segmentId: efforts[i].segment.id, 
//               segmentName: efforts[i].segment.name, 
//               segmentTime: efforts[i].elapsed_time, 
//               completed: false, 
//               userId: userid})

//              console.log("effort added")
//           }}}

module.exports = {
    getRaces: async (req,res)=>{
        console.log(req.user)
        try{
            const races = await Races.find({"participants.user": req.user.id})
            console.log({"races": races })  
            res.json({"races": races , "user": req.user.id})       
        }catch(err){
            console.log(err)
            res.status(500).json({ message: 'Server Error' });
        }
    },
     planRace: async (req, res)=>{
        console.log(req.body)
        console.log(req.user._id)
         try{
            let segmentArray = req.body.segments.split(',')
            let getSegmentObj = function(segmentArray) {
                let segmentObjs = []
                for(let i=0; i<segmentArray.length ; i++){
                    let segObj = {"segment": segmentArray[i], "segmentTime": ""}
                    segmentObjs.push(segObj)
                }
                return segmentObjs
            }
            
          await Races.create({organiserID: req.user.id, 
                            raceName: req.body.raceName,
                            startDate: Math.floor(new Date(req.body.startDay).getTime()/1000).toFixed(0),
                            endDate: Math.floor((new Date(req.body.endDay).getTime()/1000).toFixed(0)),
                            segments: segmentArray,
                            raceInfo: req.body.raceInfo,
                            partPass: req.body.partPass,
                            participants: [{"user": req.user.id, "userName": req.user.userName, "segments": getSegmentObj(segmentArray), "submittedRide": false}]
                        }) 
             console.log('Race has been added!')
             res.redirect('/raceMates')
         }catch(err){
             console.log(err)
             res.status(500).json({ message: 'Server Error' });
         }
    },
    joinRace: async (req, res)=>{
        try{
            const races = await Races.findOne({"_id": req.body.raceID, "partPass": req.body.racePassword})
            let getSegmentObj = function(segmentArray) {
                let segmentObjs = []
                for(let i=0; i<segmentArray.length ; i++){
                    let segObj = {"segment": segmentArray[i], "segmentTime": ""}
                    segmentObjs.push(segObj)
                }
                return segmentObjs
            }
            if(races.participants.find(o => o.user == req.user.id)){
                console.log("already participating")
                res.json({ message: 'User is already participating' })    
            }
            else{
            const newPart = {"user": req.user.id, "userName": req.user.userName, "segments": getSegmentObj(races.segments), "submittedRide": false}
            await Races.findOneAndUpdate({"_id": req.body.raceID, "partPass": req.body.racePassword},
                        { $push: { participants: newPart }}
                     )
            console.log("adding user to race")
            res.json({races})   
        }    
        }catch(err){
            console.log(err)
            res.status(500).json({ message: 'Server Error' });
        }

        // try{
        //     await Races.findOneAndUpdate({_id:req.body},{ //find the race the user wants to join
        //         participants: "xyz" //add user ID to participant list
        //     })
        //     res.json('Joined Race!')
        // }catch(err){
        //     console.log(err)
        //     res.status(500).json({ message: 'Server Error' });
        // }
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
        res.redirect('/raceMates') //change
    }}       