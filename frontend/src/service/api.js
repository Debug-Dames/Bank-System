const normalizeApiUrl = (raw) => {
  const trimmed = String(raw || "").trim().replace(/\/+$/, "");
  if (!trimmed) return "http://localhost:8000/api";
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
};

const API_URL = normalizeApiUrl(import.meta.env.VITE_API_URL);

const getHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const parseJsonSafe = async (res) => {
  try {
    return await res.json();
  } catch {
    return null;
  }
};

const requestJson = async (path, options = {}) => {
  const normalizedPath = String(path || "").startsWith("/") ? path : `/${path}`;
  const res = await fetch(`${API_URL}${normalizedPath}`, {
    headers: getHeaders(),
    ...options,
  });

  if (!res.ok) {
    const errorData = await parseJsonSafe(res);
    const message =
      errorData?.message ||
      errorData?.error ||
      `Request failed (${res.status})`;
    throw new Error(message);
  }

  return parseJsonSafe(res);
};

// ======================== AUTH ========================

export const loginUser = async (data) =>
  requestJson("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const registerUser = async (data) =>
  requestJson("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getProfileAPI = async () =>
  requestJson("/auth/me", { method: "GET" });

// ======================== ACCOUNTS ========================

export const getMyAccountsAPI = async () =>
  requestJson("/account", { method: "GET" });

// ===================== TRANSACTIONS =====================

export const getTransactionsAPI = async (accountId) =>
  requestJson(`/transactions/history/${accountId}`, { method: "GET" });

export const depositAPI = async (data) => {
  const { accountId, ...payload } = data || {};
  if (!accountId) throw new Error("accountId is required");

  return requestJson(`/transactions/${accountId}/deposit`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const withdrawAPI = async (data) => {
  const { accountId, ...payload } = data || {};
  if (!accountId) throw new Error("accountId is required");

  return requestJson(`/transactions/${accountId}/withdraw`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

// ======================== SAVINGS PLANS ========================

export const getSavingsPlansAPI = async () =>
  requestJson("/savings-plans", { method: "GET" });

export const createSavingsPlanAPI = async (data) =>
  requestJson("/savings-plans", {
    method: "POST",
    body: JSON.stringify(data),
  });

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
  return requestJson(`/savings-plans/${planId}`, { method: "DELETE" });
};
