//rafce
import Race from "./Task"
const Tasks = ({races, onDelete, onToggle, fetchRide}) => {
  
  return (
    <>
   
       {races.map((race) => (
        <Race
          key={race._id}
          race={race}
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
