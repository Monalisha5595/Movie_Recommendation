const BASE_URL = "http://localhost:5000/api";

// ---- Dummy data (backend movie API na hওয়া porjonto eta use hobe) ----
const DUMMY_MOVIES = [
  { id: 1, title: "Nightfall Protocol", year: 2024, rating: 8.4, genre: "Thriller", description: "A city that never sleeps hides a secret that never should have woken up. One detective, one deadline, one last chance to get it right.", poster: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&q=80" },
  { id: 2, title: "The Last Ember", year: 2023, rating: 7.9, genre: "Drama", description: "A family torn apart by war finds their way back through an unlikely bond.", poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&q=80" },
  { id: 3, title: "Crimson Static", year: 2024, rating: 8.1, genre: "Sci-Fi", description: "When signals from deep space start repeating human memories, one scientist must find out why.", poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80" },
  { id: 4, title: "Hollow Coast", year: 2022, rating: 7.5, genre: "Mystery", description: "A small fishing town hides secrets that resurface with the tide.", poster: "https://images.unsplash.com/photo-1512070679279-8988d32161be?w=400&q=80" },
  { id: 5, title: "Paper Moons", year: 2023, rating: 8.7, genre: "Romance", description: "Two strangers, one train, and a chance encounter that changes everything.", poster: "https://images.unsplash.com/photo-1517602302552-471fe67acf66?w=400&q=80" },
  { id: 6, title: "Iron Meridian", year: 2024, rating: 7.2, genre: "Action", description: "A convoy of survivors races across a collapsing world to reach the last safe zone.", poster: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&q=80" },
  { id: 7, title: "Glass Orbit", year: 2021, rating: 8.0, genre: "Sci-Fi", description: "A space station crew discovers their mission was never what they were told.", poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&q=80" },
  { id: 8, title: "Salt & Sirens", year: 2023, rating: 7.8, genre: "Adventure", description: "A crew of misfit sailors chase a myth that turns out to be very real.", poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80" },
  { id: 9, title: "The Quiet Hour", year: 2024, rating: 8.3, genre: "Drama", description: "In the last hour before dawn, three lives collide in a hospital waiting room.", poster: "https://images.unsplash.com/photo-1512070679279-8988d32161be?w=400&q=80" },
  { id: 10, title: "Faultline", year: 2022, rating: 7.6, genre: "Thriller", description: "An earthquake exposes a cover-up decades in the making.", poster: "https://images.unsplash.com/photo-1517602302552-471fe67acf66?w=400&q=80" },
];

const DUMMY_RECOMMENDED = [
  { id: 11, title: "Velvet Horizon", year: 2024, rating: 8.6, genre: "Drama", description: "A painter rediscovers her voice after a decade of silence.", poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&q=80" },
  { id: 12, title: "Static Bloom", year: 2023, rating: 7.7, genre: "Sci-Fi", description: "A gardener on a dying station grows the last living thing in the galaxy.", poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80" },
  { id: 13, title: "Midnight Ferry", year: 2022, rating: 8.2, genre: "Thriller", description: "The last ferry of the night carries six strangers and one killer.", poster: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&q=80" },
  { id: 14, title: "Amber Trail", year: 2024, rating: 7.9, genre: "Adventure", description: "A cartographer chases a map that redraws itself every full moon.", poster: "https://images.unsplash.com/photo-1512070679279-8988d32161be?w=400&q=80" },
  { id: 15, title: "Quiet Static", year: 2023, rating: 8.4, genre: "Mystery", description: "A radio host receives calls from a town that vanished thirty years ago.", poster: "https://images.unsplash.com/photo-1517602302552-471fe67acf66?w=400&q=80" },
];

const DUMMY_ALSO_LIKE = [
  { id: 16, title: "Rustwater", year: 2021, rating: 7.4, genre: "Action", description: "A retired mercenary is pulled back in for one impossible job.", poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80" },
  { id: 17, title: "The Long Static", year: 2024, rating: 8.0, genre: "Sci-Fi", description: "A signal from Earth's past threatens to unravel its future.", poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&q=80" },
  { id: 18, title: "Blue Hour Motel", year: 2022, rating: 7.6, genre: "Mystery", description: "Every guest who checks in leaves something behind. Nobody checks out the same.", poster: "https://images.unsplash.com/photo-1512070679279-8988d32161be?w=400&q=80" },
  { id: 19, title: "Ashfall", year: 2023, rating: 8.1, genre: "Drama", description: "A volcanologist races to warn a town that won't believe her.", poster: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&q=80" },
  { id: 20, title: "Wire & Bone", year: 2024, rating: 7.8, genre: "Thriller", description: "A prosthetics engineer finds a body wearing her own designs.", poster: "https://images.unsplash.com/photo-1517602302552-471fe67acf66?w=400&q=80" },
];

// TODO: Backend API ready hole ei function ta uncomment/replace koro
export const getMovies = async () => {
  // const res = await fetch(`${BASE_URL}/movies`);
  // if (!res.ok) throw new Error("Failed to fetch movies");
  // return res.json();

  return new Promise((resolve) => {
    setTimeout(() => resolve(DUMMY_MOVIES), 500);
  });
};

// TODO: Backend e user profile (interest/actor/directors) onujayi recommendation banate hobe
export const getRecommendedMovies = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(DUMMY_RECOMMENDED), 500);
  });
};

// TODO: Backend e "similar movies" logic diye replace koro
export const getAlsoLikeMovies = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(DUMMY_ALSO_LIKE), 500);
  });
};

export const getMovieById = async (id) => {
  const allMovies = [...DUMMY_MOVIES, ...DUMMY_RECOMMENDED, ...DUMMY_ALSO_LIKE];
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const movie = allMovies.find((m) => m.id === Number(id));
      movie ? resolve(movie) : reject(new Error("Movie not found"));
    }, 300);
  });
};