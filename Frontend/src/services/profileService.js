export const updateProfile = async ({ email, actor, director }) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${import.meta.env.VITE_BASE_URL}/user/update-profile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { auth: token } : {}),
    },
    body: JSON.stringify({ email, actor, director }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Profile update failed");
  return data;
};

export const getProfile = async (email) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${import.meta.env.VITE_BASE_URL}/user/get-profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { auth: token } : {}),
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch profile");
  return data;
};