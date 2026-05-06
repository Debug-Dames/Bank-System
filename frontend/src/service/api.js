import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // adjust if needed
});

// Attach token if exists
export function setAuthToken(token) {
  localStorage.setItem("token", token);
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export function clearAuthToken() {
  localStorage.removeItem("token");
  delete api.defaults.headers.common["Authorization"];
}


export default api;
