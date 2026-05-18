const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ========================
// HEADERS
// ========================
function getHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

// ========================
// SAFE FETCH WRAPPER
// ========================
async function requestJson(url, options = {}) {
  const res = await fetch(`${API_URL}${url}`, {
    headers: getHeaders(),
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

// ========================
// SAVINGS PLANS API
// ========================
export const getSavingsPlansAPI = async () => {
  return requestJson("/savings-plans", {
    method: "GET",
  });
};

export const createSavingsPlanAPI = async (data) => {
  return requestJson("/savings-plans", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const addToSavingsPlanAPI = async ({ planId, amount }) => {
  if (!planId) throw new Error("planId is required");

  return requestJson(`/savings-plans/${planId}/add`, {
    method: "POST",
    body: JSON.stringify({ amount }),
  });
};

export const withdrawFromSavingsPlanAPI = async ({ planId, amount }) => {
  if (!planId) throw new Error("planId is required");

  return requestJson(`/savings-plans/${planId}/withdraw`, {
    method: "POST",
    body: JSON.stringify({ amount }),
  });
};

export const updateSavingsPlanAPI = async ({ planId, update }) => {
  if (!planId) throw new Error("planId is required");

  return requestJson(`/savings-plans/${planId}`, {
    method: "PUT",
    body: JSON.stringify(update || {}),
  });
};

export const deleteSavingsPlanAPI = async (planId) => {
  if (!planId) throw new Error("planId is required");

  return requestJson(`/savings-plans/${planId}`, {
    method: "DELETE",
  });
};

// ========================
// OPTIONAL BASIC SAVINGS ACCOUNT API
// ========================
export const getSavingsAPI = async () => {
  return requestJson("/savings", {
    method: "GET",
  });
};

export const createSavingsAPI = async (data) => {
  return requestJson("/savings/create", {
    method: "POST",
    body: JSON.stringify(data),
  });
};