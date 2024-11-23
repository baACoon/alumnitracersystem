import express from "express" //this is the node js web app framework para makapag build ng web app at mobile app 
import mysql from "mysql"

const app = express() //

app.listen(8800, ()=> {
    console.log("connected to backend")
}) //internet protocol

const db= mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "alumni"
})

app.use(express.json)

// Connect to the MySQL database
db.connect((err) => {
    if (err) {
        console.error("Error connecting to the database:", err);
    } else {
        console.log("Connected to the MySQL database.");
    }
});

app.get("/", (req, res)=>{
    res.json("this is the backend")
})

app.get("/users", (req, res)=>{
    const q ="SELECT * FROM users"
    db.query(q, (err, data)=>{
        if(err) return res.json(err)
            return res.json(data)//data handles all the roles selected from your table called user
    })
})

app.post("/users", (req, res)=>{
    const q = "INSERT INTO users (`id`, `college`, `course`, `tup_id`, `email`, `password`, `birthdate`, `created_at` ) VALUES(?)";
    const values = [
        req.body.id,
        req.body.college,
        req.body.course,
        req.body.tup_id,
        req.body.email,
        req.body.password,
        req.body.birthdate,
        req.body.created_at,

    ];
    db.query(q, [values], (err, data)=>{
        if(err) return res.json(err)
            return res.json(data)
    }) 

}) 

