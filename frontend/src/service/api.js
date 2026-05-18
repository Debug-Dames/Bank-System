// src/services/api.js

import axios from "axios";


// AXIOS INSTANCE

const API_URL = "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


// GENERIC REQUEST WRAPPER

export const apiRequest = async (
  endpoint,
  method = "GET",
  data = null
) => {
  try {
    const res = await api({
      url: endpoint,
      method,
      data,
    });

    return res.data;
  } catch (error) {
    console.error(
      "API ERROR:",
      error.response?.data || error.message
    );

    throw error.response?.data || error;
  }
};

// ===============================
// AUTH - LOGIN
// ===============================
export const loginUser = async (credentials) => {
  try {
    console.log("LOGIN PAYLOAD:", credentials);

    const res = await api.post("/auth/login", credentials);

    console.log("LOGIN RESPONSE:", res.data);

    // Save token
    if (res.data?.token) {
      localStorage.setItem("token", res.data.token);
    }

    return res.data;
  } catch (error) {
    console.error(
      "LOGIN ERROR:",
      error.response?.data || error.message
    );

    throw error.response?.data || error;
  }
};

// ===============================
// AUTH - REGISTER
// ===============================
export const registerUser = async (userData) => {
  try {
    // DEBUG
    console.log("REGISTER PAYLOAD:", userData);

    // Ensure payload matches backend schema
    const payload = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      idNumber: userData.idNumber,
      password: userData.password,
      confirmPassword: userData.confirmPassword,
      pin: userData.pin,
    };

    const res = await api.post("/auth/register", payload);

    console.log("REGISTER RESPONSE:", res.data);

    // Save token if backend returns one
    if (res.data?.token) {
      localStorage.setItem("token", res.data.token);
    }

    return res.data;
  } catch (error) {
    console.error(
      "REGISTER ERROR:",
      error.response?.data || error.message
    );

    throw error.response?.data || error;
  }
};

// ===============================
// GET CURRENT USER PROFILE
// ===============================
export const getProfile = async () => {
  try {
    const res = await api.get("/auth/me");

    return res.data;
  } catch (error) {
    console.error(
      "PROFILE ERROR:",
      error.response?.data || error.message
    );

    throw error.response?.data || error;
  }
};

// ===============================
// LOGOUT
// ===============================
export const logoutUser = () => {
  localStorage.removeItem("token");
};

// ===============================
// ACCOUNTS
// ===============================
export const getAccounts = async () => {
  try {
    const res = await api.get("/accounts");

    return res.data;
  } catch (error) {
    console.error(
      "GET ACCOUNTS ERROR:",
      error.response?.data || error.message
    );

    throw error.response?.data || error;
  }
};

// ===============================
// TRANSACTIONS
// ===============================
export const getTransactions = async (accountId) => {
  try {
    const res = await api.get(
      `/transactions/${accountId}/history`
    );

    return res.data;
  } catch (error) {
    console.error(
      "TRANSACTION ERROR:",
      error.response?.data || error.message
    );

    throw error.response?.data || error;
  }
};

// ===============================
// MONEY TRANSFER
// ===============================
export const transferMoney = async (transferData) => {
  try {
    const res = await api.post(
      "/transactions/transfer",
      transferData
    );

    return res.data;
  } catch (error) {
    console.error(
      "TRANSFER ERROR:",
      error.response?.data || error.message
    );

    throw error.response?.data || error;
  }
};

// ===============================
// AIRTIME PURCHASE
// ===============================
export const purchaseAirtime = async (accountId, data) => {
  try {
    const res = await api.post(
      `/transactions/${accountId}/airtime`,
      data
    );

    return res.data;
  } catch (error) {
    console.error(
      "AIRTIME ERROR:",
      error.response?.data || error.message
    );

    throw error.response?.data || error;
  }
};

// ===============================
// DATA PURCHASE
// ===============================
export const purchaseData = async (accountId, data) => {
  try {
    const res = await api.post(
      `/transactions/${accountId}/data`,
      data
    );

    return res.data;
  } catch (error) {
    console.error(
      "DATA PURCHASE ERROR:",
      error.response?.data || error.message
    );

    throw error.response?.data || error;
  }
};

// ===============================
// ELECTRICITY PURCHASE
// ===============================
export const purchaseElectricity = async (
  accountId,
  data
) => {
  try {
    const res = await api.post(
      `/transactions/${accountId}/electricity`,
      data
    );

    return res.data;
  } catch (error) {
    console.error(
      "ELECTRICITY ERROR:",
      error.response?.data || error.message
    );

    throw error.response?.data || error;
  }
};

// ===============================
// EXPORT API INSTANCE
// ===============================
export default api;
