const Races = require('../models/Race')
const User = require('../models/User')
require('dotenv').config({path: './config/.env'})
const STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID 
const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET 
const callbackURL = 'http://127.0.0.1:2121/todos/StravaCallback'//change this

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
            res.json({"races": races })       
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
                            participants: [{"user": req.user.id, "userName": req.user.userName, "segments": getSegmentObj(segmentArray)}]
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
            console.log(races.participants) 
            let getSegmentObj = function(segmentArray) {
                let segmentObjs = []
                for(let i=0; i<segmentArray.length ; i++){
                    let segObj = {"segment": segmentArray[i], "segmentTime": ""}
                    segmentObjs.push(segObj)
                }
                return segmentObjs
            }
            const newPart = {"user": req.user.id, "userName": req.user.userName, "segments": getSegmentObj(races.segments)}
            await Races.findOneAndUpdate({"_id": req.body.raceID, "partPass": req.body.racePassword},
                        { $push: { participants: newPart }}
                     )
            res.json({races})       
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
    selectRide: async (req, res) =>{
        const userid = req.user.id //how to get userid from react? add start time and end time to fetch
    await fetch(`https://www.strava.com/api/v3/athlete/activities?access_token=${req.user.userStravaAccess}`)
    .then(res => res.json())
    .then(data=> listActivities(data, userid) )
    res.json({ data })
    },
    submitRide: async (req, res)=>{
        try{
            //get segments from ride
            await Races.findOneAndUpdate({_id:req.body},{ //find the race the user wants to send data to
                raceEntries: "xyz" //add user results to participant list
            })
            res.json('Results submitted')
        }catch(err){
            console.log(err)
            res.status(500).json({ message: 'Server Error' });
        }
    },
    linkStrava: (req, res, next) => {
        if (req.user) {
            console.log(req.session)
            const state = req.sessionID;
            return res.redirect(`http://www.strava.com/oauth/authorize?client_id=${STRAVA_CLIENT_ID}&redirect_uri=${callbackURL}&response_type=code&scope=activity:read_all&state=${state}`)
            }
            console.log(req.sessionID)
          res.redirect('/todos')
        },
      stravaCallback: async (req, res, next) => {
        console.log(req.sessionID)
        try{
            console.log(req.query.code)
            console.log(req.session)
            await User.findOneAndUpdate({_id:req.user.id},{
                userStravaToken: req.query.code
            })
        }
        catch(err){
            console.log(err)
            res.sendStatus(500);
            return;
        } 
        const userid = req.user.id
        const userStravaToken = req.query.code
        getUserData(userid, userStravaToken)
        res.redirect('/todos') //change
    }}       