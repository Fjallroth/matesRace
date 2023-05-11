import Header from "./components/Header";
import Tasks from "./components/Tasks";
import { useState, useEffect } from "react";
import RaceContainer from "./components/RaceContainer";
import PlanRace from "./components/PlanRace";
import AddRace from "./components/AddRace";
import PrevRaceContainer from "./components/PrevRaceContainer";

const App = () => {
  const [showPlanRace, setshowPlanRace] = useState(false);
  const [showaddRace, setshowaddRace] = useState(false);
  const [rides, setRides] = useState([]);
  const [raceID, setRaceID] = useState([]);
  const [races, setTasks] = useState([]);
  const [userId, setUserId] = useState("");
  useEffect(() => {
    const getRaces = async () => {
      const racesFromServer = await fetchRace();
      console.log(racesFromServer);
      setTasks(racesFromServer.races);
      setUserId(racesFromServer.user);
    };
    getRaces();
  }, []);

  const updateRaces = async () => {
    const racesFromServer = await fetchRace();
    setTasks(racesFromServer.races);
    setUserId(racesFromServer.user);
  };

  const getLeaderboard = (race) => {
    if (!race || !race.participants || !race.segments) {
      return []; // Return an empty array if the race object is undefined or doesn't have the required properties
    }
    const participants = race.participants;

    // Build an array of segment names
    const segmentNames = race.segments.map((segment) => ({
      name: segment,
    }));

    // Add each participant's segment times to the array of segment names
    participants.forEach((participant) => {
      if (participant.segments) {
        participant.segments.forEach((segment, index) => {
          const segmentName = segmentNames[index].name;
          segmentNames[index][participant.userName] = segment.segmentTime;
        });
      }
    });

    // Calculate each participant's total time and seconds off leader
    const leaderboard = participants.map((participant) => {
      const totalTime = participant.segments
        ? participant.segments.reduce((acc, segment) => {
            return acc + segment.segmentTime;
          }, 0)
        : 0;

      const secondsOffLeader =
        totalTime -
        (participants[0].segments
          ? participants[0].segments.reduce((acc, segment) => {
              return acc + segment.segmentTime;
            }, 0)
          : 0);

      return {
        name: participant.userName,
        totalTime: totalTime,
        diffToLeader: secondsOffLeader,
        segments: segmentNames.map((segmentName) => {
          return {
            name: segmentName.name,
            time: segmentName[participant.userName],
          };
        }),
      };
    });

    // Sort the leaderboard by total time
    leaderboard.sort((a, b) => {
      return a.totalTime - b.totalTime;
    });

    return leaderboard;
  };

  const fetchRace = async () => {
    try {
      const res = await fetch("/raceMates/races");
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Failed to fetch races:", error);
      return { races: [] };
    }
  };

  const planRace = async (race) => {
    console.log(race);
    const res = await fetch(`/raceMates/planRace`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(race),
    });
    await res.json();
    await updateRaces();
  };
  const addRace = async (race) => {
    console.log(race);
    const res = await fetch(`/raceMates/joinRace`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(race),
    });
    await res.json();
    await updateRaces();
  };
  const fetchRide = async (race) => {
    console.log(race);
    console.log(race._id);
    const res = await fetch("/raceMates/selectRide", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(race),
    });
    const data = await res.json();
    const displayData = data.rides.map((e) => ({
      name: e.name,
      segments: e.matchingSegments,
      raceId: race._id,
    }));
    console.log(displayData);
    setRides(displayData);
    setRaceID(race._id);
  };
  const selectRide = async (ride) => {
    console.log(ride);
    const res = await fetch("/raceMates/submitRide", {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(ride),
    });
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-400 rounded-md">
      <div className=" z-10 py-2 bg-white shadow-md container my-5 mx-auto px-4 sm:px-6 lg:px-8 text-purple-600 dark:text-purple-300 rounded-md">
        <Header
          class="rounded-md flex align-end px-10"
          buttonTitle="Plan a race"
          title={"Welcome to mates race"}
          onAdd={() => setshowPlanRace(!showPlanRace)}
          showAdd={showPlanRace}
        />
        {showPlanRace && <PlanRace onAdd={planRace} />}
      </div>
      <div className="rounded-md z-5 py-5 bg-white shadow-md container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center h-full text-purple-600 dark:text-purple-300 my-2">
        <RaceContainer
          title={"Your upcoming races"}
          buttonTitle={"Join a race"}
          onAdd={() => setshowaddRace(!showaddRace)}
          showAdd={showaddRace}
        />
        {showaddRace && <AddRace onAdd={addRace} />}
        <div className="py-10 w-full">
          {races.length > 0 ? (
            <Tasks
              races={races}
              rides={rides}
              raceID={raceID}
              fetchRide={fetchRide}
              selectRide={selectRide}
              getLeaderboard={(race) => getLeaderboard(race)}
              userId={userId}
            />
          ) : (
            "You have no upcoming races"
          )}
        </div>
        <div id="ride-details"></div>
      </div>
    </div>
  );
};

export default App;
