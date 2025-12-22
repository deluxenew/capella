// composables/country_telephone_data.ts
import type { CountryCode } from 'libphonenumber-js';

export interface CountryData {
  code: string;
  alpha2: string;
  mask: string;
  name: string;
}

export interface MaskData {
  mask: string;
  countryCode: string;
  maxDigits?: number; // Добавляем максимальное количество цифр
}

// Пример данных для масок (в реальном проекте используйте полный список)
const COUNTRIES_DATA: CountryData[] = [
  { code: '1', alpha2: 'us', mask: '+1 (###) ###-####', name: 'United States' },
  { code: '1', alpha2: 'ca', mask: '+1 (###) ###-####', name: 'Canada' },
  { code: '44', alpha2: 'gb', mask: '+44 ## #### ####', name: 'United Kingdom' },
  { code: '33', alpha2: 'fr', mask: '+33 # ## ## ## ##', name: 'France' },
  { code: '49', alpha2: 'de', mask: '+49 ### ### ####', name: 'Germany' },
  { code: '7', alpha2: 'ru', mask: '+7 (###) ###-##-##', name: 'Russia' },
  { code: '81', alpha2: 'jp', mask: '+81 ## #### ####', name: 'Japan' },
  { code: '86', alpha2: 'cn', mask: '+86 ### #### ####', name: 'China' },
  { code: '39', alpha2: 'it', mask: '+39 ### ### ####', name: 'Italy' },
  { code: '34', alpha2: 'es', mask: '+34 ### ### ###', name: 'Spain' },
  { code: '55', alpha2: 'br', mask: '+55 ## #####-####', name: 'Brazil' },
  { code: '91', alpha2: 'in', mask: '+91 #####-#####', name: 'India' },
  { code: '82', alpha2: 'kr', mask: '+82 ## ###-####', name: 'South Korea' },
];

