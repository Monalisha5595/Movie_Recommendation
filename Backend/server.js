const express = require('express');
const db = require("/db");
const bycrypt = require('bycrypt');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log("server running on port 5000");
})

app.post("/signup", async(req,res)=>{
    const {name,email,password} = req.body;
    const hashpassword = bycrypt.hash(password,10)
    try{
        const sql = "INSERT INTO users (name,email,password) VALUES(?,?,?)";
        const result = await db.query(sql,[name,email,hashpassword],(err,result)=>{
            if(err){
                
            }            
            console.log("Data Inserted");
            res.status(200).json({message:"Data inserted"})
        })
    }
    catch{
        res.status(500).json({message:"Database error", error:err.message})
    }
})