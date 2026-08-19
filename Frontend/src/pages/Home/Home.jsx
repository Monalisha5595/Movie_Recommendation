import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import MovieGrid from "../../components/MovieGrid/MovieGrid";
import Footer from "../../components/Footer/Footer";
import { getMovies, getRecommendedMovies, getAlsoLikeMovies } from "../../services/movieService";
import "./Home.css";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [alsoLike, setAlsoLike] = useState([]);
  const [recLoading, setRecLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Still fetch getMovies() for the Hero banner's featured movie,
    // just don't render it as its own grid section anymore.
    getMovies()
      .then((data) => {
        setMovies(data);
      })
      .catch((err) => {
        console.log("Fetch movies error:", err.message);
        setError("Could not load movies. Please try again later.");
      });

    getRecommendedMovies()
      .then((data) => {
        setRecommended(data);
        setRecLoading(false);
      })
      .catch(() => setRecLoading(false));

    getAlsoLikeMovies()
      .then((data) => {
        setAlsoLike(data);
        setLikeLoading(false);
      })
      .catch(() => setLikeLoading(false));
  }, []);

  const featured = movies[0] || null;

  return (
    <div className="home-page">
      <Navbar />
      {featured && <Hero movie={featured} />}
      {error ? (
        <p className="home-page__error">{error}</p>
      ) : (
        <>
          <MovieGrid
            movies={recommended}
            loading={recLoading}
            title="Recommended For You"
          />
          <MovieGrid
            movies={alsoLike}
            loading={likeLoading}
            title="You May Also Like"
          />
        </>
      )}
      <Footer />
    </div>
  );
}