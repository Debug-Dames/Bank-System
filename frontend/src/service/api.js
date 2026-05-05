const API_URL = import.meta.env.VITE_API_URL;

// 🔐 helper to attach token (important for protected routes)
const getHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// ✅ LOGIN (unchanged logic, just safer)
export const loginUser = async (data) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Login failed");
  }

  return res.json();
};

// ✅ GET TRANSACTIONS (THIS WAS MISSING)
export const getTransactionsAPI = async (accountId) => {
  const res = await fetch(
    `${API_URL}/transactions?accountId=${accountId}`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to fetch transactions");
  }

  return res.json();
};