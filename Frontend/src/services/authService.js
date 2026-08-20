export const signupUser = async ({ name, email, password }) => {
  const res = await fetch(`${import.meta.env.VITE_BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Signup failed");
  return data;
};

export const signinUser = async ({ email, password }) => {
  const res = await fetch(`${import.meta.env.VITE_BASE_URL}/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // backend signin_controller expects "identifier" (email OR username), not "email"
    body: JSON.stringify({ identifier: email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");
  return data;
};