import React from "react";
import Button from "./Button";

function toHoursAndMinutes(totalSeconds) {
  const totalMinutes = Math.floor(totalSeconds / 60);

  const seconds = totalSeconds % 60;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours == 0 && minutes == 0) {
    return `${seconds}s`;
  } else if (hours == 0) {
    return `${minutes}m${seconds}s`;
  } else {
    return `${hours}hr${minutes}m${seconds}s`;
  }
}

const RideList = ({ rides, selectRide }) => {
  let count = 0;
  const rideListItems = rides.map((ride) => {
    if (ride.segments) {
      count += 1;
      return (
        <div
          className="rounded-md m-2 p-5 bg-white"
          key={Math.floor(Math.random() * 100000)}
        >
          <div className="flex flex-col items-center justify-center mb-4">
            <h2 className="text-base font-bold text-purple-800">{ride.name}</h2>
            <table className="w-full whitespace-no-wrap text-center text-gray-500">
              <tr className="text-s font-semibold tracking-wide text-center  uppercase border-b">
                <th>Segment</th>
                <th>Segment time</th>
              </tr>
              {ride.segments.map((segment) => (
                <tr key={segment.name}>
                  <td>{segment.name}</td>
                  <td>{toHoursAndMinutes(segment.segmentTime)}</td>
                </tr>
              ))}
            </table>
          </div>
          <div className="flex justify-end">
            <Button
              color="bg-purple-300 text-gray-700 rounded-md p-1"
              onClick={() => {
                selectRide(ride);
              }}
              text="Select this ride"
            />
          </div>
        </div>
      );
    }
    return null;
  });

  return (
    <div>
      {rideListItems}
      {count < 1 && <p>You have no applicable rides.</p>}
    </div>
  );
};

export default RideList;
