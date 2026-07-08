// core/marketing/coupons.js

const MONTHS = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
];

/**
 * Returns deterministic coupon codes for a given date (defaults to now).
 * @param {Date} [date]
 * @returns {{code10: string, code15: string, monthName: string, year: number}}
 */
export function getMonthlyCoupons(date = new Date()) {
  const year = date.getFullYear();
  const monthIndex = date.getMonth();
  const monthName = MONTHS[monthIndex];

  return {
    code10: `${monthName}${year}_10`,
    code15: `${monthName}${year}_15`,
    monthName,
    year
  };
}

/**
 * Validates whether a coupon code matches the current month's active codes.
 * @param {string} code
 * @param {Date} [date]
 * @returns {boolean}
 */
export function isValidMonthlyCoupon(code, date = new Date()) {
  const coupons = getMonthlyCoupons(date);
  const upperCode = (code || '').toUpperCase().trim();
  return upperCode === coupons.code10 || upperCode === coupons.code15;
}
