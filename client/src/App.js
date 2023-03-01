import Header from "./components/Header";
import Tasks from "./components/Tasks";
import {useState, useEffect} from 'react';
import RaceContainer from "./components/RaceContainer";
import PlanRace from "./components/PlanRace";
import AddRace from "./components/AddRace";
import PrevRaceContainer from "./components/PrevRaceContainer";

const App = () =>{
  const[showPlanRace, setshowPlanRace] = useState(false)
  const[showaddRace, setshowaddRace] = useState(false)
  const [races, setTasks] = useState([])
  useEffect(()=> {
    const getRaces = async () => {
    const racesFromServer = await fetchRace()
    console.log(racesFromServer)
    setTasks(racesFromServer.races)
    }
    getRaces()
  }, [])
 //change this function to get DB race objects
  const fetchRace = async () =>{
    const res = await fetch('http://localhost:2121/raceMates/races')
    const data = await res.json()
    return data
  }
  const fetchTasky = async (id) =>{
    const res = await fetch(`http://localhost:5000/races/${id}`)
    const data = await res.json()
    return data
  }
const planRace= async (race) =>{
  console.log(race)
  const res = await fetch(`http://localhost:2121/raceMates/planRace`, {
    method: 'POST',
    headers:{
      'Content-type': 'application/json'
    },
    body: JSON.stringify(race)
  })

  //make post request here
}
const addRace= async (race) =>{
  console.log(race)
  const res = await fetch(`http://localhost:2121/raceMates/joinRace`, {
    method: 'PUT',
    headers:{
      'Content-type': 'application/json'
    },
    body: JSON.stringify(race)
  })
  //make DB find one and update to add user to race participant array
}
const fetchRide=async (race) =>{
  console.log("fetch rides from strava")
  //make strava request here
  //
}
const addTask= async (race) => {
  
  const res = await fetch(`http://localhost:5000/races/`, {
    method: 'POST',
    headers:{
      'Content-type': 'application/json'
    },
    body: JSON.stringify(race)
  })
  const data = await res.json()

  setTasks([...races, data])
}

const deleteTask = async (id) => {
  await fetch(`http://localhost:5000/races/${id}`, {
    method: 'DELETE'
  })
  setTasks(races.filter((race) => race.id !==id))
}

const toggleReminder = async (id) =>{
  const raceToToggle = await fetchTasky(id)
  const updTask = {...raceToToggle, reminder: !raceToToggle,
  reminder: !raceToToggle.reminder}
  const res = await fetch(`http://localhost:5000/races/${id}`, {
  method: 'PUT',
  headers:{
      'Content-type': 'application/json'
    },
    body: JSON.stringify(updTask)
  })
  const data = await res.json()

  setTasks(races.map((race) => race? //something wrong here
  {...race, reminder: data.reminder} : race))
}

  return (
    <div>
    <div className="container">
      <Header buttonTitle="Plan a race" title={"Welcome to mates race"} onAdd={() => setshowPlanRace(!showPlanRace)} showAdd={showPlanRace}/>
      {showPlanRace && <PlanRace onAdd={planRace}/>}
      
      </div>
      <div className="container">
      <RaceContainer title={"Your upcoming races"} buttonTitle={"Join a race"} 
      onAdd={() => setshowaddRace(!showaddRace)} showAdd={showaddRace}/>
      {showaddRace && <AddRace onAdd={addRace}/>}
      {races.length > 0 ? 
      <Tasks races={races} onDelete={deleteTask} 
      onToggle={toggleReminder}
      fetchRide= {()=> fetchRide()}
      /> 
      : "You have no upcoming races"}
      </div>
      <div className="container">
      <PrevRaceContainer title={"Your previous races"}/>
      {races.length > 0 ? 
      <Tasks races={races} onDelete={deleteTask} 
      onToggle={toggleReminder} 
      /> 
      : "You haven't done any races"}
      </div>
    
    </div>
  )
}

export default App;