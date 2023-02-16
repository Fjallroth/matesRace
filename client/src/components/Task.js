import React from 'react'
import {FaTimes} from 'react-icons/fa'
import Button from './Button'

const task = ({task, onDelete, onToggle, fetchRide}) => {
  return (
    <div className ={`task ${task.reminder ? 'reminder' : ''}`}  onDoubleClick={() => onToggle(task.id)}>
        <h3>{task.raceName}  
        <FaTimes style={{ color:'red', curson: 'pointer'}}
        onClick={() => onDelete(task.id)}
        /></h3>
        <p>{task.segments}</p>
        <Button color= {"green"} text={"upload ride"}
      onClick={fetchRide}/>
    </div>
  )
}

export default task
