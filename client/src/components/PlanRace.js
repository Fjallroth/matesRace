import {useState} from 'react'


const PlanRace = ({onAdd}) => {
  const [raceName, setRaceName] = useState('')
  const [startDay, setStart] = useState('')
  const [endDay, setEnd] = useState('')
  const [segments, setSegments] = useState('')
  const [raceInfo, setRaceInfo] = useState('')
  const [partPass, setPartPass] = useState('')

const onSubmit = (e) => {
  e.preventDefault()

  if(!raceName){
    alert('Please add a race')
    return
  }
  onAdd({raceName, startDay, endDay, segments, raceInfo, partPass})

  setRaceName('')
  setStart('')
  setEnd('')
  setSegments('')
  setRaceInfo('')
  setPartPass('')
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
            <label>Add Segments (For multiple segments separate them with a comma)</label>
            <input type="text" 
            placeholder='e.g. 1723783,12336704,18239466'
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
        <div className='form-control'>
            <label>Password for participants</label>
            <input type="text" 
            placeholder='this is stored in plain text unlike your actual password'
            value = {partPass}
            onChange={(e) => setPartPass(e.target.value) }/>
        </div>
        
        <input type="submit" value='Save Race' className='btn btn-block' />
    </form>
  )
}

export default PlanRace