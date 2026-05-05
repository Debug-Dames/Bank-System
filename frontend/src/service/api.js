const API_URL = import.meta.env.VITE_API_URL;

// 🔐 Attach token for protected routes
const getHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

//
// ======================== AUTH ========================
//

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

//
// ===================== TRANSACTIONS =====================
//

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

//
// ======================== DEPOSIT ========================
//

export const depositAPI = async (data) => {
  const res = await fetch(`${API_URL}/deposit`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Deposit failed");
  }

  return res.json();
};

//
// ======================== WITHDRAW ========================
//

export const withdrawAPI = async (data) => {
  const res = await fetch(`${API_URL}/withdraw`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Withdraw failed");
  }

  return res.json();
};

//
// ======================== SAVINGS ========================
//

export const createSavingsAPI = async (data) => {
  const res = await fetch(`${API_URL}/savings/create`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create savings");
  }

  return res.json();
};