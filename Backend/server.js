const express = require('express');
const db = require("./db");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());


app.post("/signup", async(req,res)=>{
    const {name,email,password} = req.body;
    const hashpassword = await bcrypt.hash(password,10)
    try{
        const sql = "INSERT INTO movie_users (name,email,password) VALUES($1,$2,$3)";
        const result = await db.query(sql,[name,email,hashpassword]);
            console.log("Data Inserted:", result.rows[0]);
            res.status(200).json({message:"Data inserted"})
    }
    catch(err){
        res.status(500).json({message:"Database error", error:err.message})
    }
})

app.post("/signin", async(req,res)=>{
    const { email, password } = req.body;
    console.log(email,password);
    try{
    const sql = "SELECT * FROM movie_users WHERE email=$1";

    const result = await db.query(sql,[email]);

        if(result.rows.length===0){
            return res.status(401).json({message:"invalid email"})
        }

        const user = result.rows[0];
        console.log(user,'user');
        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.status(401).json({message:"Invalid email or password"})
        }

        const token = jwt.sign({
            id : user.id,
            email : user.email,
        },"mysecretkey",{expiresIn:"1d"})

        return res.json({
            success:true,
            message:"Login sucessful",
            token,
            user:{
                id : user.id,
                name : user.name,
                email : user.email
            }
        })
        
    }catch (err) {
        console.log("Signin error:", err.message);
        return res.status(500).json({ message: "DB error", error: err.message });
    }
    
})

const PORT = process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log("server running on port 5000");
})

