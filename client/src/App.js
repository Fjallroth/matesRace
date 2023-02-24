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
  const [tasks, setTasks] = useState([])
  useEffect(()=> {
    const getTasks = async () => {
    const tasksFromServer = await fetchRace()
    setTasks(tasksFromServer)
    }
    getTasks()
  }, [])
 //change this function to get DB race objects
  const fetchRace = async () =>{
    const res = 
      [
        {
          "id": 1,
          "raceName": "funday",
          "startDay": "datetime",
          "endDay": "datetime",
          "segments": [100294, 39482, 48283234, 42374429],
          "raceInfo": "just a fun race between pals"
        },
        {
          "id": 2,
          "raceName": "Sunday",
          "startDay": "datetime",
          "endDay": "datetime",
          "segments": [100294, 39482, 48283234, 42374429],
          "raceInfo": "just a fun race between pals"
        }
      ]
    
    //await fetch('http://localhost:5000/tasks')
    //const data = await res.json()
    return res
  }
  const fetchTasky = async (id) =>{
    const res = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await res.json()
    return data
  }
const planRace= async (race) =>{
  console.log(race)
  //make post request here
}
const addRace= async (race) =>{
  console.log(race)
  //make DB find one and update to add user to race participant array
}
const fetchRide=async (race) =>{
  console.log("fetch rides from strava")
  //make strava request here
  //
}
const addTask= async (task) => {
  
  const res = await fetch(`http://localhost:5000/tasks/`, {
    method: 'POST',
    headers:{
      'Content-type': 'application/json'
    },
    body: JSON.stringify(task)
  })
  const data = await res.json()

  setTasks([...tasks, data])
  // const id = Math.floor(Math.random()*100000) +1
  // const newTask = {id, ...task}
  // setTasks([...tasks, newTask])
}

const deleteTask = async (id) => {
  await fetch(`http://localhost:5000/tasks/${id}`, {
    method: 'DELETE'
  })
  setTasks(tasks.filter((task) => task.id !==id))
}

const toggleReminder = async (id) =>{
  const taskToToggle = await fetchTasky(id)
  const updTask = {...taskToToggle, reminder: !taskToToggle,
  reminder: !taskToToggle.reminder}
  const res = await fetch(`http://localhost:5000/tasks/${id}`, {
  method: 'PUT',
  headers:{
      'Content-type': 'application/json'
    },
    body: JSON.stringify(updTask)
  })
  const data = await res.json()

  setTasks(tasks.map((task) => task.id === id? 
  {...task, reminder: data.reminder} : task))
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
      {tasks.length > 0 ? 
      <Tasks tasks={tasks} onDelete={deleteTask} 
      onToggle={toggleReminder}
      fetchRide= {()=> fetchRide()}
      /> 
      : "You have no upcoming races"}
      </div>
      <div className="container">
      <PrevRaceContainer title={"Your previous races"}/>
      {tasks.length > 0 ? 
      <Tasks tasks={tasks} onDelete={deleteTask} 
      onToggle={toggleReminder} 
      /> 
      : "You haven't done any races"}
      </div>
    
    </div>
  )
}

export default App;
