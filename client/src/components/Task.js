import React from 'react'
import {FaTimes} from 'react-icons/fa'

const task = ({task, onDelete, onToggle}) => {
  return (
    <div className ={`task ${task.reminder ? 'reminder' : ''}`}  onDoubleClick={() => onToggle(task.id)}>
        <h3>{task.raceName}  
        <FaTimes style={{ color:'red', curson: 'pointer'}}
        onClick={() => onDelete(task.id)}
        
        /></h3>
        <p>{task.segments}</p>
    

    </div>
  )
}

export default task
