import { useState,useEffect} from "react";

export default function List() {
const [task, setTask] = useState("");
const [tasks, setTasks] = useState([]);
const [showAbout,setShowAbout]= useState(false);
const [activeIndex,setActiveIndex]=useState(null);

const API = import.meta.env.VITE_API_URL;

useEffect(()=>{

  gettodos();

},[]);

let activeTask =
    tasks.find(task => task.id === activeIndex);    

function handleAbout(id) {
  if (showAbout && activeIndex === id) {

    setShowAbout(false);
    setActiveIndex(null);

  } else {

    setActiveIndex(id);
    setShowAbout(true);

  }
}

// get todo
async function gettodos(){

  const response= await fetch(
    `${API}/todos`,
  )

  const todos=await response.json();
  setTasks(todos);

}

// addtodo
async function addtodo(e){

 e.preventDefault();
  if (!task.trim()) return;

  await fetch(
    `${API}/todos`,
    {
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(
        {todo:task,
         about:"",
         done:false
        }
      )
    }
  );
  setTask("");
  await gettodos();

}

//delete todo
async function deletetask(i){

  await fetch(
    `${API}/todos/${i}`,
    {
      method:"delete",
    }
  )

 await gettodos();
}

//update about
async function updatedone(task,done){

  await fetch(
    `${API}/todos/${task.id}`,
    {
      method:"PUT",
      headers:{
        "Content-Type":"application/json",
      },

      body:JSON.stringify({
        ...task,
        done
      })

    }

  )


}

// update about
async function updateabout(task,about){

  await fetch(
    `${API}/todos/${task.id}`,
  
  {
    method:"PUT",
    headers:{
      "Content-Type":"application/json"
    },

    body:JSON.stringify({
      ...task,
      about
    })
  }
 )

}


  return (
    <div className="flex flex-col p-4 max-w-xl ">
      <div>
      <form className="flex font-mono gap-2 mb-4" onSubmit={addtodo}>
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="border px-2 rounded-xl size-11 py-1 flex-1"
          placeholder="Enter task"
        />
        <button 
        className="px-3 py-1 bg-orange-100 rounded-xl text-black ">
          Add
        </button>
      </form>

      <ul className="h-10 font-mono ">
        {
        tasks.map((task) => (
          <li
            key={task.id}
            className="flex justify-between items-center border rounded-xl border-r-2 px-2 py-1 m-3 "
          >
           <input 
            type="checkbox" 
            checked={task.done}
            onChange={(e)=>{
              setTasks(prev=>
                prev.map(t=>
                  t.id===task.id?
                  {...t,done:e.target.checked}:
                  t
                )
                
              )
              updatedone(task,e.target.checked);
            }} />


            <span className={`text-xl ${task.done ? "line-through text-gray-500" : ""}`}>{task.todo}</span>

            <div className=" flex gap-2">
              <button
              onClick={() => deletetask(task.id)}
              className="text-red-500"
            >
              <img className="h-5" src='../recycle-bin.png' alt="delete" />
            </button>
            <button
              className="text-red-500"
              onClick={()=>handleAbout(task.id)}
            >
              <img className="h-5" src='../arrow.png' alt="show" />
            </button>
            </div>
          </li>
          
        ))}
      </ul>

      {tasks.length === 0 && <img className="h-80 pl-26" src="./snorlex.png" alt="empty todo" />}
      </div>

        {showAbout && activeTask && activeIndex !== null && (
          <div className="fixed right-0 top-16 h-full w-200 bg-white shadow-lg p-4">
          <h2 className="text-lg font-semibold">
           Notes for : {activeTask.todo}
          </h2>
      <textarea
      placeholder="Write notes, ideas, links, or reminders related to this todo…"
      spellCheck={false}
        className={
        `leading-relaxed 
        text-xl
        spellCheck={false} 
        w-full
        h-full
        p-4
        border-r
        outline-none
        resize-none
        font-mono
        ${activeTask.done?"text-gray-400":""}`}
        
        // ?. = optional chaining

        value={activeTask?.about || ""}

        onChange={(e) => {

         setTasks(prev => 
         prev.map(task=>
          task.id===activeIndex?
          {...task,about:e.target.value}:
          task
         )

        );
       updateabout(activeTask,e.target.value);
       }      
      }
      />
  </div>
)}
    </div>

  );
}