export function getMaskToLibPhoneNumber(phoneInfo: any): MaskData | null {
  if (!phoneInfo || !phoneInfo.country) {
    const maskData: MaskData = {
      mask: '*############',
      countryCode: '',
      maxDigits: 15 // 15 цифр + плюсик
    };
    return maskData;
  }

  const country = COUNTRIES_DATA.find(c => c.alpha2.toLowerCase() === phoneInfo.country.toLowerCase());
  if (country) {
    const maxDigits = (country.mask.match(/[\d#]/g) || []).length;
    return {
      mask: country.mask,
      countryCode: `+${country.code}`,
      maxDigits
    };
  }

  // Попробуем найти по коду
  if (phoneInfo.countryCallingCode) {
    const countryByCode = COUNTRIES_DATA.find(c => c.code === phoneInfo.countryCallingCode);
    if (countryByCode) {
      const maxDigits = (countryByCode.mask.match(/[\d#]/g) || []).length;
      return {
        mask: countryByCode.mask,
        countryCode: `+${countryByCode.code}`,
        maxDigits
      };
    }
  }

  return {
    mask: '*############',
    countryCode: '',
    maxDigits: 15
  };
}

export function findFirstCountryByAlpha2(alpha2: string | undefined): CountryData | undefined {
  if (!alpha2) return undefined;
  return COUNTRIES_DATA.find(c => c.alpha2.toLowerCase() === alpha2.toLowerCase());
}

export function findFirstCountryByCode(code: string): CountryCode | undefined {
  const country = COUNTRIES_DATA.find(c =>
    code.startsWith(`+${c.code}`) ||
    code.startsWith(c.code)
  );

  if (country) {
    // Проверяем, что код страны соответствует типу CountryCode из libphonenumber-js
    const validCountryCode = country.alpha2.toUpperCase() as CountryCode;
    // Проверяем, что это допустимый код страны
    if (isValidCountryCode(validCountryCode)) {
      return validCountryCode;
    }
  }
  return undefined;
}

// Вспомогательная функция для проверки валидности кода страны
function isValidCountryCode(code: string): boolean {
  // В реальном приложении используйте список всех допустимых кодов из libphonenumber-js
  const validCountryCodes = [
    'US', 'CA', 'GB', 'FR', 'DE', 'RU', 'JP', 'CN', 'IT', 'ES', 'BR', 'IN', 'KR',
    'AF', 'AX', 'AL', 'DZ', 'AS', 'AD', 'AO', 'AI', 'AQ', 'AG', 'AR', 'AM', 'AW',
    'AU', 'AT', 'AZ', 'BS', 'BH', 'BD', 'BB', 'BY', 'BE', 'BZ', 'BJ', 'BM', 'BT',
    'BO', 'BQ', 'BA', 'BW', 'BV', 'BR', 'IO', 'BN', 'BG', 'BF', 'BI', 'CV', 'KH',
    'CM', 'CA', 'KY', 'CF', 'TD', 'CL', 'CN', 'CX', 'CC', 'CO', 'KM', 'CG', 'CD',
    'CK', 'CR', 'CI', 'HR', 'CU', 'CW', 'CY', 'CZ', 'DK', 'DJ', 'DM', 'DO', 'EC',
    'EG', 'SV', 'GQ', 'ER', 'EE', 'SZ', 'ET', 'FK', 'FO', 'FJ', 'FI', 'FR', 'GF',
    'PF', 'TF', 'GA', 'GM', 'GE', 'DE', 'GH', 'GI', 'GR', 'GL', 'GD', 'GP', 'GU',
    'GT', 'GG', 'GN', 'GW', 'GY', 'HT', 'HM', 'VA', 'HN', 'HK', 'HU', 'IS', 'IN',
    'ID', 'IR', 'IQ', 'IE', 'IM', 'IL', 'IT', 'JM', 'JP', 'JE', 'JO', 'KZ', 'KE',
    'KI', 'KP', 'KR', 'KW', 'KG', 'LA', 'LV', 'LB', 'LS', 'LR', 'LY', 'LI', 'LT',
    'LU', 'MO', 'MG', 'MW', 'MY', 'MV', 'ML', 'MT', 'MH', 'MQ', 'MR', 'MU', 'YT',
    'MX', 'FM', 'MD', 'MC', 'MN', 'ME', 'MS', 'MA', 'MZ', 'MM', 'NA', 'NR', 'NP',
    'NL', 'NC', 'NZ', 'NI', 'NE', 'NG', 'NU', 'NF', 'MP', 'NO', 'OM', 'PK', 'PW',
    'PS', 'PA', 'PG', 'PY', 'PE', 'PH', 'PN', 'PL', 'PT', 'PR', 'QA', 'MK', 'RO',
    'RU', 'RW', 'RE', 'BL', 'SH', 'KN', 'LC', 'MF', 'PM', 'VC', 'WS', 'SM', 'ST',
    'SA', 'SN', 'RS', 'SC', 'SL', 'SG', 'SX', 'SK', 'SI', 'SB', 'SO', 'ZA', 'GS',
    'SS', 'ES', 'LK', 'SD', 'SR', 'SJ', 'SE', 'CH', 'SY', 'TW', 'TJ', 'TZ', 'TH',
    'TL', 'TG', 'TK', 'TO', 'TT', 'TN', 'TR', 'TM', 'TC', 'TV', 'UG', 'UA', 'AE',
    'GB', 'US', 'UM', 'UY', 'UZ', 'VU', 'VE', 'VN', 'VG', 'VI', 'WF', 'EH', 'YE',
    'ZM', 'ZW'
  ];
  return validCountryCodes.includes(code);
}

export function isCanada(number: string): boolean {
  // Упрощенная логика для определения Канады
  // В реальном приложении используйте более точную логику
  if (number.startsWith('+1') || number.startsWith('1')) {
    // Проверяем по коду региона (пример: 416, 647 для Канады)
    const regionCode = number.slice(number.startsWith('+1') ? 3 : 1, number.startsWith('+1') ? 6 : 4);
    const canadianAreaCodes = [
      '403', '587', '825', '250', '604', '778', '204', '431', '506', '709', '902',
      '226', '249', '289', '343', '365', '416', '437', '519', '548', '613', '647',
      '705', '742', '807', '905', '306', '418', '438', '450', '514', '579', '581',
      '819', '873', '308', '867'
    ];
    return canadianAreaCodes.includes(regionCode);
  }
  return false;
}
