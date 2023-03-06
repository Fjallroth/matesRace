import React from 'react'
import {FaTimes} from 'react-icons/fa'
import Button from './Button'

const Race = ({ race, onDelete, onToggle, fetchRide }) => {
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
    </div>
  );
};
export default Race
