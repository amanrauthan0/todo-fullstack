import express from "express"
import cors from "cors"

const app=express();

app.use(express.json());
app.use(cors())
const todos=[];

app.get('/',(req,res)=>{
    res.send("todos api running");
})

app.get('/todos',(req,res)=>{
    res.json(todos);
})

app.post('/todos',(req,res)=>{
    const todo={
        id:Date.now(),
        todo:req.body.todo,
        about:req.body.about,
        done:req.body.done
    };
    todos.push(todo);

    res.json(todos);
})

app.put('/todos/:id',(req,res)=>{
    const id=Number(req.params.id);

    const task=
    todos.find(todo=>todo.id===id);

    if(task){
        task.todo=req.body.todo;
        task.about=req.body.about;
        task.done=req.body.done;
    }

   res.json(todos);

})

app.delete('/todos/:id',(req,res)=>{
    const id=Number(req.params.id);

    const filtered=
    todos.filter(todo=>todo.id!==id);

    todos.length=0;
    todos.push(...filtered);
    res.json(todos);
})

app.listen((3000),()=>{
    console.log("api is running at port 3000");
})
