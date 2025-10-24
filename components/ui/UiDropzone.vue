<template>
  <div class="UiDropzone" :class="{ disabled }">
    <input
      ref="inputFileRef"
      class="file-input"
      type="file"
      :accept="accept"
      :disabled="disabled"
      :multiple="multiple"
      @input="handleFileInput($event)"
    />

    <template v-if="!imageToCropp">
      <div
        ref="dropzoneRef"
        class="UiDropzone__addFile flex items-center justify-center h-full"
        :class="{ 'justify-center': !modelValue?.length }"
        @click="handleDropzoneClick"
      >
        <div
          v-for="(file, index) in modelValue"
          :key="file.upload?.id || `file_${index}`"
          class="UiDropzone__file relative flex items-center justify-center"
          :style="{
            width: size.width,
            height: size.height,
          }"
        >
          <!-- Loading State -->
          <div
            v-if="file.upload?.isLoading"
            class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg"
          >
            <UiProgressCircle
              fill="white"
              :progress="file.upload.progress"
              :radius="35"
              :stroke="6"
            />
          </div>

          <!-- File Actions -->
          <div v-if="!file.upload?.isLoading" class="UiDropzone__fileActions absolute right-2 bottom-2 opacity-50 hover:opacity-100 transition-opacity duration-300 flex flex-col gap-1">
            <button
              v-if="editable"
              class="w-7 h-7 bg-blue-600 rounded flex items-center justify-center text-white text-xs hover:bg-blue-700 transition-colors"
              :disabled="disabled"
              @click.stop="handleFileEdit(file, index)"
            >
              <i class="fas fa-edit" />
            </button>
            <button
              class="w-7 h-7 bg-red-600 rounded flex items-center justify-center text-white text-xs hover:bg-red-700 transition-colors"
              @click.stop="removeFile(index)"
            >
              <i class="fas fa-trash" />
            </button>
          </div>

          <!-- File Status -->
          <div v-if="file.status" class="UiDropzone__status absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            {{ file.status }}
            <button
              v-if="file.description_status"
              v-tooltip="{
                content: file.description_status,
                classes: ['statusDescriptionTooltip'],
              }"
              class="statusDescriptionBtn w-4 h-4 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-xs"
            >
              <i class="fas fa-question" />
            </button>
          </div>

          <!-- File Preview -->
          <img
            :src="getFilePreview(file)"
            :alt="file.name"
            class="max-w-full max-h-full object-contain rounded-lg"
            @error="handleImageError($event)"
          />
        </div>

        <!-- Add File Button -->
        <div
          v-if="canAddMoreFiles"
          class="UiDropzone__plus border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors duration-300 rounded-lg flex items-center justify-center relative cursor-pointer"
          :style="{
            width: size.width,
            height: size.height,
          }"
        >
          <div class="plus-icon w-8 h-8 relative">
            <div class="absolute inset-0 bg-gray-300 hover:bg-blue-500 transition-colors duration-300" />
            <div class="absolute inset-0 bg-gray-300 hover:bg-blue-500 transition-colors duration-300 rotate-90" />
          </div>
        </div>
      </div>

      <!-- Helper Text -->
      <div class="field__help mt-3 flex justify-between items-center">
        <transition name="slide-y">
          <div v-if="hint" class="input-content__hint text-sm text-gray-500">
            {{ hint }}
          </div>
        </transition>

        <span
          v-if="counter"
          class="input-content__counter text-sm"
          :class="{ 'text-red-500': modelValue && modelValue.length > maxFiles }"
        >
          {{ modelValue?.length || 0 }} / {{ maxFiles }}
        </span>
      </div>
    </template>

    <!-- Image Cropper -->
    <UiCropper
      v-else-if="croppImage"
      v-model="imageToCropp"
      class="cropper h-full"
      :aspect-ratio="aspectRatio"
      @cropped="handleCropped"
    />
  </div>
</template>

<script setup lang="ts">
import { v4 as UUIDv4 } from 'uuid'
import type { PropType } from 'vue'

// Types
interface FileUpload {
  id: string
  progress: number
  isLoading: boolean
  error: string | null
  isUploaded?: boolean
}

interface DropzoneFile {
  name: string
  base64?: string
  file?: File
  upload?: FileUpload
  status?: string
  description_status?: string
  image?: string
}

interface Size {
  width: string
  height: string
}

// Props
const props = defineProps({
  modelValue: {
    type: Array as PropType<DropzoneFile[]>,
    default: () => []
  },
  editable: {
    type: Boolean,
    default: false
  },
  croppImage: {
    type: Boolean,
    default: false
  },
  aspectRatio: {
    type: Number,
    default: NaN
  },
  accept: {
    type: String,
    default: '*'
  },
  maxFiles: {
    type: Number,
    default: 1
  },
  size: {
    type: Object as PropType<Size>,
    default: () => ({
      width: '100px',
      height: '100px'
    })
  },
  disabled: {
    type: Boolean,
    default: false
  },
  hint: {
    type: String,
    default: ''
  },
  permanent: {
    type: Boolean,
    default: false
  },
  counter: {
    type: Boolean,
    default: false
  },
  uploadBucket: {
    type: String,
    default: 'products'
  }
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [files: DropzoneFile[]]
  'file:added': [file: DropzoneFile]
  'file:edit': [file: DropzoneFile, index: number]
  'file:removed': [file: DropzoneFile]
  'file:loaded': [file: DropzoneFile]
  'error:fileExtension': []
  'error:maxFilesReached': []
}>()

// Refs
const inputFileRef = ref<HTMLInputElement>()
const dropzoneRef = ref<HTMLElement>()
const imageToCropp = ref<DropzoneFile | null>(null)
const croppKey = ref<number | null>(null)

// Computed
const multiple = computed(() => props.maxFiles > 1)
const canAddMoreFiles = computed(() => multiple.value || !props.modelValue?.length)
const queue = computed(() =>
  props.modelValue?.filter(file =>
    !file.upload?.isUploaded &&
    !file.upload?.isLoading &&
    !file.file
  ) || []
)

// Methods
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}

