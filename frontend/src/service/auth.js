import api, { setAuthToken, clearAuthToken } from "./api";

export async function loginUser(credentials) {
  const data = await api.post("/auth/login", credentials);
  if (data?.token) {
    setAuthToken(data.token);
  }
  return data;
}

export async function registerUser(payload) {
  return api.post("/auth/register", payload);
}

export async function getProfile() {
  return api.get("/auth/me");
}

export function logoutUser() {
  clearAuthToken();
}
