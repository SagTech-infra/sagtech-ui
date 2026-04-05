const EUROPEAN_COUNTRIES = [
  'Austria', 'Belgium', 'Cyprus', 'Estonia', 'Finland', 'France', 'Germany',
  'Greece', 'Ireland', 'Italy', 'Latvia', 'Lithuania', 'Luxembourg', 'Malta',
  'Netherlands', 'Portugal', 'Slovakia', 'Slovenia', 'Spain', 'Europe',
];

export function getCurrencySymbol(location: string): string {
  if (!location) return '$';

  const normalizedLocation = location.trim();

  // Check for India
  if (normalizedLocation.toLowerCase().includes('india')) {
    return '\u20B9';
  }

  // Check for European countries
  if (
    EUROPEAN_COUNTRIES.some((country) =>
      normalizedLocation.toLowerCase().includes(country.toLowerCase()),
    )
  ) {
    return '\u20AC';
  }

  // Default to USD
  return '$';
}

export function formatSalary(
  salaryRange: [number, number] | null | undefined,
  location: string,
): string {
  if (!salaryRange || salaryRange.length < 2) {
    return '';
  }

  const [min, max] = salaryRange;

  // If both values are 0, salary is not specified
  if (min === 0 && max === 0) {
    return '';
  }

  const currency = getCurrencySymbol(location);

  if (min === max) {
    return `${currency}${min.toLocaleString()}`;
  }

  return `${currency}${min.toLocaleString()}\u2013${currency}${max.toLocaleString()}`;
}
