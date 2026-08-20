import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import MovieGrid from "../../components/MovieGrid/MovieGrid";
import Footer from "../../components/Footer/Footer";
import { getMovies } from "../../services/movieService";
import "./Home.css";
import { getAllMovies, getRelatedMovies } from "../../helper.js";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [allLoading, setAllLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {

    // if (!token) {
      getAllMovies(token)
        .then((allData) => {
          setAllMovies(allData);
          setAllLoading(false);
        })
        .catch((err) => {
          console.log("Fetch all movies error:", err.message);
          setAllLoading(false);
        });
    // }

    // Fetch related first, then dedupe all movies against it
    getRelatedMovies(token)
      .then((relatedData) => {
        setRelatedMovies(relatedData);

        return getAllMovies(token).then((allData) => {
          const relatedTitles = new Set(
            relatedData.map((m) => m.title.toLowerCase().trim())
          );
          const dedupedAllMovies = allData.filter(
            (m) => !relatedTitles.has(m.title.toLowerCase().trim())
          );
          setAllMovies(dedupedAllMovies);
          setAllLoading(false);
        });
      })
      .catch((err) => {
        console.log("Fetch related/all movies error:", err.message);
        setAllLoading(false);
      });
  }, []);

  const featured = movies[0] || null;

  const query = searchQuery.toLowerCase().trim();

  const filteredRelated = query
    ? relatedMovies.filter((m) => m.title.toLowerCase().includes(query))
    : relatedMovies;

  const filteredAll = query
    ? allMovies.filter((m) => m.title.toLowerCase().includes(query))
    : allMovies;

  const noResults = query && filteredRelated.length === 0 && filteredAll.length === 0;

  return (
    <div className="home-page">
      <Navbar />
      {featured && <Hero movie={featured} />}

      <div className="home-page__search">
        <input
          type="text"
          className="home-page__search-input"
          placeholder="Search movies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            className="home-page__search-clear"
            onClick={() => setSearchQuery("")}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {error ? (
        <p className="home-page__error">{error}</p>
      ) : noResults ? (
        <p className="home-page__no-results">No movies found for "{searchQuery}"</p>
      ) : (
        <>
          <MovieGrid
            movies={filteredRelated}
            loading={false}
            title="Related Movies"
            token={token}
          />
          <MovieGrid
            movies={filteredAll}
            loading={allLoading}
            title="All Movies"
          />
        </>
      )}
      <Footer />
    </div>
  );
}