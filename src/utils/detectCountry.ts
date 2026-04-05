'use client';

export const detectCountryByTimezone = (): string => {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const timezoneToCountry: Record<string, string> = {
      // Europe
      'Europe/London': 'gb',
      'Europe/Paris': 'fr',
      'Europe/Berlin': 'de',
      'Europe/Rome': 'it',
      'Europe/Madrid': 'es',
      'Europe/Amsterdam': 'nl',
      'Europe/Vienna': 'at',
      'Europe/Brussels': 'be',
      'Europe/Prague': 'cz',
      'Europe/Warsaw': 'pl',
      'Europe/Budapest': 'hu',
      'Europe/Zurich': 'ch',
      'Europe/Stockholm': 'se',
      'Europe/Oslo': 'no',
      'Europe/Copenhagen': 'dk',
      'Europe/Helsinki': 'fi',
      'Europe/Dublin': 'ie',
      'Europe/Lisbon': 'pt',
      'Europe/Athens': 'gr',
      'Europe/Kiev': 'ua',
      'Europe/Moscow': 'ru',

      // North America
      'America/New_York': 'us',
      'America/Chicago': 'us',
      'America/Denver': 'us',
      'America/Los_Angeles': 'us',
      'America/Toronto': 'ca',
      'America/Vancouver': 'ca',
      'America/Mexico_City': 'mx',

      // Asia
      'Asia/Tokyo': 'jp',
      'Asia/Shanghai': 'cn',
      'Asia/Seoul': 'kr',
      'Asia/Singapore': 'sg',
      'Asia/Hong_Kong': 'hk',
      'Asia/Bangkok': 'th',
      'Asia/Manila': 'ph',
      'Asia/Jakarta': 'id',
      'Asia/Kuala_Lumpur': 'my',
      'Asia/Dubai': 'ae',
      'Asia/Kolkata': 'in',
      'Asia/Karachi': 'pk',
      'Asia/Tehran': 'ir',
      'Asia/Istanbul': 'tr',

      // Australia & Oceania
      'Australia/Sydney': 'au',
      'Australia/Melbourne': 'au',
      'Australia/Perth': 'au',
      'Pacific/Auckland': 'nz',

      // South America
      'America/Sao_Paulo': 'br',
      'America/Argentina/Buenos_Aires': 'ar',
      'America/Santiago': 'cl',
      'America/Lima': 'pe',
      'America/Bogota': 'co',

      // Africa
      'Africa/Cairo': 'eg',
      'Africa/Lagos': 'ng',
      'Africa/Johannesburg': 'za',
      'Africa/Casablanca': 'ma',
    };

    return timezoneToCountry[timezone] || 'us';
  } catch {
    return 'us';
  }
};

export const detectCountryByLanguage = (): string => {
  try {
    const language = navigator.language || navigator.languages?.[0] || 'en-US';
    const countryCode = language.split('-')[1]?.toLowerCase();

    const supportedCountries = [
      'us', 'gb', 'ca', 'au', 'de', 'fr', 'it', 'es', 'nl', 'se', 'no', 'dk',
      'fi', 'pl', 'cz', 'hu', 'ru', 'ua', 'jp', 'cn', 'kr', 'sg', 'hk', 'in',
      'br', 'ar', 'mx', 'eg', 'ae', 'ch', 'at', 'be', 'ie', 'pt', 'gr',
    ];

    return supportedCountries.includes(countryCode) ? countryCode : 'us';
  } catch {
    return 'us';
  }
};

const SUPPORTED_COUNTRIES = [
  'af', 'al', 'dz', 'ad', 'ao', 'ag', 'ar', 'am', 'aw', 'au', 'at', 'az', 'bs', 'bh', 'bd',
  'bb', 'by', 'be', 'bz', 'bj', 'bt', 'bo', 'ba', 'bw', 'br', 'bn', 'bg', 'bf', 'bi', 'kh',
  'cm', 'ca', 'cv', 'cf', 'td', 'cl', 'cn', 'co', 'km', 'cg', 'cd', 'cr', 'ci', 'hr', 'cu',
  'cy', 'cz', 'dk', 'dj', 'dm', 'do', 'ec', 'eg', 'sv', 'gq', 'er', 'ee', 'et', 'fj', 'fi',
  'fr', 'ga', 'gm', 'ge', 'de', 'gh', 'gr', 'gt', 'gn', 'gw', 'gy', 'ht', 'hn', 'hk', 'hu',
  'is', 'in', 'id', 'ir', 'iq', 'ie', 'il', 'it', 'jm', 'jp', 'jo', 'kz', 'ke', 'ki', 'kp',
  'kr', 'kw', 'kg', 'la', 'lv', 'lb', 'ls', 'lr', 'ly', 'li', 'lt', 'lu', 'mo', 'mk', 'mg',
  'mw', 'my', 'mv', 'ml', 'mt', 'mh', 'mr', 'mu', 'mx', 'fm', 'md', 'mc', 'mn', 'me', 'ma',
  'mz', 'mm', 'na', 'nr', 'np', 'nl', 'nz', 'ni', 'ne', 'ng', 'no', 'om', 'pk', 'pw', 'pa',
  'pg', 'py', 'pe', 'ph', 'pl', 'pt', 'qa', 'ro', 'ru', 'rw', 'kn', 'lc', 'vc', 'ws', 'sm',
  'st', 'sa', 'sn', 'rs', 'sc', 'sl', 'sg', 'sk', 'si', 'sb', 'so', 'za', 'es', 'lk', 'sd',
  'sr', 'sz', 'se', 'ch', 'sy', 'tw', 'tj', 'tz', 'th', 'tl', 'tg', 'to', 'tt', 'tn', 'tr',
  'tm', 'ug', 'ua', 'ae', 'gb', 'us', 'uy', 'uz', 'vu', 've', 'vn', 'ye', 'zm', 'zw',
];

export const detectCountry = (): string => {
  try {
    // Try timezone first
    const timezoneCountry = detectCountryByTimezone();
    if (timezoneCountry !== 'us' && SUPPORTED_COUNTRIES.includes(timezoneCountry)) {
      return timezoneCountry;
    }

    // Then by language
    const languageCountry = detectCountryByLanguage();
    if (SUPPORTED_COUNTRIES.includes(languageCountry)) {
      return languageCountry;
    }

    // Fallback to US
    return 'us';
  } catch {
    return 'us';
  }
};
