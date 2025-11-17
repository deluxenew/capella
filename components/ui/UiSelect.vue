<template>
  <div
    class="custom-select relative text-left outline-none text-xs uppercase text-gray"
    :class="{ 'selected': open, 'reversed': reversed }"
    @blur="open = false"
    :tabindex="tabindex"
  >
    <UiButton
      size="sm"
      theme="transparent"
      class="custom-select-btn p-4 flex items-center text-gray"
      inset
      @click="toggleOpen"
    >
      <UiSvgImage
        :svg="open ? 'arrow_up' : 'arrow_down'"
        class="mr-1"
        :class="reversed ? 'ml-1 mr-0' : 'mr-1'"
      />
      {{ modelValue }}
    </UiButton>
    <div
      ref="UiSelect"
      class="items flex-col absolute bg-charade left-0 right-0 z-10 hidden"
      :class="{
        'flex': open,
        'hidden': !open,
        'min-w-[60px]': open,
        'shadow-[0_10px_20px_rgba(0,0,0,0.19),0_6px_6px_rgba(0,0,0,0.23)]': open
      }"
    >
      <div
        v-for="(option, i) in options"
        :key="i"
        class="p-4 cursor-pointer select-none text-gray transition-all duration-300 hover:text-white hover:bg-gray"
        :class="reversed ? 'text-left' : 'text-right'"
        @click="selectOption(option)"
      >
        {{ option }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  options: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: [String, Number],
    default: null,
  },
  tabindex: {
    type: Number,
    default: 0,
  },
  reversed: {
    type: Boolean,
    default: false,
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const open = ref(false)
const UiSelect = ref(null)

const toggleOpen = () => {
  open.value = !open.value
}

const selectOption = (option) => {
  open.value = false
  emit('update:modelValue', option)
  emit('change', option)
}
</script>
