<template>
  <header class="w-full">
    <div class="flex items-baseline pt-6">
      <a href="#" class="font-semibold text-lg text-white">
        Capella Finance
      </a>
      <div class="flex items-center justify-between w-full ml-20 pb-3 border-b border-gray-700">
        <ui-select
            :options="options"
            :default="'ENG'"
            class="text-gray-400"
            @input="onInput"
        />
        <div class="flex space-x-4">
          <nuxt-link to="sign-in">
            <ui-button class="bg-transparent hover:bg-transparent hover:shadow-none text-white border border-gray-600 hover:border-gray-500 px-4 py-2 rounded-lg transition-colors">
              Sign In
            </ui-button>
          </nuxt-link>
          <nuxt-link to="sign-up">
            <ui-button
                @click="emit('sign-up')"
                class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Sign Up
            </ui-button>
          </nuxt-link>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import UiButton from "~/components/ui/ui-button.global";
import UiSelect from "~/components/ui/ui-select.global";

// Define emits
const emit = defineEmits(['sign-up']);

// Reactive data
const options = ['ENG', 'RUS'];

// Methods
const onInput = (event) => {
  console.log('you selected', event);
};
</script>