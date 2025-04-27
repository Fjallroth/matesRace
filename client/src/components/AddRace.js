import {useState} from 'react'


const AddRace = ({onAdd}) => {
  const [raceID, setRaceID] = useState('')
  const [racePassword, setPassword] = useState('')

const onSubmit = (e) => {
  e.preventDefault()

  if(!raceID || raceID.length < 5){
    alert('RaceID is not Valid')
    return
  }
  onAdd({raceID, racePassword})

  setRaceID('')
  setPassword('')
}
  return (
    <form className='add-form rounded-md flex align-center m-2 p-5 bg-gray-200' onSubmit={onSubmit}>
        <div className='form-control'>
            <label
            className='bg-purple-300 text-gray-700 rounded-l-md p-2'>
              Race ID</label>
            <input type="text" 
            className='rounded-r-md p-2'
            placeholder='Race ID'
            value = {raceID}
            onChange={(e) => setRaceID(e.target.value) }/>
        </div>
        <div className='form-control'>
            <label
            className='bg-purple-300 text-gray-700 rounded-l-md ml-3 p-2'>
              Password from Organiser</label>
            <input type="text" 
            className='rounded-r-md p-2'
            placeholder='Password'
            value = {racePassword}
            onChange={(e) => setPassword(e.target.value)} />
        </div>  
        <input type="submit" value='Join the Race' className= "ml-3 bg-purple-300 text-gray-700 rounded-md px-1"/>
    </form>
  )
}

export default AddRace