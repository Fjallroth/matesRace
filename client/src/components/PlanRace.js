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
    <form className='add-form rounded-md m-2 p-5 bg-gray-200' onSubmit={onSubmit}>
        <div className='form-control'>
            <label className='bg-purple-300 text-gray-700 rounded-l-md ml-3 p-2'>Plan a Race</label>
            <input type="text" 
            className='rounded-r-md p-2 my-2'
            placeholder='Race Name'
            
            value = {raceName}
            onChange={(e) => setRaceName(e.target.value) }/>
        </div>
        <div className='form-control'>
            <label className='bg-purple-300 text-gray-700 rounded-l-md ml-3 p-2'>Set Start Date</label>
            <input type="datetime-local" 
            placeholder='Add day and time'
            className='rounded-r-md p-2 my-2'
            value = {startDay}
            onChange={(e) => setStart(e.target.value)} />
        </div>
        <div className='form-control'>
            <label className='bg-purple-300 text-gray-700 rounded-l-md ml-3 p-2'>Set End Date</label>
            <input type="datetime-local" 
            placeholder='Add day and time'
            className='rounded-r-md p-2 my-2'
            value = {endDay}
            onChange={(e) => setEnd(e.target.value)} />
        </div>
        <div className='form-control'>
            <label className='bg-purple-300 text-gray-700 rounded-l-md ml-3 p-2'>Add Segments (For multiple segments separate them with a comma)</label>
            <input type="text" 
            placeholder='e.g. 1723783,12336704,18239466'
            className='rounded-r-md p-2 my-2'
            value = {segments}
            onChange={(e) => setSegments(e.target.value) }/>
        </div>
        <div className='form-control'>
            <label className='bg-purple-300 text-gray-700 rounded-l-md ml-3 p-2'>Info for the participants</label>
            <input type="text" 
            placeholder='Race Info'
            className='rounded-r-md p-2 my-2'
            value = {raceInfo}
            onChange={(e) => setRaceInfo(e.target.value) }/>
        </div>
        <div className='form-control'>
            <label className='bg-purple-300 text-gray-700 rounded-l-md ml-3 p-2'>Password for participants</label>
            <input type="text" 
            className='rounded-r-md p-2 my-2'
            placeholder='this is stored in plain text unlike your actual password'
            value = {partPass}
            onChange={(e) => setPartPass(e.target.value) }/>
        </div>
        
        <input type="submit" value='Save Race' className='bg-purple-300 text-gray-700 rounded-md ml-3 p-2' />
    </form>
  )
}

export default PlanRace