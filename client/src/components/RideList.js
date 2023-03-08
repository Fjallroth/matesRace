import React from 'react'
import Button from './Button'

const RideList = ({rides}) => {
  return (
    <div>
      {rides.map((ride) => (
        <div key={Math.floor(Math.random()* 100000)}>
          <h2>{ride.name}</h2>
          <p>{ride.segments.name}</p>
          <p>{ride.segments.segmentTime}</p>
          <Button color="green" text="Select this ride"/>
        </div>
      ))}
    </div>
  )
}

export default RideList
