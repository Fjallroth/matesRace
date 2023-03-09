import React from 'react'
import Button from './Button'

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
              <td>{segment.segmentTime}</td>
            
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
