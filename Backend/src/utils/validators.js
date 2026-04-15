const VALID_NETWORK_PROVIDERS = ["MTN", "Vodacom", "Cell C", "Telkom"];
const VALID_BANKS = [
  "Absa",
  "Capitec",
  "Discovery Bank",
  "FNB",
  "Nedbank",
  "Standard Bank",
  "TymeBank",
];

const trimString = (value) =>
  typeof value === "string" ? value.trim() : value;

const normalizePhoneNumber = (value) => {
  const phone = trimString(value);
  return typeof phone === "string" ? phone.replace(/\s+/g, "") : phone;
};

const isNonEmptyString = (value) =>
  typeof value === "string" && value.trim().length > 0;

const isValidEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());

const isValidPhoneNumber = (value) =>
  /^(\+27|0)[6-8][0-9]{8}$/.test(String(value || "").replace(/\s+/g, ""));

const isValidIdNumber = (value) => /^\d{13}$/.test(String(value || "").trim());

const isValidAccountNumber = (value) =>
  /^\d{6,20}$/.test(String(value || "").trim());

const isValidCardNumber = (value) =>
  /^\d{13,19}$/.test(String(value || "").replace(/\s+/g, ""));

const isValidExpiryDate = (value) =>
  /^(0[1-9]|1[0-2])\/\d{2}$/.test(String(value || "").trim());

const isValidPin = (value) => /^\d{4,6}$/.test(String(value || "").trim());

const isPositiveAmount = (value) =>
  typeof value === "number" && Number.isFinite(value) && value > 0;

const addError = (errors, field, message) => {
  errors.push({ field, message });
};

const normalizeAmount = (value) => {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim() !== "") {
    return Number(value);
  }
  return value;
};

export const sanitizeRegisterInput = (payload = {}) => ({
  firstName: trimString(payload.firstName),
  lastName: trimString(payload.lastName),
  idNumber: trimString(payload.idNumber),
  email: trimString(payload.email)?.toLowerCase(),
  password: payload.password,
  confirmPassword: payload.confirmPassword,
  phoneNumber: normalizePhoneNumber(payload.phoneNumber),
  pin: trimString(payload.pin),
});

export const validateRegisterInput = (payload = {}) => {
  const data = sanitizeRegisterInput(payload);
  const errors = [];

  if (!isNonEmptyString(data.firstName)) {
    addError(errors, "firstName", "First name is required.");
  }

  if (!isNonEmptyString(data.lastName)) {
    addError(errors, "lastName", "Last name is required.");
  }

  if (!isValidIdNumber(data.idNumber)) {
    addError(errors, "idNumber", "ID number must be 13 digits.");
  }

  if (!isValidEmail(data.email)) {
    addError(errors, "email", "Email address is invalid.");
  }

  if (typeof data.password !== "string" || data.password.length < 8) {
    addError(errors, "password", "Password must be at least 8 characters.");
  }

  if (data.password !== data.confirmPassword) {
    addError(errors, "confirmPassword", "Passwords do not match.");
  }

  if (!isValidPhoneNumber(data.phoneNumber)) {
    addError(
      errors,
      "phoneNumber",
      "Phone number must be a valid South African mobile number."
    );
  }

  if (!isValidPin(data.pin)) {
    addError(errors, "pin", "PIN must be 4 to 6 digits.");
  }

  return {
    isValid: errors.length === 0,
    errors,
    value: data,
  };
};

export const sanitizeLoginInput = (payload = {}) => ({
  idNumber: trimString(payload.idNumber),
  pin: trimString(payload.pin),
});

export const validateLoginInput = (payload = {}) => {
  const data = sanitizeLoginInput(payload);
  const errors = [];

  if (!isValidIdNumber(data.idNumber)) {
    addError(errors, "idNumber", "ID number must be 13 digits.");
  }

  if (!isValidPin(data.pin)) {
    addError(errors, "pin", "PIN must be 4 to 6 digits.");
  }

  return {
    isValid: errors.length === 0,
    errors,
    value: data,
  };
};

