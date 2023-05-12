const axios = require("axios");
const Races = require("../models/Race");
const User = require("../models/User");
const moment = require("moment");
require("dotenv").config({ path: "./config/.env" });
const STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID;
const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;
const callbackURL = "https://mates-race.vercel.app/raceMates/stravaCallback";

const getUserRefresh = async (user) => {
  console.log(user);
  return new Promise(async (resolve, reject) => {
    try {
      if (!user || !user.usertokenExpire) {
        console.log("No token expiry found. Please link Strava.");
        resolve();
        return;
      }
      const now = moment().unix();
      if (now >= user.usertokenExpire) {
        console.log("token expired");
        console.log(user.userStravaAccess);
        try {
          const { data } = await axios.post(
            "https://www.strava.com/oauth/token",
            {
              client_id: process.env.STRAVA_CLIENT_ID,
              client_secret: process.env.STRAVA_CLIENT_SECRET,
              grant_type: "refresh_token",
              refresh_token: user.userStravaRefresh,
            }
          );
          console.log(data);
          console.log(user._id);
          const updatedUser = await User.findOneAndUpdate(
            { _id: user._id },
            {
              userStravaAccess: data.access_token,
              userStravaRefresh: data.refresh_token,
              usertokenExpire: data.expires_at,
            },
            { new: true }
          );

          console.log("Updated User:", updatedUser);
        } catch (error) {
          console.error("Error refreshing Strava token:", error.message);
          throw error;
        }
      } else {
        console.log(now);
        console.log(user.usertokenExpire);
        console.log("token valid");
        resolve();
        return;
      }
    } catch (error) {
      reject(error);
    }
  });
};

