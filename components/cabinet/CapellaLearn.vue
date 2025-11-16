<template>
  <div class="capella-learn overflow-hidden cabinet-block-style w-[430px] max-h-[210px]">
    <h3 class="title text-xs text-gray border-b border-border pb-2">
      {{ wlTitle }} Learn
    </h3>

    <div class="content">
      <div class="list overflow-y-auto overflow-x-hidden max-h-[140px] my-2 -mx-1.25 custom-scrollbar">
        <div
          v-for="(item, index) in items"
          :key="item.id || index"
          class="list-item flex items-center gap-2 transition-colors duration-100 rounded-lg rounded-tr-none rounded-br-none p-1.25 cursor-pointer hover:bg-blue/20"
          @click="showDescription(item)"
        >
          <img
            class="list-item_img w-10 h-10 rounded flex-shrink-0"
            :src="getImageSrc(item.img)"
            :alt="item.title"
            @error="handleImageError"
          />

          <div class="text leading-5 min-w-0 flex-1">
            <h4 class="list-item-title text-sm font-medium truncate">{{ item.title }}</h4>
            <!-- <p v-if="item.timeToRead" class="subtitle text-xs text-gray mt-1">
              {{ t('CapellaLearn.timeToRead', { min: item.timeToRead }) }}
            </p> -->
          </div>
        </div>

        <div v-if="!items?.length && !pending" class="text-center text-gray text-sm py-2">
          {{ t('CapellaLearn.noItems') }}
        </div>
      </div>
    </div>

    <UiModal name="FAQ" height="auto" adaptive clossable>
      <div class="content p-2">
        <div class="header flex items-center mb-4">
          <h2 class="text-lg font-semibold flex-1">{{ modal.title }}</h2>
          <UiButton class="ml-auto" theme="icon" @click="hideModal">
            <UiSvgImage svg="close" class="w-4 h-4" />
          </UiButton>
        </div>
        <p class="text-color whitespace-pre-line">{{ modal.description }}</p>
      </div>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
interface FAQItem {
  id?: string
  title: string
  description: string
  img?: string
  timeToRead?: number
}

interface ModalData {
  title: string | null
  description: string | null
}

// Composable
const { $api, $modal, $utils } = useNuxtApp()
const { t } = useI18n()

// Reactive data
const items = ref<FAQItem[]>([])
const modal = ref<ModalData>({
  title: null,
  description: null
})

// Computed
const wlTitle = computed(() =>
  $utils?.hostToTitle?.(window.location.host ) || 'Capella Finance'
)

// Data fetching
const { data: faqData, pending } = await useAsyncData(
  'faq-items',
  async () => {
    try {
      const data = await $api.dashboard.getFaq()
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
  $modal?.open?.('FAQ')
}

const hideModal = () => {
  $modal?.close?.('FAQ')
}

const getImageSrc = (imgPath?: string): string => {
  if (!imgPath) return '~/assets/img/file.png'

  // Если путь начинается с @/, преобразуем в абсолютный путь
  if (imgPath.startsWith('@/')) {
    return imgPath.replace('@/', '/')
  }

  return imgPath
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = '/img/file.png'
}
</script>

<style scoped>
.custom-scrollbar {

  scrollbar-color: theme('colors.gray.50') theme('colors.black');
}

.custom-scrollbar::-webkit-scrollbar {
  width: 12px;
  background-color: theme('colors.black');
  border-radius: 10px;
  margin-top: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: theme('colors.gray.50');
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background-color: theme('colors.black');
  border-radius: 10px;
}

/* Custom scrollbar for Firefox */
.custom-scrollbar {

  scrollbar-color: theme('colors.gray.50') theme('colors.black');
}
</style>