export const sanitizeOpenAccountInput = (payload = {}) => ({
  citizenId: trimString(payload.citizenId ?? payload.idCitizen),
  firstName: trimString(payload.firstName),
  lastName: trimString(payload.lastName),
  phoneNumber: normalizePhoneNumber(payload.phoneNumber),
  monthlyIncome: normalizeAmount(payload.monthlyIncome),
  accountType: trimString(payload.accountType)?.toLowerCase(),
});

export const validateOpenAccountInput = (payload = {}) => {
  const data = sanitizeOpenAccountInput(payload);
  const errors = [];
  const allowedAccountTypes = ["transactional", "savings", "current"];

  if (!isValidIdNumber(data.citizenId)) {
    addError(errors, "citizenId", "Citizen ID must be 13 digits.");
  }

  if (!isNonEmptyString(data.firstName)) {
    addError(errors, "firstName", "First name is required.");
  }

  if (!isNonEmptyString(data.lastName)) {
    addError(errors, "lastName", "Last name is required.");
  }

  if (!isValidPhoneNumber(data.phoneNumber)) {
    addError(
      errors,
      "phoneNumber",
      "Phone number must be a valid South African mobile number."
    );
  }

  if (
    typeof data.monthlyIncome !== "number" ||
    !Number.isFinite(data.monthlyIncome) ||
    data.monthlyIncome < 0
  ) {
    addError(
      errors,
      "monthlyIncome",
      "Monthly income must be a valid amount greater than or equal to 0."
    );
  }

  if (
    data.accountType &&
    !allowedAccountTypes.includes(data.accountType)
  ) {
    addError(
      errors,
      "accountType",
      "Account type must be transactional, savings, or current."
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    value: {
      ...data,
      accountType: data.accountType || "transactional",
    },
  };
};

export const sanitizeCardInput = (payload = {}) => ({
  cardholderName: trimString(payload.cardholderName),
  accountNumber: trimString(payload.accountNumber),
  cardNumber: trimString(payload.cardNumber)?.replace(/\s+/g, ""),
  expiryDate: trimString(payload.expiryDate),
  cvv: trimString(payload.cvv),
  limits: {
    atmWithdrawal: normalizeAmount(payload.limits?.atmWithdrawal),
    cardPurchase: normalizeAmount(payload.limits?.cardPurchase),
    onlinePurchase: normalizeAmount(payload.limits?.onlinePurchase),
  },
});

export const validateCardInput = (payload = {}) => {
  const data = sanitizeCardInput(payload);
  const errors = [];

  if (!isNonEmptyString(data.cardholderName)) {
    addError(errors, "cardholderName", "Cardholder name is required.");
  }

  if (!isValidAccountNumber(data.accountNumber)) {
    addError(errors, "accountNumber", "Account number is invalid.");
  }

  if (!isValidCardNumber(data.cardNumber)) {
    addError(errors, "cardNumber", "Card number must contain 13 to 19 digits.");
  }

  if (!isValidExpiryDate(data.expiryDate)) {
    addError(errors, "expiryDate", "Expiry date must be in MM/YY format.");
  }

  if (!/^\d{3,4}$/.test(String(data.cvv || ""))) {
    addError(errors, "cvv", "CVV must be 3 or 4 digits.");
  }

  for (const [limitName, limitValue] of Object.entries(data.limits)) {
    if (
      limitValue !== undefined &&
      (typeof limitValue !== "number" ||
        !Number.isFinite(limitValue) ||
        limitValue < 0)
    ) {
      addError(
        errors,
        `limits.${limitName}`,
        "Card limit must be a valid amount greater than or equal to 0."
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    value: data,
  };
};

export const sanitizeTransactionInput = (payload = {}) => ({
  type: trimString(payload.type)?.toLowerCase(),
  amount: normalizeAmount(payload.amount),
  accountNumber: trimString(payload.accountNumber),
  reference: trimString(payload.reference),
  note: trimString(payload.note),
  networkProvider: trimString(payload.networkProvider),
  phoneNumber: normalizePhoneNumber(payload.phoneNumber),
  bundle: trimString(payload.bundle),
  meterNumber: trimString(payload.meterNumber),
  beneficiaryName: trimString(payload.beneficiaryName),
  beneficiaryAccountNumber: trimString(payload.beneficiaryAccountNumber),
  bank: trimString(payload.bank),
  recipientName: trimString(payload.recipientName),
  secretPin: trimString(payload.secretPin),
});

export const validateTransactionInput = (payload = {}) => {
  const data = sanitizeTransactionInput(payload);
  const errors = [];
  const allowedTypes = [
    "airtime",
    "data",
    "electricity",
    "transfer",
    "send_cash",
    "deposit",
    "withdrawal",
  ];

  if (!allowedTypes.includes(data.type)) {
    addError(errors, "type", "Transaction type is invalid.");
  }

  if (!isPositiveAmount(data.amount)) {
    addError(errors, "amount", "Amount must be greater than 0.");
  }

  if (!isValidAccountNumber(data.accountNumber)) {
    addError(errors, "accountNumber", "Account number is invalid.");
  }

  if (data.type === "airtime" || data.type === "data") {
    if (!VALID_NETWORK_PROVIDERS.includes(data.networkProvider)) {
      addError(
        errors,
        "networkProvider",
        "Network provider must be MTN, Vodacom, Cell C, or Telkom."
      );
    }

    if (!isValidPhoneNumber(data.phoneNumber)) {
      addError(
        errors,
        "phoneNumber",
        "Phone number must be a valid South African mobile number."
      );
    }
  }

  if (data.type === "data" && !isNonEmptyString(data.bundle)) {
    addError(errors, "bundle", "Bundle is required for data purchases.");
  }

  if (data.type === "electricity" && !/^\d{6,20}$/.test(data.meterNumber || "")) {
    addError(errors, "meterNumber", "Meter number is invalid.");
  }

  if (data.type === "transfer") {
    if (!isNonEmptyString(data.beneficiaryName)) {
      addError(errors, "beneficiaryName", "Beneficiary name is required.");
    }

    if (!isValidAccountNumber(data.beneficiaryAccountNumber)) {
      addError(
        errors,
        "beneficiaryAccountNumber",
        "Beneficiary account number is invalid."
      );
    }

    if (!isNonEmptyString(data.reference)) {
      addError(errors, "reference", "Reference is required for transfers.");
    }

    if (!VALID_BANKS.includes(data.bank)) {
      addError(errors, "bank", "Bank is invalid.");
    }
  }

  if (data.type === "send_cash") {
    if (!isNonEmptyString(data.recipientName)) {
      addError(errors, "recipientName", "Recipient name is required.");
    }

    if (!isValidPhoneNumber(data.phoneNumber)) {
      addError(
        errors,
        "phoneNumber",
        "Phone number must be a valid South African mobile number."
      );
    }

    if (!isValidPin(data.secretPin)) {
      addError(errors, "secretPin", "Secret PIN must be 4 to 6 digits.");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    value: data,
  };
};

export const validateDepositInput = (payload = {}) =>
  validateTransactionInput({ ...payload, type: "deposit" });

export const validateWithdrawalInput = (payload = {}) =>
  validateTransactionInput({ ...payload, type: "withdrawal" });

export const validationRules = {
  register: validateRegisterInput,
  login: validateLoginInput,
  openAccount: validateOpenAccountInput,
  createCard: validateCardInput,
  transaction: validateTransactionInput,
  deposit: validateDepositInput,
  withdrawal: validateWithdrawalInput,
};

export {
  VALID_BANKS,
  VALID_NETWORK_PROVIDERS,
  isValidAccountNumber,
  isValidEmail,
  isValidIdNumber,
  isValidPhoneNumber,
  isValidPin,
};