async function getUserData(userid, userStravaToken) {
  try {
    const response = await axios.post(
      `https://www.strava.com/oauth/token?client_id=${STRAVA_CLIENT_ID}&client_secret=${STRAVA_CLIENT_SECRET}&code=${userStravaToken}&grant_type=authorization_code`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    const data = response.data;
    updateUserWithData(data, userid);
    return response.data;
  } catch (err) {
    console.log(err);
    return null;
  }
}
async function updateUserWithData(data, userid) {
  await User.findOneAndUpdate(
    { _id: userid },
    {
      userStravaAccount: data.athlete.id,
      userStravaAccess: data.access_token,
      userStravaFirstName: data.athlete.firstname,
      userStravaLastName: data.athlete.lastname,
      userStravaRefresh: data.refresh_token,
      userStravaPic: data.athlete.profile,
      usertokenExpire: data.expires_at,
      userSex: data.athlete.sex,
    },
    {
      new: true,
    }
  );
}
const approveJoinRequest = async (raceId, userId) => {
  const race = await Races.findById(raceId);
  const userName = await User.findOne({ _id: userId });

  race.joinRequests = race.joinRequests.filter(
    (request) => request.toString() !== userId
  );

  race.participants.push({
    user: userId,
    userName: userName,
    submittedRide: false,
  });

  await race.save();
};

module.exports = {
  approveJoin: async (req, res) => {
    try {
      const race = await Races.findById(req.params.raceId);
      const user = await User.findById(req.params.userId);

      if (!race || !user) {
        return res.status(404).json({ message: "Race or User not found" });
      }

      await approveJoinRequest(req.params.raceId, req.params.userId);
      res.status(200).json({ message: "Join request approved." });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  getRaces: async (req, res) => {
    await getUserRefresh(req.user);
    console.log(req.user);
    try {
      const races = await Races.find({
        $or: [
          { "participants.user": req.user.id },
          { joinRequests: req.user.id },
        ],
      })
        .populate("joinRequests", "_id")
        .sort({ startDate: 1 });
      console.log(races);
      res.json({ races: races, user: req.user.id });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server Error" });
    }
  },
  planRace: async (req, res) => {
    if (!req.user || !req.user.property) {
      return res
        .status(400)
        .json({ error: "User data is missing or incomplete" });
    }
    if (!req.user.userStravaAccess) {
      res.status(401).json({ message: "Strava is not yet linked" });
      return;
    }
    try {
      let segmentArray = req.body.segments.split(",");
      let getSegmentObj = async function (segmentArray) {
        let segmentObjs = [];
        for (let i = 0; i < segmentArray.length; i++) {
          const segmentId = segmentArray[i];
          const response = await axios.get(
            `https://www.strava.com/api/v3/segments/${segmentId}`,
            {
              headers: {
                Authorization: `Bearer ${req.user.userStravaAccess}`,
              },
            }
          );
          const segmentName = response.data.name;
          let segObj = {
            segment: segmentArray[i],
            segmentName: segmentName,
            segmentTime: "",
          };
          segmentObjs.push(segObj);
        }
        return segmentObjs;
      };

      const segments = await getSegmentObj(segmentArray);

      await Races.create({
        organiserID: req.user.id,
        raceName: req.body.raceName,
        startDate: Math.floor(
          new Date(req.body.startDay).getTime() / 1000
        ).toFixed(0),
        endDate: Math.floor(
          (new Date(req.body.endDay).getTime() / 1000).toFixed(0)
        ),
        segments: segmentArray,
        raceInfo: req.body.raceInfo,
        partPass: req.body.partPass,
        participants: [
          {
            user: req.user.id,
            userName: req.user.userName,
            segments: segments,
            submittedRide: false,
          },
        ],
      });

      console.log("Race has been added!");
      res.json("Race Created!");
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server Error" });
    }
  },
  joinRace: async (req, res) => {
    try {
      const race = await Races.findOne({
        _id: req.body.raceID,
        partPass: req.body.racePassword,
      });

      if (race.participants.find((o) => o.user == req.user.id)) {
        console.log("already participating");
        res.json({ message: "User is already participating" });
      } else if (race.joinRequests.includes(req.user.id)) {
        console.log("Join request already submitted");
        res.json({ message: "Join request already submitted" });
      } else {
        await Races.findByIdAndUpdate(
          { _id: req.body.raceID, partPass: req.body.racePassword },
          { $addToSet: { joinRequests: req.user.id } }
        );
        console.log("Join request submitted");
        res.json({ message: "Join request submitted" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server Error" });
    }
  },
  selectRide: async (req, res) => {
    console.log(req.cookies);
    console.log(req.body);
    try {
      const raceSegments = req.body.segments.map((e) => parseInt(e));
      const response = await axios.get(
        `https://www.strava.com/api/v3/athlete/activities?after=${req.body.startDate}&before=${req.body.endDate}&access_token=${req.user.userStravaAccess}`
      );
      const rides = response.data;
      const rideid = rides.map((e) => e.id);
      async function ridesegs(rideid) {
        const rideResponse = await axios.get(
          `https://www.strava.com/api/v3/activities/${rideid}?access_token=${req.user.userStravaAccess}`
        );
        const ride = rideResponse.data;
        const matchingSegments = rideResponse.data.segment_efforts
          .map((e) =>
            raceSegments.includes(e.segment.id)
              ? { id: e.segment.id, name: e.name, segmentTime: e.elapsed_time }
              : undefined
          )
          .filter((e) => e !== undefined);
        if (matchingSegments.length >= raceSegments.length) {
          return {
            name: ride.name,
            id: ride.id,
            matchingSegments: matchingSegments,
            segment_efforts: ride.segment_efforts,
            type: ride.type,
          };
        } else {
          return false;
        }
      }
      const promises = rideid.map((e) => ridesegs(e));
      const results = await Promise.all(promises);
      const fullRideDetails = results.map((result) =>
        result !== false
          ? result
          : "this ride does not have all of the segments"
      );
      console.log(fullRideDetails);
      res.json({ rides: fullRideDetails });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server Error" });
    }
  },

  submitRide: async (req, res) => {
    console.log("Authenticated user:", req.user);
    const user = req.user.id;

    try {
      //get segments from ride
      await Races.findOneAndUpdate(
        { _id: req.body.raceId, "participants.user": user },
        {
          $set: {
            "participants.$[elem].segments": req.body.segments,
            "participants.$[elem].submittedRide": true,
          },
        },
        { arrayFilters: [{ "elem.user": user }], new: true }
      );
      console.log("ride selected");
      res.json({ updated: true });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server Error" });
    }
  },
  approveJoinRequest: async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.params.userId });
      const userId = req.user.id;
      const raceId = req.body.raceId;
      const participantId = req.body.participantId;

      try {
        // Check if the user is the race organizer
        const race = await Races.findById(raceId);
        if (!race) {
          return res.status(404).json({ message: "Race not found" });
        }
        if (race.organiserID !== userId) {
          return res
            .status(403)
            .json({ message: "Only the organizer can approve join requests" });
        }

        // Check if the join request exists
        if (!race.joinRequests.includes(participantId)) {
          return res.status(404).json({ message: "Join request not found" });
        }

        // Add participant to the race
        await Races.findByIdAndUpdate(
          raceId,
          { $addToSet: { participants: participantId } },
          { new: true }
        );

        // Remove the join request from the race
        await Races.findByIdAndUpdate(
          raceId,
          { $pull: { joinRequests: participantId } },
          { new: true }
        );

        console.log("Join request approved");
        res.json({ message: "Join request approved" });
      } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).send("Error approving join request");
    }
  },

  linkStrava: (req, res, next) => {
    if (req.user) {
      console.log(req.user);
      console.log("linkStrava");
      const url = `https://www.strava.com/oauth/authorize?client_id=${STRAVA_CLIENT_ID}&redirect_uri=${callbackURL}&response_type=code&scope=activity:read_all&state=${req.user.id}`;
      console.log(url);
      return res.redirect(301, url);
    }
    //res.redirect('/raceMates')
  },
  stravaCallback: async (req, res, next) => {
    console.log(req.query.state);
    try {
      console.log(req.query.code);
      console.log(req.session);
      await User.findOneAndUpdate(
        { _id: req.query.state },
        {
          userStravaToken: req.query.code,
        }
      );
    } catch (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
    const token = req.session.token || req.cookies.token;
    if (!token) {
      console.error("No token found in session or cookies");
      res.sendStatus(500);
      return;
    }
    const userid = req.query.state;
    const userStravaToken = req.query.code;
    getUserData(userid, userStravaToken);
    res.redirect("/raceMates");
  },
};
