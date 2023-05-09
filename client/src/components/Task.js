import React from "react";
import Button from "./Button";
import RideList from "./RideList";
import { useState, useEffect } from "react";
import Leaderboard from "./Leaderboard";

const Race = ({
  race,
  rides,
  raceID,
  onDelete,
  getLeaderboard,
  fetchRide,
  selectRide,
  userId,
}) => {
  const [sortKey, setSortKey] = useState("totalTime");

  const sortLeaderboard = (leaderboard, key) => {
    const filteredLeaderboard = leaderboard.filter((participant) => {
      if (key.startsWith("segment")) {
        const index = parseInt(key.split("-")[1]);
        return participant.segments[index].time;
      } else {
        return participant[key];
      }
    });

    return filteredLeaderboard.sort((a, b) => {
      if (key.startsWith("segment")) {
        const index = parseInt(key.split("-")[1]);
        return a.segments[index].time - b.segments[index].time;
      } else {
        return a[key] - b[key];
      }
    });
  };
  const sortedLeaderboard = sortLeaderboard(getLeaderboard(race), sortKey);

  const isRideSubmitted = race.participants.some((participant) => {
    return participant.user === userId && participant.submittedRide;
  });

  const userIsInJoinRequests = race.joinRequests.includes(userId);

  const approveJoinRequest = async (raceId, userId) => {
    const token = localStorage.getItem("jwt");
    try {
      const response = await fetch(
        `/raceMates/approveJoin/${raceId}/${userId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to approve join request");
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  const ignoreJoinRequest = async (request) => {
    const token = localStorage.getItem("jwt");
    try {
      const updatedJoinRequests = race.joinRequests.filter(
        (request) => request._id !== userId
      );

      const response = await fetch(`/raceMates/races/${race._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ joinRequests: updatedJoinRequests }),
      });

      if (!response.ok) {
        throw new Error("Failed to ignore the join request");
      }

      // Reload the races to show the updated race
      window.location.reload();
    } catch (error) {
      console.error("Error ignoring join request:", error);
    }
  };

  return (
    <div className="rounded-md flex align-center m-2 p-5 bg-purple-200">
      <div className="w-full overflow-x-auto">
        {userIsInJoinRequests ? (
          <p className="rounded-md flex align-center m-2 p-5 bg-gray-200">
            Your join request has been sent and must be approved by the race
            organizer.
          </p>
        ) : (
          <>
            <div className="p-4">
              {isRideSubmitted ? (
                <h3 className="text-base font-bold text-purple-800">
                  {race.raceName}{" "}
                  <p className="text-gray-700">Ride submitted</p>
                </h3>
              ) : (
                <h3 className="text-base font-bold text-purple-800">
                  {race.raceName}
                </h3>
              )}
              <p className="text-gray-700 dark:text-gray-400">
                {race.segments &&
                  race.segments.map((segment, index) => (
                    <a
                      key={segment}
                      href={`https://www.strava.com/segments/${segment}`}
                      target="_blank"
                      className="text-purple-800"
                    >
                      {segment}
                      {index !== race.segments.length - 1 && ", "}
                    </a>
                  ))}
              </p>

              {race.organiserID == userId ? (
                <div className="rounded-md m-2 p-5 bg-gray-200 text-purple-800">
                  <h4 className="mb-2">
                    You are the race organiser, share these details with
                    participants:
                  </h4>
                  <div>
                    <p className="mb-2">Race ID: {race._id}</p>
                    <p>Password: {race.partPass}</p>
                  </div>
                </div>
              ) : (
                ""
              )}

              {race.organiserID === userId && race.joinRequests.length > 0 && (
                <div className="rounded-md flex align-center m-2 p-5 bg-gray-200">
                  <h4 className="text-gray-700">Join Requests:</h4>
                  {race.joinRequests.map((request) => (
                    <div
                      key={request._id}
                      className="flex items-center space-x-2"
                    >
                      <span className="text-gray-700">{request._id}</span>
                      <button
                        className="text-purple-600"
                        onClick={() =>
                          approveJoinRequest(race._id, request._id)
                        }
                      >
                        Approve
                      </button>
                      <button
                        className="text-base text-purple-800"
                        onClick={() => ignoreJoinRequest(request)}
                      >
                        Ignore
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <Leaderboard
                race={race}
                sortKey={sortKey}
                setSortKey={setSortKey}
                sortedLeaderboard={sortedLeaderboard}
              />

              {isRideSubmitted ? (
                <Button
                  color="bg-purple-300 text-gray-700 rounded-md p-1"
                  text="Submitted the wrong ride?"
                  onClick={() => {
                    fetchRide(race);
                  }}
                />
              ) : (
                <Button
                  color="bg-purple-300 text-gray-700 rounded-md p-1"
                  text="Upload ride"
                  onClick={() => {
                    fetchRide(race);
                  }}
                />
              )}

              {rides?.length > 0 && raceID == race._id && (
                <RideList rides={rides} selectRide={selectRide} />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Race;
