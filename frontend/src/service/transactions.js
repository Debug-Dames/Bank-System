import api from "./api";

function normalizeAccountArgs(accountIdOrOptions, payload = {}) {
  if (
    typeof accountIdOrOptions === "object" &&
    accountIdOrOptions !== null
  ) {
    const { accountId, ...body } = accountIdOrOptions;

    return {
      accountId,
      payload: body,
    };
  }

  return {
    accountId: accountIdOrOptions,
    payload,
  };
}

export async function getTransactionHistory(
  accountIdOrOptions,
  query = {}
) {
  const { accountId, payload } = normalizeAccountArgs(
    accountIdOrOptions,
    query
  );

  const response = await api.get(
    `/transactions/history/${accountId}`,
    {
      params: payload,
    }
  );

  return response.data;
}

export async function getTransactions(
  accountIdOrOptions,
  query = {}
) {
  return getTransactionHistory(accountIdOrOptions, query);
}

export async function depositFunds(
  accountIdOrOptions,
  payload = {}
) {
  const { accountId, payload: body } =
    normalizeAccountArgs(accountIdOrOptions, payload);

  const response = await api.post(
    `/transactions/${accountId}/deposit`,
    body
  );

  return response.data;
}

export async function withdrawFunds(
  accountIdOrOptions,
  payload = {}
) {
  const { accountId, payload: body } =
    normalizeAccountArgs(accountIdOrOptions, payload);

  const response = await api.post(
    `/transactions/${accountId}/withdraw`,
    body
  );

  return response.data;
}

export async function sendCash(
  accountIdOrOptions,
  payload = {}
) {
  const { accountId, payload: body } =
    normalizeAccountArgs(accountIdOrOptions, payload);

  const response = await api.post(
    `/transactions/${accountId}/send-cash`,
    body
  );

  return response.data;
}

export async function buyAirtime(
  accountIdOrOptions,
  payload = {}
) {
  const { accountId, payload: body } =
    normalizeAccountArgs(accountIdOrOptions, payload);

  const response = await api.post(
    `/transactions/${accountId}/utility/airtime`,
    body
  );

  return response.data;
}

export async function buyElectricity(
  accountIdOrOptions,
  payload = {}
) {
  const { accountId, payload: body } =
    normalizeAccountArgs(accountIdOrOptions, payload);

  const response = await api.post(
    `/transactions/${accountId}/utility/electricity`,
    body
  );

  return response.data;
}