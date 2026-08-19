const db = require("../db");

const profile_controller = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ message: "Please Send Correct request body to continue" })
    }

    const { actor, interest, director } = req.body;   // interests -> interest
    if (actor == '' && interest == '' && director == '') {
        return res.status(400).json({ message: "Please fill all the required details" })
    }
    const email = req.user_details["email"]
    try {
        const sql = ` UPDATE movie_users 
                    SET interest = CASE 
                            WHEN interest IS NULL OR interest = '' THEN $1
                            WHEN $1 = ANY(string_to_array(interest, ',')) THEN interest 
                            ELSE interest || ',' || $1 
                        END,
                        actor = CASE 
                            WHEN actor IS NULL OR actor = '' THEN $2
                            WHEN $2 = ANY(string_to_array(actor, ',')) THEN actor 
                            ELSE actor || ',' || $2 
                        END,
                        director = CASE 
                            WHEN director IS NULL OR director = '' THEN $3
                            WHEN $3 = ANY(string_to_array(director, ',')) THEN director 
                            ELSE director || ',' || $3 
                        END
                    WHERE email = $4 
                    RETURNING *`;
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