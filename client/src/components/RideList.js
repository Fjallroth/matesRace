import React from 'react'
import Button from './Button'

function toHoursAndMinutes(totalSeconds) {
  const totalMinutes = Math.floor(totalSeconds / 60);

  const seconds = totalSeconds % 60;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if(hours == 0 && minutes == 0){
    return `${seconds}s`;
  }
  else if(hours == 0 ){
    return `${minutes}m${seconds}s`;
  }
  else{
  return `${hours}hr${minutes}m${seconds}s`;
}
}
const RideList = ({rides}) => {
  return (
    <div>
      {rides.map((ride) => (
        <div key={Math.floor(Math.random()* 100000)}>
          <h2>{ride.name}</h2>
          <table>
            <tr>
              <th>Segment</th>
              <th>Segment time</th>
            </tr>
          {ride.segments.map( segment =>
          <tr>
              <td>{segment.name}</td>
              <td>{toHoursAndMinutes(segment.segmentTime)}</td>
          </tr>
            )}
          </table>
          <Button color="green" text="Select this ride"/>
        </div>
      ))}
    </div>
  )
}

export default RideList
