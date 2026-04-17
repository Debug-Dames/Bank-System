/**
 * Validates a South African ID number using the Luhn algorithm
 * Format: YYMMDD GSSS C A Z
 *   YY = year of birth, MM = month, DD = day
 *   G  = gender (0-4 female, 5-9 male)
 *   SSS = sequence number
 *   C  = citizenship (0 = SA, 1 = permanent resident)
 *   A  = usually 8 (race, deprecated)
 *   Z  = checksum digit
 */
export const validateSAIdNumber = (idNumber) => {
  if (!idNumber || typeof idNumber !== "string") return false;
  if (!/^\d{13}$/.test(idNumber)) return false;

  // Validate date portion
  const year = parseInt(idNumber.substring(0, 2));
  const month = parseInt(idNumber.substring(2, 4));
  const day = parseInt(idNumber.substring(4, 6));

  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;

  // Luhn checksum
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    let digit = parseInt(idNumber[i]);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === parseInt(idNumber[12]);
};

/**
 * Extract date of birth from SA ID number
 */
export const getDobFromIdNumber = (idNumber) => {
  const yy = parseInt(idNumber.substring(0, 2));
  const mm = idNumber.substring(2, 4);
  const dd = idNumber.substring(4, 6);
  const currentYear = new Date().getFullYear() % 100;
  const century = yy <= currentYear ? 2000 : 1900;
  return new Date(`${century + yy}-${mm}-${dd}`);
};

/**
 * Get gender from SA ID number
 * Digits 6-9: 0-4999 = Female, 5000-9999 = Male
 */
export const getGenderFromIdNumber = (idNumber) => {
  const genderCode = parseInt(idNumber.substring(6, 10));
  return genderCode >= 5000 ? "Male" : "Female";
};

/**
 * Validate South African phone number
 * Accepts: 0712345678, +27712345678, 27712345678
 */
export const validatePhoneNumber = (phone) => {
  if (!phone) return false;
  const cleaned = phone.replace(/\s+/g, "");
  return /^(\+27|27|0)[6-8][0-9]{8}$/.test(cleaned);
};

/**
 * Normalize phone to 0XXXXXXXXX format
 */
export const normalizePhone = (phone) => {
  const cleaned = phone.replace(/\s+/g, "");
  if (cleaned.startsWith("+27")) return "0" + cleaned.slice(3);
  if (cleaned.startsWith("27") && cleaned.length === 11) return "0" + cleaned.slice(2);
  return cleaned;
};

/**
 * Validate email format
 */
export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Validate password strength
 * Min 8 chars, at least 1 uppercase, 1 lowercase, 1 number
 */
export const validatePassword = (password) => {
  if (!password || password.length < 8) return false;
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
};

/**
 * Validate a 4-digit PIN
 */
export const validatePin = (pin) => {
  return /^\d{4}$/.test(pin);
};

/**
 * Validate meter number (11 digits for SA prepaid electricity)
 */
export const validateMeterNumber = (meter) => {
  return /^\d{11}$/.test(meter);
};