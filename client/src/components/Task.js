import React from 'react';
import { FaTimes } from 'react-icons/fa';
import Button from './Button';
import RideList from './RideList';
import {useState, useEffect} from 'react';
import Leaderboard from './Leaderboard';

const Race = ({ race, rides, raceID, onDelete, getLeaderboard, fetchRide, selectRide, userId }) => {
  const [sortKey, setSortKey] = useState('totalTime');

  const sortLeaderboard = (leaderboard, key) => {
    return leaderboard.slice().sort((a, b) => {
      if (key.startsWith('segment')) {
        const index = parseInt(key.split('-')[1]);
        return a.segments[index].time - b.segments[index].time;
      } else {
        return a[key] - b[key];
      }
    });
  };
  const sortedLeaderboard = sortLeaderboard(getLeaderboard(race), sortKey)

  const isRideSubmitted = race.participants.some(participant => {
    return participant.user === userId && participant.submittedRide;
  });
  return (
    <div >
      {isRideSubmitted ? (
        <h3>
          {race.raceName}{' '}
          <p style={{ color: 'blue' }}>Ride submitted</p>
        </h3>
      ) : (
        <h3>
          {race.raceName}{' '}
        </h3>
      )}
      <p>
        {race.segments &&
          race.segments.map((segment, index) => (
            <a key={segment} href={`https://www.strava.com/segments/${segment}`} target="_blank">
              {segment}
              {index !== race.segments.length - 1 && ', '}
            </a>
          ))}
      </p>

      {race.organiserID == userId ? (
        <h4>
          You are the race organiser, share these details with participants:
          <p>Race ID: {race._id}</p>
          <p>Password: {race.partPass}</p>
        </h4>
      ) : (
        ''
      )}
       <Leaderboard
      race={race}
      sortKey={sortKey}
      setSortKey={setSortKey}
      sortedLeaderboard={sortedLeaderboard}
    />
      {isRideSubmitted ? (
        <Button
          color="blue"
          text="Submitted the wrong ride?"
          onClick={() => {
            fetchRide(race);
          }}
        />
      ) : (
        <Button
          color="green"
          text="Upload ride"
          onClick={() => {
            fetchRide(race);
          }}
        />
      )}
      {rides?.length > 0 && raceID == race._id && <RideList rides={rides} selectRide={selectRide} />}
    </div>
  );
};

export default Race;