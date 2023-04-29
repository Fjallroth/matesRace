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
        <div key={Math.floor(Math.random() * 100000)}>
          <h2 className="text-base font-bold text-purple-800">{ride.name}</h2>
          <table>
            <tr>
              <th>Segment</th>
              <th>Segment time</th>
            </tr>
            {ride.segments.map((segment) => (
              <tr>
                <td>{segment.name}</td>
                <td>{toHoursAndMinutes(segment.segmentTime)}</td>
              </tr>
            ))}
          </table>
          <Button
            color="purple"
            onClick={() => {
              selectRide(ride);
            }}
            text="Select this ride"
          />
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

// import React from 'react';
// import Button from './Button';

// function toHoursAndMinutes(totalSeconds) {
//   const totalMinutes = Math.floor(totalSeconds / 60);

//   const seconds = totalSeconds % 60;
//   const hours = Math.floor(totalMinutes / 60);
//   const minutes = totalMinutes % 60;
//   if (hours === 0 && minutes === 0) {
//     return `${seconds}s`;
//   } else if (hours === 0) {
//     return `${minutes}m${seconds}s`;
//   } else {
//     return `${hours}hr${minutes}m${seconds}s`;
//   }
// }

// const RideList = ({ rides, selectRide }) => {
//   if (!rides) {
//     return <p>Loading rides...</p>;
//   }

//   const hasMatchingRides = rides.some(ride => ride.matchingSegments?.length > 0);

//   return (
//     <div>
//       {hasMatchingRides &&
//         rides.map((ride) => {
//           return (
//             <div key={Math.floor(Math.random() * 100000)}>
//               <h2>{ride.name}</h2>
//               <table>
//                 <thead>
//                   <tr>
//                     <th>Segment</th>
//                     <th>Segment time</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {ride.matchingSegments?.map((segment) => (
//                     <tr key={segment.id}>
//                       <td>{segment.name}</td>
//                       <td>{toHoursAndMinutes(segment.segmentTime)}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//               {ride.allSegmentsPresent ? (
//                 <Button
//                   color="green"
//                   onClick={() => {
//                     selectRide(ride);
//                   }}
//                   text="Select this ride"
//                 />
//               ) : (
//                 <p>
//                   Missing segments:{" "}
//                   {ride.missingSegments?.map((segment, index) => (
//                     <span key={segment.id}>
//                       {segment.id}
//                       {index < ride.missingSegments.length - 1 ? ", " : ""}
//                     </span>
//                   ))}
//                 </p>
//               )}
//             </div>
//           );
//         })}
//       {!hasMatchingRides && <p>You have no rides that match the criteria.</p>}
//     </div>
//   );
// };

// export default RideList;
