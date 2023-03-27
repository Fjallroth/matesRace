//rafce
import Race from "./Task"
const Tasks = ({races, rides, raceID, onDelete, onToggle, fetchRide,selectRide,getLeaderboard, userId}) => {
  
  return (
    <>
      
      {races.map((race) => (
  <Race
    key={race._id}
    race={race}
    rides={rides}
    raceID={raceID}
    onDelete={onDelete}
    onToggle={onToggle}
    fetchRide={fetchRide}
    selectRide={selectRide}
    userId={userId}
    getLeaderboard={getLeaderboard}
  />))
}
        
    </>
  )
}

export default Tasks
