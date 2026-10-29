/**
 * Phone Number Utilities for Zarah Nails & Beauty
 * Normalizes and validates New Zealand and international mobile numbers into standard E.164 format.
 */

export function normalizeNZPhoneNumber(input) {
  if (!input || typeof input !== 'string') {
    throw new Error('Please enter a valid mobile number.');
  }

  // Strip all whitespace, dashes, brackets, and periods
  let cleaned = input.trim().replace(/[\s\-\(\)\.]/g, '');

  if (!cleaned) {
    throw new Error('Phone number cannot be empty.');
  }

  // Handle leading international 00 prefix (e.g. 0064 -> +64)
  if (cleaned.startsWith('00')) {
    cleaned = '+' + cleaned.slice(2);
  }

  // Case 1: Standard NZ local format starting with 02 (e.g. 021, 022, 027, 028, 029, 020)
  if (/^02\d{7,9}$/.test(cleaned)) {
    return '+64' + cleaned.slice(1);
  }

  // Case 2: NZ format with country code (+64 2X...)
  if (/^\+642\d{7,9}$/.test(cleaned)) {
    return cleaned;
  }

  // Case 3: NZ format missing leading 0 or + (e.g. 6421...)
  if (/^642\d{7,9}$/.test(cleaned)) {
    return '+' + cleaned;
  }

  // Case 4: General valid international E.164 number (starts with + and has 10-15 digits)
  if (/^\+[1-9]\d{8,14}$/.test(cleaned)) {
    return cleaned;
  }

  // Invalid number format
  throw new Error('Please enter a valid New Zealand mobile number (e.g. 021 123 4567 or +64 21 123 4567).');
}

/**
 * Format an E.164 number into human-readable display format
 * e.g. +64211234567 -> +64 21 123 4567
 */
export function formatPhoneDisplay(input) {
  if (!input || typeof input !== 'string') return '';
  let e164 = input.trim();
  if (!e164.startsWith('+')) {
    try {
      e164 = normalizeNZPhoneNumber(e164);
    } catch (e) {
      return input;
    }
  }
  if (e164.startsWith('+64') && e164.length >= 11) {
    const prefix = e164.slice(0, 3); // +64
    const net = e164.slice(3, 5);    // 21, 22, 27
    const rest = e164.slice(5);
    if (rest.length === 7) {
      return `${prefix} ${net} ${rest.slice(0, 3)} ${rest.slice(3)}`;
    }
    return `${prefix} ${net} ${rest}`;
  }
  return e164;
}
