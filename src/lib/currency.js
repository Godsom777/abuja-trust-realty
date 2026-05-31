// Abuja Trust Realty Currency formatting and conversion utilities
// Conversion constants:
// $1 USD = ₦1,500 NGN
// £1 GBP = ₦1,900 NGN
export const CONVERSION_RATES = {
  ngn: 1,
  usd: 1 / 1500,
  gbp: 1 / 1900
};

export const CURRENCY_SYMBOLS = {
  ngn: '₦',
  usd: '$',
  gbp: '£'
};

/**
 * Converts a price in Naira to a target currency
 * @param {number} priceNgn 
 * @param {'ngn' | 'usd' | 'gbp'} targetCurrency 
 * @returns {number}
 */
export function convertPrice(priceNgn, targetCurrency = 'ngn') {
  if (!priceNgn) return 0;
  const rate = CONVERSION_RATES[targetCurrency.toLowerCase()] || 1;
  return priceNgn * rate;
}

/**
 * Formats a currency amount into a clean localized string
 * @param {number} amount 
 * @param {'ngn' | 'usd' | 'gbp'} currencyCode 
 * @param {boolean} abbreviate - Whether to use abbreviations like M (Millions) or K (Thousands)
 * @returns {string}
 */
export function formatPrice(amount, currencyCode = 'ngn', abbreviate = false) {
  if (amount === undefined || amount === null) return '';
  
  const code = currencyCode.toLowerCase();
  const symbol = CURRENCY_SYMBOLS[code] || '₦';

  if (abbreviate) {
    if (amount >= 1_000_000_000) {
      return `${symbol}${(amount / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}B`;
    }
    if (amount >= 1_000_000) {
      return `${symbol}${(amount / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
    }
    if (amount >= 1_000) {
      return `${symbol}${(amount / 1_000).toFixed(0)}K`;
    }
    return `${symbol}${amount}`;
  }

  // standard formatting
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });

  return `${symbol}${formatter.format(amount)}`;
}

/**
 * Convenience helper to convert and format a price directly
 */
export function formatConvertedPrice(priceNgn, targetCurrency = 'ngn', abbreviate = false) {
  const converted = convertPrice(priceNgn, targetCurrency);
  return formatPrice(converted, targetCurrency, abbreviate);
}

/**
 * Return all three major currency formats side-by-side for comparison.
 * e.g., "₦85,000,000 (~$56,667 / £44,737)"
 */
export function getComparisonPriceString(priceNgn) {
  if (!priceNgn) return 'Price on inquiry';
  const ngnStr = formatPrice(priceNgn, 'ngn', false);
  const usdStr = formatPrice(convertPrice(priceNgn, 'usd'), 'usd', false);
  const gbpStr = formatPrice(convertPrice(priceNgn, 'gbp'), 'gbp', false);
  return `${ngnStr} (~${usdStr} / ${gbpStr})`;
}
