import MovieCard from "../MovieCard/MovieCard";
import "./MovieGrid.css";

export default function MovieGrid({ movies, loading, title = "Popular Right Now" }) {
  return (
    <main className="movie-grid-section">
      <div className="movie-grid-section__head">
        <h2 className="movie-grid-section__title">{title}</h2>
        <span className="movie-grid-section__count">
          {loading ? "" : `${movies.length} titles`}
        </span>
      </div>

      {loading ? (
        <div className="movie-grid">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="movie-grid__skeleton" />
          ))}
        </div>
      ) : movies.length === 0 ? (
        <p className="movie-grid-section__empty">No movies found. Check back soon.</p>
      ) : (
        <div className="movie-grid">
          {movies.map((m) => (
            // ✅ was key={m.id} — API has no id field, title is unique and stable
            <MovieCard key={m.title} movie={m} />
          ))}
        </div>
      )}
    </main>
  );
}
