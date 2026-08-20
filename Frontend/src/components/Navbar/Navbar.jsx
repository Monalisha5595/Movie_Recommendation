import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, Settings } from "lucide-react";
import "./Navbar.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setMenuOpen(false);
    navigate("/");
  };

  const initials = user?.name
    ? user.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "U";

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__left">
        <Link to="/" className="navbar__logo">
          REEL<span className="navbar__logo-accent">ROOM</span>
        </Link>
        <div className="navbar__menu">
          <Link to="/" className="navbar__link navbar__link--active">Home</Link>
        </div>
      </div>

      <div className="navbar__right">
        {user ? (
          <div className="navbar__profile" ref={menuRef}>
            <button
              className="navbar__profile-btn"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Profile menu"
            >
              {initials}
            </button>

            {menuOpen && (
              <div className="navbar__dropdown">
                <div className="navbar__dropdown-header">
                  <p className="navbar__dropdown-name">{user.name}</p>
                  <p className="navbar__dropdown-email">{user.email}</p>
                </div>
                <Link
                  to="/profile"
                  className="navbar__dropdown-item"
                  onClick={() => setMenuOpen(false)}
                >
                  <Settings size={16} /> Edit Profile
                </Link>
                <button className="navbar__dropdown-item navbar__dropdown-item--danger" onClick={handleLogout}>
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" className="navbar__login-btn">Log in</Link>
            <Link to="/signup" className="navbar__signup-btn">Sign up</Link>
          </>
        )}
      </div>
    </nav>
  );
}