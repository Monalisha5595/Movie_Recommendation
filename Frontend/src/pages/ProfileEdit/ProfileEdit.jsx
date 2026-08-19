import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Film, Clapperboard, Tags, ArrowLeft } from "lucide-react";
import { updateProfile } from "../../services/profileService";
import "./ProfileEdit.css";

export default function ProfileEdit() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    interest: "",
    actor: "",
    director: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    const parsed = JSON.parse(storedUser);
    setUser(parsed);
    setForm({
      interest: parsed.interest || "",
      actor: parsed.actor || "",
      director: parsed.director || "",
    });
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Fields are stored as comma-separated values in the DB.
      // Normalize input here: trim each item, drop empty ones, rejoin with ", ".
      const normalized = {
        interest: form.interest.split(",").map((s) => s.trim()).filter(Boolean).join(", "),
        actor: form.actor.split(",").map((s) => s.trim()).filter(Boolean).join(", "),
        director: form.director.split(",").map((s) => s.trim()).filter(Boolean).join(", "),
      };

      await updateProfile({ email: user.email, ...normalized });

      const updatedUser = { ...user, ...normalized };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setForm(normalized);
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const initials = user.name
    ? user.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "U";

  return (
    <div className="profile-page">
      <Link to="/" className="profile-back">
        <ArrowLeft size={18} /> Back to home
      </Link>

      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">{initials}</div>
          <div>
            <h1 className="profile-name">{user.name}</h1>
            <p className="profile-email">{user.email}</p>
          </div>
        </div>

        <h2 className="profile-section-title">Edit preferences</h2>
        <p className="profile-section-sub">
          Tell us what you love — separate multiple entries with commas.
        </p>

        {error && <div className="profile-error">{error}</div>}
        {success && <div className="profile-success">{success}</div>}

        <form className="profile-form" onSubmit={handleSubmit}>
          <label className="profile-label">
            <Tags size={16} className="profile-label-icon" />
            Favorite genres / interests
          </label>
          <input
            type="text"
            name="interest"
            placeholder="e.g. Sci-Fi, Thriller, Romance"
            value={form.interest}
            onChange={handleChange}
            className="profile-input"
          />

          <label className="profile-label">
            <Film size={16} className="profile-label-icon" />
            Favorite actors
          </label>
          <input
            type="text"
            name="actor"
            placeholder="e.g. Leonardo DiCaprio, Tom Hanks"
            value={form.actor}
            onChange={handleChange}
            className="profile-input"
          />

          <label className="profile-label">
            <Clapperboard size={16} className="profile-label-icon" />
            Favorite director
          </label>
          <input
            type="text"
            name="director"
            placeholder="e.g. Christopher Nolan, Denis Villeneuve"
            value={form.director}
            onChange={handleChange}
            className="profile-input"
          />

          <button type="submit" className="profile-submit-btn" disabled={loading}>
            {loading ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
}