const express = require('express');
const db = require("./db");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const authRoute = require('./routes/authRoute')
const movieRoute = require('./routes/movieRoute')
const userRoute = require('./routes/userRoute')
dotenv.config({ path: './config/.env' })

const PORT = process.env.APPLICATION_PORT || 5001
const app = express();
app.use(express.json());

const start_server = async () => {
    // Adding custom API Routes
    app.use('/v1/api', authRoute);
    app.use('/v1/api/movie', movieRoute)
    app.use('/v1/api/user', userRoute)
    // Creating DB connections
    // Postgres Connection
    await db.create_cogno_connection();
    // CognoDB Conenction
    await db.create_pg_connection();
    // Creating Application Server
    app.listen(PORT, () => {
        console.log(`server running on port ${PORT}`);
    });
}

start_server();

process.on("SIGTERM", async () => {
    await db.close_cogno_connection();
    await db.close_pg_connection();
    process.exit(0);
});

process.on("SIGINT", async () => {
    await db.close_cogno_connection();
    await db.close_pg_connection();
    process.exit(0);
});