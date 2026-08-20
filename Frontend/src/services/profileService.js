const BASE_URL = "http://localhost:5000/v1/api";

export const updateProfile = async ({ email, actor, director }) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/profile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ email, actor, director }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Profile update failed");
  return data;
};

export const getProfile = async (email) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/profile?email=${encodeURIComponent(email)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch profile");
  return data;
};