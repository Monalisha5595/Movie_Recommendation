// This file will contain all the necessary controller required by movie route for serving the request
// importing all the necessary modules required in this file
const db = require("../db");

const create_movies = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Request body missing" });
    }
    movies = req.body;
    if (!Array.isArray(movies) || movies.length === 0) {
      return res.status(400).json({ message: "Please Provide Movie details" });
    }
    for (const movie of movies) {
      if (!movie.title || !movie.poster_url || !movie.lead_actor || !movie.director) {
        return res.status(400).json({ message: "Each movie must have title, actor, director and poster_url" });
      }
    }
    is_inserted = await db.insert_into_cogno(movies);
    if (!is_inserted) {
      return res.status(400).json({ message: "Failed to Insert Data" });
    }
    return res.status(201).json({ message: "All Movies Inserted Successfully" });
  } catch (err) {
    console.log("Exception in Create Movie route: ", err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const get_all_movies = async (req, res) => {
  try {
    const { success, data, message } = await db.fetch_from_cogno();

    if (!success) {
      return res.status(500).json({ success, message });
    }

    return res.status(200).json({
      success,
      count: data.length,
      data,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const get_related_movies = async (req, res) => {
  const { email } = req.user_details;
  // fetch the interests, actor, director from the db
  const sql = "SELECT actor, director FROM movie_users WHERE email=$1";
  const result = await db.run_pg_query(sql, [email]);
  if (!result || result.length === 0) {
    return res.status(404).json({ success: false, message: "User not found." });
  }
  const { actor, director } = result[0];
  if (!actor && !director) {
    return res.status(400).json({
      success: false,
      message: "No preferences set. Please update your actor and director interests.",
    });
  }
  const actors = actor ? actor.split(",").map((a) => a.trim()) : [];
  const directors = director ? director.split(",").map((d) => d.trim()) : [];
  const { success, data, message } = await db.fetch_related_movies(actors, directors);

  if (!success) {
    return res.status(500).json({ success, message });
  }

  if (data.length === 0) {
    return res.status(404).json({ success: false, message: "No movies found for your preferences." });
  }

  return res.status(200).json({ success: true, count: data.length, data });
};

module.exports = {
  create_movies,
  get_all_movies,
  get_related_movies,
};
