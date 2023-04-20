import React from 'react';

const Leaderboard = ({ race, sortKey, setSortKey, sortedLeaderboard }) => {
  return (
    <>
      <h2 className="text-gray-700">Leaderboard:</h2>
      <table className="w-full whitespace-no-wrap">
        <thead>
          <tr className="text-xs font-semibold tracking-wide text-center text-gray-500 uppercase border-b">
            <th>Rank</th>
            <th>Name</th>
            {race.participants.length > 0 &&
              race.participants[0].segments.map((segment, index) => (
                <th key={index} onClick={() => setSortKey(`segment-${index}`)}>
                  {segment.name}
                </th>
              ))}
            <th onClick={() => setSortKey('totalTime')}>Total Time</th>
            <th onClick={() => setSortKey('diffToLeader')}>Behind</th>
          </tr>
        </thead>
        <tbody className="text-xs tracking-wide text-center divide-y ">
          {sortedLeaderboard.map((participant, index) => (
            <tr key={index} className={`text-gray-700 ${
              index % 2 === 0 ? 'bg-gray-50 ' : ''
            }`}
          >
              <td>{index + 1}</td>
              <td>{participant.name}</td>
              {participant.segments.map((segment, index) => (
                <td key={index}>{segment.time}</td>
              ))}
              <td>{participant.totalTime}</td>
              <td>+{participant.diffToLeader}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Leaderboard;
