import { formatMoney, formatNumber } from './format';

export const DEFAULT_DRAFT = {
  distance: '',
  mileage: '',
  price: '',
  roundTrip: false,
  people: 1,
};

export function parseNumber(value) {
  const n = parseFloat(String(value ?? '').replace(',', '.'));
  return Number.isFinite(n) ? n : NaN;
}

// Keeps only digits and a single decimal point.
export function sanitizeNumber(text) {
  let t = String(text ?? '').replace(/,/g, '.').replace(/[^0-9.]/g, '');
  const firstDot = t.indexOf('.');
  if (firstDot !== -1) {
    t = t.slice(0, firstDot + 1) + t.slice(firstDot + 1).replace(/\./g, '');
  }
  return t.slice(0, 10);
}

export function newId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Returns { errors, result }. When inputs are invalid `result` is null
 * and `errors` holds a message per field.
 */
export function calculate(inputs) {
  const errors = {};
  const distance = parseNumber(inputs.distance);
  const mileage = parseNumber(inputs.mileage);
  const price = parseNumber(inputs.price);
  const people = Math.max(1, parseInt(inputs.people, 10) || 1);

  if (!(distance > 0)) errors.distance = 'Enter a valid distance in km';
  else if (distance > 100000) errors.distance = 'Distance is too large';

  if (!(mileage > 0)) errors.mileage = 'Enter a valid mileage in km/L';
  else if (mileage > 500) errors.mileage = 'Mileage looks too high';

  if (!(price > 0)) errors.price = 'Enter a valid fuel price per litre';
  else if (price > 1000000) errors.price = 'Price is too large';

  if (Object.keys(errors).length > 0) return { errors, result: null };

  const totalDistance = inputs.roundTrip ? distance * 2 : distance;
  const fuel = totalDistance / mileage;
  const cost = fuel * price;

  return {
    errors: null,
    result: {
      totalDistance,
      fuel,
      cost,
      perKm: cost / totalDistance,
      perPerson: cost / people,
    },
  };
}

export function createTrip(inputs, currency, result) {
  return {
    id: newId(),
    createdAt: Date.now(),
    currency,
    inputs: {
      distance: String(inputs.distance),
      mileage: String(inputs.mileage),
      price: String(inputs.price),
      roundTrip: !!inputs.roundTrip,
      people: Math.max(1, parseInt(inputs.people, 10) || 1),
    },
    result,
  };
}

export function sameInputs(trip, inputs, currency) {
  if (!trip || trip.currency !== currency) return false;
  const a = trip.inputs;
  return (
    parseNumber(a.distance) === parseNumber(inputs.distance) &&
    parseNumber(a.mileage) === parseNumber(inputs.mileage) &&
    parseNumber(a.price) === parseNumber(inputs.price) &&
    !!a.roundTrip === !!inputs.roundTrip &&
    Number(a.people) === Number(inputs.people)
  );
}

export function buildShareText(trip) {
  const { inputs, result, currency } = trip;
  const lines = [
    'Fuel Calculator',
    `Distance: ${formatNumber(result.totalDistance, 1)} km${inputs.roundTrip ? ' (round trip)' : ''}`,
    `Mileage: ${formatNumber(inputs.mileage, 1)} km/L`,
    `Fuel price: ${formatMoney(inputs.price, currency)} / L`,
    `Fuel needed: ${formatNumber(result.fuel, 2)} L`,
    `Total cost: ${formatMoney(result.cost, currency)}`,
    `Cost per km: ${formatMoney(result.perKm, currency)}`,
  ];
  if (inputs.people > 1) {
    lines.push(`Per person (${inputs.people}): ${formatMoney(result.perPerson, currency)}`);
  }
  return lines.join('\n');
}
