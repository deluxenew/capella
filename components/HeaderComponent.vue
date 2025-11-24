<template>
  <div class="header">
    <div class="wrapper">
      <a href="#" class="logo">
        Capella Finance
      </a>
      <div class="right-block">
        <ui-select-custom
          :options="options"
          :default="'ENG'"
          class="select select-lang"
          @input="onInput($event)"
        />
        <div class="buttons">
          <nuxt-link to="sign-in">
            <ui-button class="sign-in-btn bg-transparent text-gray-700 hover:bg-gray-50 border border-gray-300">Sign In</ui-button>
          </nuxt-link>
          <nuxt-link to="sign-up">
            <ui-button @click="$emit('sign-up')" class="sign-up-btn">Sign Up</ui-button>
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import UiButton from "~/components/ui/UiButton.vue";
import UiSelectCustom from "~/components/ui/UiSelectCustom.vue";

const emit = defineEmits(['sign-up']);

const options = ['ENG', 'RUS'];

const onInput = (event) => {
  console.log('you selected', event);
};
</script>

<style scoped>
.header {
  .wrapper {
    @apply flex items-baseline pt-6;

    .logo {
      @apply font-semibold text-lg whitespace-nowrap;
    }
  }

  .right-block {
    @apply pb-3 border-b border-onyx flex items-center justify-between w-full ml-20;
  }

  .sign-in-btn {
    @apply bg-transparent hover:shadow-none;
  }

  .select-lang {
    @apply text-gray;
  }
}
</style>
