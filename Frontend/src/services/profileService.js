const BASE_URL = "http://localhost:5000/v1/api";

export const updateProfile = async ({ email, interest, actor, director }) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/profile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ email, interest, actor, director }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Profile update failed");
  return data;
};