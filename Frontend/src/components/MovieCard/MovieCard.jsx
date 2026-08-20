import { useState } from "react";
import { Play, Star } from "lucide-react";
import "./MovieCard.css";

// Inline SVG — zero network requests, never 404s, never loops
const FALLBACK_POSTER = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='450' viewBox='0 0 300 450'%3E%3Crect width='300' height='450' fill='%231a1a2e'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23555' font-size='14' font-family='sans-serif'%3ENo Poster%3C/text%3E%3C/svg%3E`;

export default function MovieCard({ movie }) {
  const [hover, setHover] = useState(false);

  // ✅ API returns poster_url, fallback to poster for other endpoints
  const posterSrc = movie.poster_url || movie.poster;

  // ✅ Build meta line from whatever fields exist — skips undefined ones
  const meta = [movie.year, movie.genre, movie.director]
    .filter(Boolean)
    .join(" · ");

  return (
    <div
      className="movie-card"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="movie-card__poster-wrap">
        <img
          src={posterSrc}
          alt={movie.title}
          className="movie-card__poster"
          style={{ transform: hover ? "scale(1.06)" : "scale(1)" }}
          onError={(e) => {
            e.target.onerror = null;        // prevents infinite loop
            e.target.src = FALLBACK_POSTER; // data URI — no network request
          }}
        />
        <div className="movie-card__scrim" style={{ opacity: hover ? 1 : 0 }} />

        {/* ✅ Only show rating badge when the field actually exists */}
        {movie.rating && (
          <span className="movie-card__rating">
            <Star size={11} fill="#E94F37" color="#E94F37" /> {movie.rating}
          </span>
        )}

        <div className="movie-card__overlay" style={{ opacity: hover ? 1 : 0 }}>
          <button
            className="movie-card__play-btn"
            aria-label={`Play ${movie.title}`}
          >
            <Play size={14} fill="#0B0B0E" />
          </button>
        </div>
      </div>

      <div className="movie-card__info">
        <p className="movie-card__title">{movie.title}</p>

        {/* ✅ Shows year · genre · director — whichever are present */}
        {meta && <p className="movie-card__meta">{meta}</p>}

        {/* ✅ Shows match reason for related/all API movies */}
        {movie.matched_because && (
          <p className="movie-card__match">{movie.matched_because}</p>
        )}
      </div>
    </div>
  );
}
