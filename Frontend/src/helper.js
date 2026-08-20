export const getAllMovies = async () => {
    const token = localStorage.getItem("token"); // or wherever you store it
    const res = await fetch("http://localhost:5000/v1/api/movie/get-all-movies", {
    headers: {
      auth: token,
    },
  });
  const json = await res.json();
  if (!json.success) throw new Error("Failed to fetch all movies");
  return json.data;
};

export const getRelatedMovies = async () => {
    const token = localStorage.getItem("token"); // or wherever you store it

  const res = await fetch("http://localhost:5000/v1/api/movie/get-related-movies",{
    headers: {
      auth: token,
    },
  });
  const json = await res.json();
  if (!json.success) throw new Error("Failed to fetch related movies");
  return json.data;
};