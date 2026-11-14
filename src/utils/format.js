export const CURRENCIES = [
  { code: 'PKR', symbol: 'Rs' },
  { code: 'USD', symbol: '$' },
  { code: 'INR', symbol: '₹' },
  { code: 'AED', symbol: 'AED' },
  { code: 'SAR', symbol: 'SAR' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
];

export const DEFAULT_CURRENCY = 'PKR';

export function getSymbol(code) {
  const found = CURRENCIES.find((c) => c.code === code);
  return found ? found.symbol : code;
}

export function formatNumber(value, digits = 2) {
  const n = Number(value);
  if (!Number.isFinite(n)) return '0';
  const fixed = Math.abs(n).toFixed(digits);
  const [intPart, decPart] = fixed.split('.');
  const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const sign = n < 0 ? '-' : '';
  return decPart ? `${sign}${withCommas}.${decPart}` : `${sign}${withCommas}`;
}

export function formatMoney(value, currencyCode, digits = 2) {
  return `${getSymbol(currencyCode)} ${formatNumber(value, digits)}`;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatDate(timestamp) {
  const d = new Date(timestamp);
  if (Number.isNaN(d.getTime())) return '';
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const suffix = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}, ${hours}:${minutes} ${suffix}`;
}
