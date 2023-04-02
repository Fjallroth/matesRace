import React from 'react';

const Leaderboard = ({ race, sortKey, setSortKey, sortedLeaderboard }) => {
  return (
    <>
      <h2>Leaderboard:</h2>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            {race.participants.length > 0 &&
              race.participants[0].segments.map((segment, index) => (
                <th key={index} onClick={() => setSortKey(`segment-${index}`)}>
                  {segment.name}
                </th>
              ))}
            <th onClick={() => setSortKey('totalTime')}>Total Time</th>
            <th onClick={() => setSortKey('diffToLeader')}>Diff to Leader</th>
          </tr>
        </thead>
        <tbody>
          {sortedLeaderboard.map((participant, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td></td>
              <td>{participant.name}</td>
              {participant.segments.map((segment, index) => (
                <td key={index}>{segment.time}</td>
              ))}
              <td>{participant.totalTime}</td>
              <td>{participant.diffToLeader}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Leaderboard;
