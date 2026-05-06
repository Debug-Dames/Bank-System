// import api  from "./api";

import axios from "axios";

const API_URL = "http://localhost:8000/api";

// =====================
// AXIOS INSTANCE
// =====================
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// =====================
// TOKEN HELPERS
// =====================
export function setAuthToken(token) {
  localStorage.setItem("token", token);
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export function clearAuthToken() {
  localStorage.removeItem("token");
  delete api.defaults.headers.common["Authorization"];
}

// =====================
// AUTH API
// =====================
export async function loginUser(credentials) {
  try {
    const res = await api.post("/auth/login", credentials);

    const data = res.data;

    if (data?.token) {
      setAuthToken(data.token);
    }

    return data;
  } catch (err) {
    const message =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      "Login failed";
    throw new Error(message);
  }
}

export async function registerUser(payload) {
  try {
    const res = await api.post("/auth/register", payload);
    return res.data;
  } catch (err) {
    const message =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      "Registration failed";
    throw new Error(message);
  }
}

export async function getProfile() {
  const res = await api.get("/auth/me");
  return res.data;
}

export function logoutUser() {
  clearAuthToken();
}

// =====================
// GENERIC REQUEST (USED BY SLICES)
// =====================
export async function apiRequest(endpoint, method = "GET", data = null) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: data ? JSON.stringify(data) : null,
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Request failed");
  }

  return result;
}

// =====================
// ACCOUNTS API (FIX FOR authSlice)
// =====================
export async function getMyAccountsAPI() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/accounts`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to fetch accounts");
  }

  return result;
}

// =====================
// EXPORT DEFAULT (FIXED)
// =====================
export default api;
