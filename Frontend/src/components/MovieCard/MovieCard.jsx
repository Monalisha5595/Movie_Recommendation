import { useState } from "react";
import { Play, Star } from "lucide-react";
import "./MovieCard.css";

export default function MovieCard({ movie }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      className="movie-card"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="movie-card__poster-wrap">
        <img
          src={movie.poster}
          alt={movie.title}
          className="movie-card__poster"
          style={{ transform: hover ? "scale(1.06)" : "scale(1)" }}
        />
        <div className="movie-card__scrim" style={{ opacity: hover ? 1 : 0 }} />
        <span className="movie-card__rating">
          <Star size={11} fill="#E94F37" color="#E94F37" /> {movie.rating}
        </span>
        <div className="movie-card__overlay" style={{ opacity: hover ? 1 : 0 }}>
          <button className="movie-card__play-btn" aria-label={`Play ${movie.title}`}>
            <Play size={14} fill="#0B0B0E" />
          </button>
        </div>
      </div>
      <div className="movie-card__info">
        <p className="movie-card__title">{movie.title}</p>
        <p className="movie-card__meta">
          {movie.year} · {movie.genre}
        </p>
      </div>
    </div>
  );
}