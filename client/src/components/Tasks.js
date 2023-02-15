//rafce
import Task from "./Task"
const Tasks = ({tasks, onDelete, onToggle}) => {

  return (
    <>
      {tasks.map((task, raceName, startDay, endDay, segments,raceInfo, index) => (
      <Task 
      key={index}
      task={task} 
      raceName={raceName}
      startDay= {startDay}
      endDay= {endDay}
      segments= {segments}
      raceInfo={raceInfo}
    

      onDelete={onDelete}
      onToggle={onToggle}
      />))} 
    </>
  )
}

export default Tasks
