// This file contains all the controller related function for our routes
// importing all the necessary modules required in the file
const bcrypt = require('bcrypt');
const db = require('../db');
const jwt = require('jsonwebtoken');

const signup_controller = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ message: "Empty Request Received" });
    }
    if (!req.body.name || !req.body.email || !req.body.password) {
        return res.status(400).json({ message: "Invalid Request Body" });
    }
    const { name, email, password } = req.body;
    const checkUsername = "select name from movie_users where name = $1";
    const checkUsernameRes = await db.run_pg_query(checkUsername, [name])
    if (checkUsername) {
        return res.status(400).json({message: `Username: ${name} is already taken`});
    }
    const hashpassword = await bcrypt.hash(password, 10)
    try {
        const sql = "INSERT INTO movie_users (name,email,password) VALUES($1,$2,$3)";
        const result = await db.run_pg_query(sql, [name, email, hashpassword]);
        console.log("Data Inserted:", result);
        res.status(200).json({ message: "Data inserted" })
    }
    catch (err) {
        res.status(500).json({ message: "Database error", error: err.message })
    }
}

const signin_controller = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ message: "Empty Request Received" });
    }
    if (!req.body.identifier || !req.body.password) {
        return res.status(400).json({ message: "Invalid Request Body" });
    }
    const { identifier, password } = req.body;
    try {
        const sql = "SELECT name, email, password FROM movie_users WHERE email=$1 or name=$1";

        const result = await db.run_pg_query(sql, [identifier]);

        if (result.length === 0) {
            return res.status(401).json({ message: "invalid Credentials Provided" })
        }
        const userDetails = result[0];
        const isMatch = await bcrypt.compare(password, userDetails.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Credentials Provided" })
        }

        const token = jwt.sign({
            id: userDetails.id,
            email: userDetails.email,
        }, process.env.APPLICATION_SECRET_KEY, { expiresIn: "1d" })

        return res.json({
            success: true,
            message: "Login sucessful",
            token,
            user: {
                id: userDetails.id,
                name: userDetails.name,
                email: userDetails.email
            }
        })

    } catch (err) {
        console.log("Signin error:", err.message);
        return res.status(500).json({ message: "DB error", error: err.message });
    }

}

module.exports = { signup_controller, signin_controller };