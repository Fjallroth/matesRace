import React from 'react'
import {FaTimes} from 'react-icons/fa'
import Button from './Button'
import RideList from './RideList';

const Race = ({ race, rides, raceID, onDelete, onToggle, fetchRide, selectRide, userId}) => {
  const isRideSubmitted = race.participants.some(participant => {
    return participant.user === userId && participant.submittedRide;})
  return (
    <div className={`race ${race.reminder ? 'reminder' : ''}`} onDoubleClick={() => onToggle(race._id)}>
      {isRideSubmitted ? (
        <h3>
        {race.raceName}{' '}
        <p style={{ color: 'blue'}} >Ride submitted</p>
      </h3>
      ): (
        <h3>
        {race.raceName}{' '}
      </h3>
      )}
      <p>
        {race.segments.map((segment, index) => (
    <a key={segment} href={`https://www.strava.com/segments/${segment}`} target="_blank">
       {segment}
       {index !== race.segments.length - 1 && ", "}
    </a>
  ))}
  </p>
      {race.organiserID==userId?(<h4>
        You are the race organiser, share these details with participants:
        <p>Race ID: {race._id}</p>
        <p>Password: {race.partPass}</p>
        </h4>):('')}
      {isRideSubmitted ? (
        <Button color="blue" text="Submitted the wrong ride?" onClick={() => {
          fetchRide(race)}}/>
      ) : (
        <Button color="green" text="Upload ride" onClick={() => {
          fetchRide(race)}}/>
      )}
        {rides?.length > 0 && raceID == race._id && <RideList rides={rides} selectRide={selectRide} />}
      
    </div>
  );
};
export default Race
