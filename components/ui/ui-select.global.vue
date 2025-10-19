<template>
  <div class="custom-select" :tabindex="tabindex" @blur="open = false">
    <div class="selected" :class="{ open }" @click="open = !open">
      {{ selected }}
    </div>
    <div class="items" :class="{ 'select-hide': !open }">
      <div
        v-for="(option, i) of options"
        :key="i"
        @click="
          selected = option;
          open = false;
          $emit('input', option);
        "
        class="option-item"
      >
        {{ option }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  options: {
    type: Array,
    required: true,
  },
  default: {
    type: String,
    required: false,
    default: null,
  },
  tabindex: {
    type: Number,
    required: false,
    default: 0,
  },
})

const emit = defineEmits(['input'])

const selected = ref(props.default ? props.default : props.options?.length > 0 ? props.options[0] : null)
const open = ref(false)

onMounted(() => {
  emit('input', selected.value)
})
</script>

<style scoped>
.custom-select {
  @apply relative text-left outline-none;
}

.custom-select .selected {
  @apply bg-transparent text-inherit cursor-pointer select-none pr-10 py-2.5 transition duration-300 relative;
}

.custom-select .selected:after {
  content: "\276E";
  @apply absolute transform -rotate-90 inline-block left-14 top-2 text-sm;
}

.custom-select .items {
  @apply text-inherit overflow-hidden absolute bg-charade left-0 right-0 z-10;
}

.custom-select .items .option-item {
  @apply text-inherit cursor-pointer select-none pr-10 py-2.5;
}

.custom-select .items .option-item:hover {
  @apply text-white;
}

.select-hide {
  @apply hidden;
}
</style>
