const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;

/** Keeps only digits, so users can't type letters/symbols into phone fields. */
export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

/** Drops a leading country code (e.g. +91) so "+91 98765 43210" validates like "9876543210". */
function last10Digits(digits: string): string {
  return digits.length > 10 ? digits.slice(-10) : digits;
}

export function isValidIndianMobile(value: string): boolean {
  return INDIAN_MOBILE_REGEX.test(last10Digits(onlyDigits(value)));
}

export function mobileError(
  value: string,
  required = true,
): string | undefined {
  const digits = onlyDigits(value);
  if (!digits) {
    return required ? 'Mobile number is required' : undefined;
  }
  const normalized = last10Digits(digits);
  if (normalized.length < 10) {
    return 'Enter a 10-digit mobile number';
  }
  if (!INDIAN_MOBILE_REGEX.test(normalized)) {
    return 'Enter a valid Indian mobile number';
  }
  return undefined;
}

export function requiredError(
  value: string | null | undefined,
  fieldName: string,
): string | undefined {
  return value && value.trim() ? undefined : `${fieldName} is required`;
}
