// This file contains all the db releated connection code
// importing all the necessary modules required in this project
const { Pool } = require('pg')
const neo4j = require('neo4j-driver');
const { exec } = require('node:child_process');
const { close } = require('node:inspector/promises');

let pgPool;
let graphDriver;

const create_pg_connection = async () => {
    pgPool = new Pool({
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASS,
        database: process.env.POSTGRES_DATABASE,
        min: process.env.POSTGRES_MIN,
        max: process.env.POSTGRES_MAX,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000
    });
    pgPool.on('error', (err) => {
        console.error('Unexpected PG pool error', err);
    });

    try {
        const client = await pgPool.connect();
        await client.query('SELECT 1');
        client.release();
        console.log('PostgreSQL pool initialized and connected');
    } catch (err) {
        console.error('Failed to initialize PG pool:', err);
        throw err;
    }
}

const run_pg_query = async (query, params) => {
    const client = await pgPool.connect();
    try {
        const res = await client.query(query, params);
        return res.rows;
    } catch (err) {
        console.log("Error while running pg query: ", err);
        throw err;
    } finally {
        client.release();
    }
}

const close_pg_connection = async () => {
    if (pgPool) {
        await pgPool.end();
        console.log("PG Connection Closed");
    }
}

const create_cogno_connection = async () => {
    graphDriver = neo4j.driver(
        process.env.COGNO_CONNECTION_STRING,
        neo4j.auth.basic(process.env.COGNO_USERNAME, process.env.COGNO_PASSWORD)
    )
    await graphDriver.verifyConnectivity();
    console.log("Cogno DB Connected Successfully");
}

const close_cogno_connection = async () => {
    if (graphDriver) {
        await graphDriver.close();
        console.log("CognoDB connection closed");
    }
};

module.exports = {
    create_cogno_connection,
    create_pg_connection,
    run_pg_query,
    close_pg_connection,
    close_cogno_connection
}