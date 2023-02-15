import Header from "./components/Header";
import Tasks from "./components/Tasks";
import {useState, useEffect} from 'react';
import AddTask from "./components/AddTask";
import RaceContainer from "./components/RaceContainer";
import PlanRace from "./components/PlanRace";
import AddRace from "./components/AddRace";

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
          "text": "Doctors Appointment",
          "day": "Feb 5th at 2:30pm",
          "reminder": true
        },
        {
          "id": 2,
          "text": "Meeting at School",
          "day": "Feb 6th at 1:30pm",
          "reminder": true
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
      {showPlanRace && <PlanRace onAdd={addTask}/>}
      
      </div>
      <div className="container">
      <RaceContainer title={"Your upcoming races"} planRace={""} buttonTitle={"Join a race"} 
      onAdd={() => setshowaddRace(!showaddRace)} showAdd={showaddRace}/>
      {showaddRace && <AddRace onAdd={addTask}/>}
      {tasks.length > 0 ? 
      <Tasks tasks={tasks} onDelete={deleteTask}
      onToggle={toggleReminder}
      /> 
      : "You have no upcoming races"}
      </div>
      <div className="container">
      <RaceContainer title={"Your previous races"}/>
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
