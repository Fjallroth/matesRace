import {useState} from 'react'


const PlanRace = ({onAdd}) => {
  const [raceName, setRaceName] = useState('')
  const [startDay, setStart] = useState('')
  const [endDay, setEnd] = useState('')
  const [segments, setSegments] = useState('')
  const [raceInfo, setRaceInfo] = useState('')

const onSubmit = (e) => {
  e.preventDefault()

  if(!raceName){
    alert('Please add a task')
    return
  }
  onAdd({raceName})

  setRaceName('')
  setStart('')
  setEnd('')
  setSegments('')
  setRaceInfo('')
}
  return (
    <form className='add-form' onSubmit={onSubmit}>
        <div className='form-control'>
            <label>Plan a Race</label>
            <input type="text" 
            placeholder='Race Name'
            value = {raceName}
            onChange={(e) => setRaceName(e.target.value) }/>
        </div>
        <div className='form-control'>
            <label>Set Start Date</label>
            <input type="datetime-local" 
            placeholder='Add day and time'
            value = {startDay}
            onChange={(e) => setStart(e.target.value)} />
        </div>
        <div className='form-control'>
            <label>Set End Date</label>
            <input type="datetime-local" 
            placeholder='Add day and time'
            value = {endDay}
            onChange={(e) => setEnd(e.target.value)} />
        </div>
        <div className='form-control'>
            <label>Add Segments</label>
            <input type="text" 
            placeholder='SegmentID'
            value = {segments}
            onChange={(e) => setSegments(e.target.value) }/>
        </div>
        <div className='form-control'>
            <label>Info for the participants</label>
            <input type="text" 
            placeholder='Race Info'
            value = {raceInfo}
            onChange={(e) => setRaceInfo(e.target.value) }/>
        </div>
        
        <input type="submit" value='Save Race' className='btn btn-block' />
    </form>
  )
}

export default PlanRace