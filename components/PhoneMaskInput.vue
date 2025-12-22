<template>
  <div :class="wrapperClass">
    <div class="relative">
      <input
        v-model="innerValue"
        :placeholder="placeholder"
        :disabled="disabled"
        type="tel"
        :class="inputClass"
        ref="inputRef"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
      />
      <div
        v-if="country && showFlag"
        class="absolute inset-y-0 left-3 flex items-center pointer-events-none"
      >
        <div class="flex items-center">
          <span
            :class="`fi fi-${country.toLowerCase()} ${flagClass}`"
            :style="{ width: flagSize === 'small' ? '16px' : flagSize === 'large' ? '24px' : '20px',
                      height: flagSize === 'small' ? '12px' : flagSize === 'large' ? '18px' : '15px' }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import type { CountryCode } from 'libphonenumber-js';
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import {
  getMaskToLibPhoneNumber,
  findFirstCountryByAlpha2,
  findFirstCountryByCode,
  isCanada
} from '~/composables/country_telephone_data';

interface Props {
  value?: string | number;
  showFlag?: boolean;
  autoDetectCountry?: boolean;
  defaultCountry?: string;
  placeholder?: string;
  flagSize?: 'small' | 'normal' | 'large';
  disabled?: boolean;
  wrapperClass?: string;
  inputClass?: string;
  flagClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  showFlag: false,
  autoDetectCountry: false,
  flagSize: 'normal',
  disabled: false,
  wrapperClass: 'phone-mask-wrapper-lib',
  inputClass: 'phone-input-lib',
  flagClass: 'country-flag-lib'
});

// Определение типа для данных валидации
interface ValidateData {
  number: string;
  isValidByLibPhoneNumberJs: boolean;
  country: string;
}

// Правильный способ определения emits
const emit = defineEmits<{
  'input': [value: string];
  'onValidate': [ ValidateData];
  'onFocus': [];
  'onBlur': [];
}>();

const innerValue = ref<string>(props.value?.toString() || '');
const countryCode = ref<string>('');
const mask = ref<string>('*############');
const defaultMask = ref<string>('*############');
const country = ref<string>('');
const isValid = ref<boolean>(false);
const visitorCountry = ref<string>('');

const inputRef = ref<HTMLInputElement | null>(null);

const currentNumber = computed<string>(() => {
  const plus = /^\+/.test(innerValue.value) || !innerValue.value ? '' : '+';
  const filteredNumberArr = innerValue.value ? innerValue.value.match(/[\d+]/g) : null;
  const filteredNumber = filteredNumberArr ? filteredNumberArr.join('') : '';

  return mask.value === defaultMask.value ? `${plus}${filteredNumber}` : filteredNumber;
});

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  let filteredValue = target.value.match(/[\d+]/g);
  let newFilteredValue = filteredValue ? filteredValue.join('') : '';

  // Ограничиваем длину ввода по маске
  const maxDigits = (mask.value.match(/#/g) || []).length + (mask.value.match(/\*/g) || []).length;
  if (newFilteredValue.length > maxDigits) {
    newFilteredValue = newFilteredValue.substring(0, maxDigits);
  }

  innerValue.value = newFilteredValue;
  updateMaskData();

  nextTick(() => {
    setTimeout(setFocusToEnd, 0);
  });
};

const setFocusToEnd = () => {
  if (inputRef.value) {
    const length = inputRef.value.value.length;
    inputRef.value.focus();
    inputRef.value.setSelectionRange(length, length);
  }
};

const updateMaskData = () => {
  const phoneInfo = parsePhoneNumberFromString(currentNumber.value);

  let resolvedPhoneInfo: any = phoneInfo;

  if (!resolvedPhoneInfo && !currentNumber.value && props.defaultCountry) {
    const countryData = findFirstCountryByAlpha2(props.defaultCountry);
    if (countryData && props.defaultCountry) {
      resolvedPhoneInfo = { country: props.defaultCountry.toUpperCase() as CountryCode };
      innerValue.value = `+${countryData.code}`;
    }
  }

  if (resolvedPhoneInfo && !resolvedPhoneInfo.country) {
    switch (resolvedPhoneInfo.countryCallingCode) {
      case '44': {
        resolvedPhoneInfo.country = 'GB';
        break;
      }
      case '1': {
        if (currentNumber.value.length > 4) {
          resolvedPhoneInfo.country = isCanada(currentNumber.value) ? 'CA' : 'US';
        }
        break;
      }
    }
  } else if (props.autoDetectCountry && visitorCountry.value && !innerValue.value) {
    resolvedPhoneInfo = { country: visitorCountry.value.toUpperCase() as CountryCode };
  } else if (!resolvedPhoneInfo && currentNumber.value.length > 2) {
    const detectedCountry = findFirstCountryByCode(currentNumber.value);
    if (detectedCountry) {
      resolvedPhoneInfo = { country: detectedCountry };
    }
  }

  const computedMask = getMaskToLibPhoneNumber(resolvedPhoneInfo);
  const computedCountry = resolvedPhoneInfo?.country ? resolvedPhoneInfo.country.toLowerCase() : '';

  if (props.autoDetectCountry && visitorCountry.value) {
    if (!innerValue.value && computedMask?.countryCode) innerValue.value = computedMask.countryCode;
    visitorCountry.value = '';
  }

  if (computedMask && computedMask.mask) {
    mask.value = computedMask.mask;
    country.value = computedCountry;
    countryCode.value = computedMask.countryCode;
    isValid.value = !!resolvedPhoneInfo && !!resolvedPhoneInfo.isValid && resolvedPhoneInfo.isValid();
  } else if (countryCode.value.length > currentNumber.value.length) {
    mask.value = defaultMask.value;
    country.value = '';
    countryCode.value = '';
    isValid.value = false;
  }
};

const onFocus = () => {
  emit('onFocus');
};

const onBlur = () => {
  emit('onBlur');
};

watch(currentNumber, (value) => {
  emit('input', value);
  emit('onValidate', {
    number: value,
    isValidByLibPhoneNumberJs: isValid.value,
    country: country.value
  });
});

onMounted(() => {
  if (props.autoDetectCountry) {
    // В Nuxt 3 лучше использовать composables для получения данных
    // const visitorContryInfo = visitorInfo();
    // visitorCountry.value = visitorContryInfo?.country?.alpha2 || '';
  }
  updateMaskData();
});

// Следим за внешним значением
watch(() => props.value, (newValue) => {
  if (newValue !== innerValue.value) {
    innerValue.value = newValue?.toString() || '';
    updateMaskData();
  }
});
</script>

<style scoped>
.phone-mask-wrapper-lib {
  @apply relative flex flex-col;
}

.phone-input-lib {
  @apply w-full px-4 py-3 bg-transparent pl-10 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500;
}

.phone-input-lib:focus {
  @apply outline-none;
}

.country-flag-lib {
  @apply mr-2;
}
</style>
