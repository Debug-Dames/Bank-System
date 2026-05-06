import api from "./api";

export const getAccounts = async () => {
  return api.get("/account");
};