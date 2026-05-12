import axios from "axios";

const API_URL = "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// =====================
// TOKEN INTERCEPTOR (BEST PRACTICE)
// =====================
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// =====================
// GENERIC REQUEST WRAPPER
// =====================
export const apiRequest = async (endpoint, method = "GET", data = null) => {
  const res = await api({
    url: endpoint,
    method,
    data,
  });

  return res.data;
};

// =====================
// AUTH
// =====================
export const loginUser = async (credentials) => {
  const res = await api.post("/auth/login", credentials);

  if (res.data?.token) {
    localStorage.setItem("token", res.data.token);
  }

  return res.data;
};

export const registerUser = async (payload) => {
  const res = await api.post("/auth/register", payload);
  return res.data;
};

export const getProfile = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};

// =====================
// ACCOUNTS
// =====================
// export const getAccounts = async () => {
//   const res = await api.get("/accounts");
//   return res.data;
// };

// =====================
// EXPORT
// =====================
export default api;