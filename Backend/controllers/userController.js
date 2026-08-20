const db = require("../db");

const update_profile_controller = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ message: "Please Send Correct request body to continue" })
    }

    const { actor, director } = req.body;   // interests -> interest
    const email = req.user_details["email"]
    try {
        const sql = `UPDATE movie_users
                    SET actor = $1, director = $2
                    WHERE email = $3
                    RETURNING email, actor, director`;
        const result = await db.run_pg_query(sql, [actor, director, email]);   // order fixed
        if (result.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "Profile updated", user: result[0] });
    } catch (err) {
        console.log("Profile update error", err.message);
        return res.status(500).json({ message: "DB error", error: err.message });
    }
};

const get_profile_controller = async (req, res) => {
    const { email } = req.user_details;

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
            // email: user.email,
            actor: user.actor || "",
            director: user.director || "",
        });
    } catch (err) {
        console.error("GET /profile error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { update_profile_controller, get_profile_controller };