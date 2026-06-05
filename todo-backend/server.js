import express from "express"
import cors from "cors"
import pg from "pg"
import dotenv from "dotenv";

dotenv.config();

const {Pool}=pg
const app=express();

app.use(express.json());
app.use(cors())

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// const pool = new Pool({
//     user: "postgres",
//     host: "localhost",
//     database: "postgres",
//     password: "password",
//     port: 5432
// });

pool.connect()
.then(() => {
    console.log("PostgreSQL Connected");
})
.catch(err => {
    console.log(err);
});

app.get('/',(req,res)=>{
    res.send("todos api running");
});

app.get('/todos',async (req,res)=>{

    try{

        const result= await pool.query(
            "select * from todos order by id "
        );

        res.json(result.rows);

    }catch(err){
        console.log(err.message);
    }
});

app.post('/todos',async (req,res)=>{

    try{
        const{todo,about,done}=req.body;

        const result = await pool.query(
            "insert into todos (todo,about,done) values ($1,$2,$3) returning *",
            [todo,about,done])

            res.json(result.rows[0]

        );
    }
    catch(err){

        console.log(err.message)

    }
});

app.put('/todos/:id',async (req,res)=>{

    try{

        const id=Number(req.params.id);

        const{todo,about,done}=req.body;

        await pool.query(
            "UPDATE todos SET todo=$1, about=$2, done=$3 WHERE id=$4",
            [todo,about,done,id]

        )
        res.json("todo updted");

    }catch(err){
        console.log(err.message);
    }

});

app.delete('/todos/:id',async (req,res)=>{
    try{
        const id=Number(req.params.id);

        await pool.query(
            "DELETE from todos where id=$1",
            [id]

        );
        res.json("todos updated")

    }catch(err){
        console.log(err.message);
    }
});

app.listen((3000),()=>{
    console.log("api is running at port 3000");
})
