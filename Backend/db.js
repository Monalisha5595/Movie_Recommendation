// This file contains all the db releated connection code
// importing all the necessary modules required in this project
const { Pool } = require("pg");
const neo4j = require("neo4j-driver");
const { exec } = require("node:child_process");
const { close } = require("node:inspector/promises");

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
    connectionTimeoutMillis: 5000,
  });
  pgPool.on("error", (err) => {
    console.error("Unexpected PG pool error", err);
  });

  try {
    const client = await pgPool.connect();
    await client.query("SELECT 1");
    client.release();
    console.log("PostgreSQL pool initialized and connected");
  } catch (err) {
    console.error("Failed to initialize PG pool:", err);
    throw err;
  }
};

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
};

const close_pg_connection = async () => {
  if (pgPool) {
    await pgPool.end();
    console.log("PG Connection Closed");
  }
};

const create_cogno_connection = async () => {
  graphDriver = neo4j.driver(process.env.COGNO_CONNECTION_STRING, neo4j.auth.basic(process.env.COGNO_USERNAME, process.env.COGNO_PASSWORD));
  await graphDriver.verifyConnectivity();
  console.log("Cogno DB Connected Successfully");
};

const insert_into_cogno = async (data) => {
  const session = graphDriver.session();
  try {
    for (const movie of data) {
      // ── Duplicate check ───────────────────────────────────────────
      const existing = await session.run(`MATCH (m:Movie { title: $title, director: $director }) RETURN m`, {
        title: movie.title,
        director: movie.director,
      });

      if (existing.records.length > 0) {
        throw new Error(`Duplicate entry: "${movie.title}" by ${movie.director} already exists.`);
      }

      // ── Step 1: Create Movie, Actor, Director nodes + relationships
      await session.run(
        `
        MERGE (m:Movie    { title: $title, director: $director })
        ON CREATE SET m.poster_url = $poster_url

        MERGE (a:Actor    { name: $lead_actor })
        MERGE (d:Director { name: $director   })

        MERGE (a)-[:ACTED_IN]->(m)
        MERGE (d)-[:DIRECTED]->(m)
        `,
        {
          title: movie.title,
          lead_actor: movie.lead_actor,
          director: movie.director,
          poster_url: movie.poster_url,
        },
      );

      // ── Step 2: SIMILAR by same actor (both directions) ───────────
      await session.run(
        `
        MATCH (m:Movie    { title: $title, director: $director })
        MATCH (a:Actor    { name:  $lead_actor })-[:ACTED_IN]->(other:Movie)
        WHERE other <> m
        MERGE (m)-[:SIMILAR { reason: "same actor", value: a.name }]->(other)
        MERGE (other)-[:SIMILAR { reason: "same actor", value: a.name }]->(m)
        `,
        {
          title: movie.title,
          director: movie.director,
          lead_actor: movie.lead_actor,
        },
      );

      // ── Step 3: SIMILAR by same director (both directions) ────────
      await session.run(
        `
        MATCH (m:Movie    { title: $title,    director: $director })
        MATCH (d:Director { name:  $director })-[:DIRECTED]->(other:Movie)
        WHERE other <> m
        MERGE (m)-[:SIMILAR { reason: "same director", value: d.name }]->(other)
        MERGE (other)-[:SIMILAR { reason: "same director", value: d.name }]->(m)
        `,
        {
          title: movie.title,
          director: movie.director,
        },
      );
      console.log(`Inserted & connected: "${movie.title}" (${movie.director})`);
    }

    return { success: true, message: "All movies inserted successfully." };
  } catch (err) {
    console.error("Error:", err.message);
    return { success: false, message: err.message };
  } finally {
    await session.close();
  }
};

const fetch_from_cogno = async () => {
  const session = graphDriver.session();
  try {
    const result = await session.run(`MATCH (m:Movie) RETURN m ORDER BY m.title ASC`);

    const movies = result.records.map((record) => record.get("m").properties);

    return { success: true, data: movies };
  } catch (err) {
    console.error("Error:", err.message);
    return { success: false, message: err.message, data: [] };
  } finally {
    await session.close();
  }
};

const fetch_related_movies = async (actors, directors) => {
  const session = graphDriver.session();
  try {
    const graphResult = await session.run(
      `
      OPTIONAL MATCH (a:Actor)-[:ACTED_IN]->(m1:Movie)
      WHERE toLower(a.name) IN $actors

      OPTIONAL MATCH (d:Director)-[:DIRECTED]->(m2:Movie)
      WHERE toLower(d.name) IN $directors

      WITH collect(DISTINCT m1) + collect(DISTINCT m2) AS allMovies
      UNWIND allMovies AS m

      OPTIONAL MATCH (a:Actor)-[:ACTED_IN]->(m)    WHERE toLower(a.name) IN $actors
      OPTIONAL MATCH (d:Director)-[:DIRECTED]->(m) WHERE toLower(d.name) IN $directors

      RETURN DISTINCT m,
        CASE
          WHEN a IS NOT NULL AND d IS NOT NULL THEN "Matches actor & director: " + a.name + " / " + d.name
          WHEN a IS NOT NULL                   THEN "Matches your favourite actor: "    + a.name
          ELSE                                      "Matches your favourite director: " + d.name
        END AS reason
      ORDER BY m.title ASC
      `,
      { actors, directors },
    );

    const movies = graphResult.records.map((record) => ({
      ...record.get("m").properties,
      matched_because: record.get("reason"),
    }));

    return { success: true, data: movies };
  } catch (err) {
    console.error("fetch_related_movies error:", err.message);
    return { success: false, message: err.message, data: [] };
  } finally {
    await session.close();
  }
};

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
  insert_into_cogno,
  fetch_from_cogno,
  fetch_related_movies,
  close_cogno_connection,
};
