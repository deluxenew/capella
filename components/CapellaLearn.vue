<template>
  <div class="AppCard capella-learn overflow-hidden cabinet-block-style w-[430px] max-h-[210px]">
    <h3 class="title text-xs text-gray border-b border-border pb-2">
      {{ wlTitle }} Learn
    </h3>

    <div class="content">
      <div class="list overflow-y-auto overflow-x-hidden max-h-[140px] my-2">
        <div
          v-for="(item, index) in items"
          :key="index"
          class="p-1 flex items-center gap-2 transition-colors duration-100 rounded-lg rounded-tr-none rounded-br-none p-1 cursor-pointer hover:bg-blue/20"
          @click="showDescription(item)"
        >
          <img
            class="w-10 h-10 rounded"
            src="~/assets/img/file.png"
            :alt="item.title"
          />

          <div class="text leading-5">
            <h4 class="text-sm">{{ item.title }}</h4>
            <!-- <p class="subtitle text-xs text-gray">
              {{ $t('CapellaLearn.timeToRead', { min: item.timeToRead }) }}
            </p> -->
          </div>
        </div>
      </div>
    </div>

    <UiModal modal-id="FAQ" height="auto" adaptive clossable>
      <div class="content">
        <div class="header flex items-center">
          {{ modal.title }}
          <UiButton class="ml-auto" theme="icon" @click="$modal.close('FAQ')">
            <UiSvgImage svg="close" />
          </UiButton>
        </div>
        <p v-text="modal.description" />
      </div>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
interface FAQItem {
  title: string
  description: string
  img?: string
  timeToRead?: number
}

interface ModalData {
  title: string | null
  description: string | null
}

// Reactive data
const items = ref<FAQItem[] | null>(null)
const modal = ref<ModalData>({
  title: null,
  description: null
})

// Composable
const { $api, $modal, $utils } = useNuxtApp()

// Computed
const wlTitle = computed(() =>
  $utils.hostToTitle?.( window?.location?.host)
)

// Data fetching
const { data: faqData } = await useAsyncData(
  'faq-items',
  async () => {
    try {
      const data  = await $api.dashboard.getFaq()
      return data
    } catch (error) {
      console.error('Error fetching FAQ data:', error)
      return { items: [] }
    }
  }
)

// Set items after fetch
watch(faqData, (newData) => {
  if (newData?.items) {
    items.value = newData.items
  }
}, { immediate: true })

// Methods
const showDescription = (item: FAQItem) => {
  modal.value = {
    title: item.title,
    description: item.description
  }
  $modal.open('FAQ')
}
</script>

<style scoped>
.list::-webkit-scrollbar {
  width: 12px;
  background-color: theme('colors.border-color');
  border-radius: 10px;
  margin-top: 10px;
}

.list::-webkit-scrollbar-thumb {
  background-color: theme('colors.gray.DEFAULT');
  border-radius: 10px;
}

.list::-webkit-scrollbar-track {
  background-color: theme('colors.border-color');
  border-radius: 10px;
}
</style>
