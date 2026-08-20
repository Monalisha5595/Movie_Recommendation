const express = require("express");
const router = express.Router();
const db = require("../db");

// ─── GET /v1/api/profile?email=... ───────────────────────────────────────────
router.get("/profile", async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const rows = await db.run_pg_query(
      `SELECT email, actor, director
       FROM movie_users
       WHERE email = $1`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = rows[0];
    res.status(200).json({
      email:    user.email,
      actor:    user.actor    || "",
      director: user.director || "",
    });
  } catch (err) {
    console.error("GET /profile error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ─── POST /v1/api/profile ─────────────────────────────────────────────────────
router.post("/profile", async (req, res) => {
  const { email, actor, director } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const rows = await db.run_pg_query(
      `UPDATE movie_users
       SET actor = $1, director = $2
       WHERE email = $3
       RETURNING email, actor, director`,
      [actor, director, email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("POST /profile error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;