const getFilePreview = (file: DropzoneFile): string => {
  return file.base64 || file.image || '/images/file.png'
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = '/images/file.png'
}

const handleDropzoneClick = () => {
  if (!props.disabled) {
    inputFileRef.value?.click()
  }
}

const handleFileInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files?.length) {
    addFiles(target.files)
  }
}

const addFiles = async (files: FileList) => {
  const fileArray = Array.from(files)

  for (const file of fileArray) {
    if (props.modelValue && props.modelValue.length >= props.maxFiles) {
      emit('error:maxFilesReached')
      break
    }

    // File extension validation
    const acceptRegex = new RegExp(
      '(' +
      props.accept
        .replace(/\s/g, '')
        .replace(/,/g, '|')
        .replace(/\*/g, '.*')
        .replace(/\\./g, '\\.') +
      ')$',
      'i'
    )

    if (!acceptRegex.test(file.name)) {
      emit('error:fileExtension')
      continue
    }

    try {
      const base64 = await fileToBase64(file)
      const dropzoneFile: DropzoneFile = {
        name: file.name,
        base64,
        file,
        upload: {
          id: UUIDv4(),
          progress: 0,
          isLoading: false,
          error: null
        }
      }

      if (props.croppImage) {
        imageToCropp.value = dropzoneFile
        croppKey.value = props.modelValue?.length || 0
      } else {
        addFileToModel(dropzoneFile)
      }
    } catch (error) {
      console.error('Error processing file:', error)
    }
  }

  if (props.permanent) {
    uploadQueue()
  }
}

const addFileToModel = (file: DropzoneFile) => {
  const newArray = [...(props.modelValue || [])]
  newArray.push(file)
  emit('update:modelValue', newArray)
  emit('file:added', file)
}

const handleFileEdit = (file: DropzoneFile, index: number) => {
  if (!props.disabled) {
    emit('file:edit', file, index)
  }
}

const removeFile = (index: number) => {
  const newArray = [...(props.modelValue || [])]
  const removedFile = newArray.splice(index, 1)[0]
  emit('update:modelValue', newArray)
  emit('file:removed', removedFile)

  // Reset input file
  if (inputFileRef.value) {
    inputFileRef.value.value = ''
  }
}

const handleCropped = (croppedFile: DropzoneFile) => {
  if (croppKey.value !== null) {
    const newArray = [...(props.modelValue || [])]
    newArray[croppKey.value] = croppedFile
    emit('update:modelValue', newArray)
    emit('file:added', croppedFile)
  }

  imageToCropp.value = null
  croppKey.value = null
}

const uploadQueue = async (): Promise<void> => {
  const uploadPromises = queue.value.map(async (file) => {
    if (!file.upload) return

    file.upload.isLoading = true

    try {
      // TODO: Implement actual file upload logic
      // const response = await uploadFile(file.file, props.uploadBucket)

      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100))
        if (file.upload) {
          file.upload.progress = progress
        }
      }

      if (file.upload) {
        file.upload.isUploaded = true
        file.upload.isLoading = false
      }

      emit('file:loaded', file)
    } catch (error) {
      if (file.upload) {
        file.upload.error = error instanceof Error ? error.message : 'Upload failed'
        file.upload.isLoading = false
      }
    }
  })

  await Promise.all(uploadPromises)
}

// Drag and drop handlers
const setupDragAndDrop = () => {
  if (!dropzoneRef.value) return

  const dragEvents = ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop']

  dragEvents.forEach(eventName => {
    dropzoneRef.value?.addEventListener(eventName, (e) => {
      e.preventDefault()
      e.stopPropagation()
    })
  })

  dropzoneRef.value?.addEventListener('drop', (e) => {
    const dataTransfer = e as DragEvent
    if (dataTransfer.dataTransfer?.files) {
      addFiles(dataTransfer.dataTransfer.files)
    }
  })
}

// Lifecycle
onMounted(() => {
  setupDragAndDrop()
})

// Watch for modelValue changes
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    const processedValue = newValue.map(file => {
      if (!file.base64 && file.image) {
        return {
          ...file,
          base64: file.image
        }
      }
      return file
    })
    emit('update:modelValue', processedValue)
  }
}, { deep: true, immediate: true })
</script>

<style scoped>
.UiDropzone {
  &.disabled {
    @apply opacity-50 cursor-not-allowed;

    .UiDropzone__addFile {
      @apply cursor-not-allowed;

      &:hover {
        @apply border-gray-300;
      }
    }
  }
}

.file-input {
  @apply hidden;
}

.UiDropzone__addFile {
  @apply border-2 border-dashed border-gray-300 rounded-lg p-5 transition-colors duration-300 cursor-pointer;

  &:hover:not(.disabled) {
    @apply border-blue-500;
  }
}

.plus-icon {
  &::before,
  &::after {
    content: '';
    @apply block absolute inset-0 bg-gray-300 transition-colors duration-300;
  }

  &::after {
    @apply rotate-90;
  }
}

.UiDropzone__addFile:hover .plus-icon {
  &::before,
  &::after {
    @apply bg-blue-500;
  }
}

.UiDropzone__file {
  @apply rounded-lg overflow-hidden;

  img {
    @apply object-cover;
  }
}

/* Slide transition for hint */
.slide-y-enter-active,
.slide-y-leave-active {
  transition: all 0.3s ease;
}

.slide-y-enter-from,
.slide-y-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.cropper {
  @apply overflow-hidden;
}
</style>
