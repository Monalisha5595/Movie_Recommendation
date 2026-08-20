export const getAllMovies = async (token) => {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/movie/get-all-movies`, {
    headers: {
      auth: token,
    },
  });
  const json = await res.json();
  if (!json.success) throw new Error("Failed to fetch all movies");
  return json.data;
};

export const getRelatedMovies = async (token) => {
  console.log("ENV: ", import.meta.env.VITE_BASE_URL)
  const res = await fetch(`${import.meta.env.VITE_BASE_URL}/movie/get-related-movies`,{
    headers: {
      auth: token,
    },
  });
  const json = await res.json();
  if (!json.success) throw new Error("Failed to fetch related movies");
  return json.data;
};