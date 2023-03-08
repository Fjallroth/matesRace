//rafce
import Race from "./Task"
const Tasks = ({races, rides, raceID, onDelete, onToggle, fetchRide}) => {
  
  return (
    <>
      
       {races.map((race) => (
        <Race
          key={race._id}
          race={race}
          rides={rides}
          raceID={raceID}
          raceName={race.raceName}
          startDay={race.startDate}
          endDay={race.endDate}
          segments={race.segments}
          participants={race.participants}
          onDelete={onDelete}
          onToggle={onToggle}
          fetchRide={fetchRide}
        />))
        } 
        
    </>
  )
}

export default Tasks
