//rafce
import Race from "./Task"
const Tasks = ({races, rides, onDelete, onToggle, fetchRide}) => {
  
  return (
    <>
   
       {races.map((race) => (
        <Race
          key={race._id}
          race={race}
          rides={rides}
          raceName={race.raceName}
          startDay={race.startDate}
          endDay={race.endDate}
          segments={race.segments}
          participants={race.participants}
          onDelete={onDelete}
          onToggle={onToggle}
          fetchRide={fetchRide}
        />))} 
    </>
  )
}

export default Tasks
