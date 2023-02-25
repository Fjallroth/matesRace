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
            const races = await Races.find({userId:req.user.id})
            res.json({ races })        
        }catch(err){
            console.log(err)
            res.status(500).json({ message: 'Server Error' });
        }
    },
     planRace: async (req, res)=>{
        console.log(req.body)
    //     try{
    //         await Races.create({Race: req.body, userId: req.user.id}) //change req.body
    //         console.log('Race has been added!')
    //         res.redirect('/todos')
        // }catch(err){
        //     console.log(err)
        //     res.status(500).json({ message: 'Server Error' });
        // }
    },
    joinRace: async (req, res)=>{
        console.log(req.body)
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