import api from "./api";

function normalizeAccountArgs(accountIdOrOptions, payload = {}) {
  if (typeof accountIdOrOptions === "object" && accountIdOrOptions !== null) {
    const { accountId, ...body } = accountIdOrOptions;
    return { accountId, payload: { ...body } };
  }

  return {
    accountId: accountIdOrOptions,
    payload,
  };
}

export async function getTransactionHistory(accountIdOrOptions, query = {}) {
  const { accountId, payload } = normalizeAccountArgs(accountIdOrOptions, query);
  return api.get(`/transactions/history/${accountId}`, { params: payload });
}

export async function getTransactions(accountIdOrOptions, query = {}) {
  return getTransactionHistory(accountIdOrOptions, query);
}

export async function depositFunds(accountIdOrOptions, payload = {}) {
  const { accountId, payload: body } = normalizeAccountArgs(accountIdOrOptions, payload);
  console.log("Depositing to account:", accountId, "with data:", body);
  return api.post(`/transactions/${accountId}/deposit`, body);
}

export async function withdrawFunds(accountIdOrOptions, payload = {}) {
  const { accountId, payload: body } = normalizeAccountArgs(accountIdOrOptions, payload);
  return api.post(`/transactions/${accountId}/withdraw`, body);
}

export async function sendCash(accountIdOrOptions, payload = {}) {
  const { accountId, payload: body } = normalizeAccountArgs(accountIdOrOptions, payload);
  return api.post(`/transactions/${accountId}/send-cash`, body);
}

export async function buyAirtime(accountIdOrOptions, payload = {}) {
  const { accountId, payload: body } = normalizeAccountArgs(accountIdOrOptions, payload);
  return api.post(`/transactions/${accountId}/utility/airtime`, body);
}

export async function buyElectricity(accountIdOrOptions, payload = {}) {
  const { accountId, payload: body } = normalizeAccountArgs(accountIdOrOptions, payload);
  return api.post(`/transactions/${accountId}/utility/electricity`, body);
}
