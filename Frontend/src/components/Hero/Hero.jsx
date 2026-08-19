import { Play, Info, Star } from "lucide-react";
import "./Hero.css";

export default function Hero({ movie }) {
  if (!movie) return null;

  return (
    <header className="hero">
      <img src={movie.poster} alt="" className="hero__img" />
      <div className="hero__scrim" />
      <div className="hero__content">
        <span className="hero__eyebrow">Featured Tonight</span>
        <h1 className="hero__title">{movie.title}</h1>
        <div className="hero__meta">
          <span className="hero__rating">
            <Star size={13} fill="#E94F37" color="#E94F37" /> {movie.rating}
          </span>
          <span className="hero__meta-dim">{movie.year}</span>
          <span className="hero__meta-dim">{movie.genre}</span>
        </div>
        <p className="hero__desc">{movie.description}</p>
        <div className="hero__actions">
          <button className="hero__play-btn">
            <Play size={18} fill="#0B0B0E" /> Play
          </button>
          <button className="hero__info-btn">
            <Info size={18} /> More Info
          </button>
        </div>
      </div>
    </header>
  );
}