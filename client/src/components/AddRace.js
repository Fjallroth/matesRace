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
    <form className='add-form' onSubmit={onSubmit}>
        <div className='form-control'>
            <label>Race ID</label>
            <input type="text" 
            placeholder='Race ID'
            value = {raceID}
            onChange={(e) => setRaceID(e.target.value) }/>
        </div>
        <div className='form-control'>
            <label>Password from Organiser</label>
            <input type="text" 
            placeholder='Password'
            value = {racePassword}
            onChange={(e) => setPassword(e.target.value)} />
        </div>  
        <input type="submit" value='Join the Race' className='btn btn-block' />
    </form>
  )
}

export default AddRace