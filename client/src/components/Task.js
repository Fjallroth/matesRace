import React from 'react'
import {FaTimes} from 'react-icons/fa'
import Button from './Button'
import RideList from './RideList';

const Race = ({ race, rides, raceID, onDelete, onToggle, fetchRide, selectRide}) => {
  return (
    <div className={`race ${race.reminder ? 'reminder' : ''}`} onDoubleClick={() => onToggle(race._id)}>
      <h3>
        {race.raceName}{' '}
        <FaTimes
          style={{ color: 'red', cursor: 'pointer' }}
          onClick={() => onDelete(race._id)}
        />
      </h3>
      <p>{race.segments.join(', ')}</p>
      <Button color="green" text="Upload ride" onClick={() => {
        fetchRide(race)}}/>
        {rides?.length > 0 && raceID == race._id && <RideList rides={rides} selectRide={selectRide} />}
      
    </div>
  );
};
export default Race
