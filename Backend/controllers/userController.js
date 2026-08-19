const db = require("../db");

const profile_controller = async (req, res) => {
    const { email, actor, interest, director } = req.body;   // interests -> interest

    try {
        const sql = "UPDATE movie_users SET interest=$1, actor=$2, director=$3 WHERE email=$4 RETURNING *";
        const result = await db.run_pg_query(sql, [interest, actor, director, email]);   // order fixed

        if (result.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "Profile updated", user: result[0] });
    } catch (err) {
        console.log("Profile update error", err.message);
        return res.status(500).json({ message: "DB error", error: err.message });
    }
};

module.exports = profile_controller;