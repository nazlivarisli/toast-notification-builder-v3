<script setup lang="ts">
import { ref } from 'vue'
import { useNotificationStore } from '@/store/useNotificationStore'

const { config, updateConfig } = useNotificationStore()

const fileInputRef = ref<HTMLInputElement | null>(null)
const uploadError = ref('')
const isDragging = ref(false)
const isOpen = ref(true)

function handleUploadClick() {
  fileInputRef.value?.click()
}

function handleFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  processFile(file)
}

function handleDrop(event: DragEvent) {
  isDragging.value = false
  const file = event.dataTransfer?.files?.[0]
  processFile(file)
}

function processFile(file: File | undefined) {
  uploadError.value = ''

  if (!file) return

  if (!file.type.startsWith('image/')) {
    uploadError.value = 'Please upload a valid image file.'
    return
  }

  if (file.size > 100 * 1024) {
    uploadError.value = 'Image must be under 100KB.'
    return
  }

  const reader = new FileReader()

  reader.onload = (e) => {
    const dataUrl = e.target?.result as string
    updateConfig({ customIconUrl: dataUrl })
  }

  reader.readAsDataURL(file)
}

function clearUpload() {
  uploadError.value = ''
  updateConfig({ customIconUrl: null })
  if (fileInputRef.value) fileInputRef.value.value = ''
}
</script>

<template>
  <div class="icon-upload">

    <button class="icon-upload__toggle" @click="isOpen = !isOpen">
      <svg
        class="icon-upload__chevron"
        :class="{ 'icon-upload__chevron--open': isOpen }"
        width="14" height="14" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2.5"
        stroke-linecap="round" stroke-linejoin="round"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
      Use a custom icon instead
    </button>

    <div v-if="isOpen" class="icon-upload__body">

      <div
        class="icon-upload__dropzone"
        :class="{ 'icon-upload__dropzone--dragging': isDragging }"
        @click="handleUploadClick"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="handleDrop"
      >
        <template v-if="config.customIconUrl">
          <img
            :src="config.customIconUrl"
            class="icon-upload__preview"
            alt="Custom icon preview"
          />
          <span class="icon-upload__replace">Click to replace</span>
        </template>

        <template v-else>
          <svg
            class="icon-upload__upload-icon"
            width="28" height="28" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="1.5"
            stroke-linecap="round" stroke-linejoin="round"
          >
            <polyline points="16 16 12 12 8 16" />
            <line x1="12" y1="12" x2="12" y2="21" />
            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
          </svg>
          <span class="icon-upload__placeholder-text">Click or drag image here</span>
          <span class="icon-upload__hint">PNG, JPG, SVG · Max 100KB</span>
        </template>
      </div>

      <p v-if="uploadError" class="icon-upload__error">
        {{ uploadError }}
      </p>

      <button
        v-if="config.customIconUrl"
        class="icon-upload__clear"
        @click.stop="clearUpload"
      >
        Remove custom icon
      </button>

      <p class="icon-upload__info">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        Replaces the default icon above
      </p>
    </div>

    <input
      ref="fileInputRef"
      type="file"
      accept="image/*"
      class="icon-upload__file-input"
      @change="handleFileChange"
    />
  </div>
</template>

<style scoped>
.icon-upload {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}


.icon-upload__toggle {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-secondary);
  font-family: inherit;
  text-align: left;
  transition: color 0.15s;
}

.icon-upload__toggle:hover {
  color: var(--text-primary);
}

.icon-upload__chevron {
  color: var(--text-muted);
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.icon-upload__chevron--open {
  transform: rotate(90deg);
}


.icon-upload__body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}


.icon-upload__dropzone {
  border: 2px dashed var(--border-input);
  border-radius: 0.5rem;
  padding: 1.75rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  cursor: pointer;
  transition: all 0.15s;
  min-height: 120px;
  text-align: center;
}

.icon-upload__dropzone:hover,
.icon-upload__dropzone--dragging {
  border-color: #6366f1;
  background: var(--bg-stage);
}

.icon-upload__upload-icon {
  color: var(--text-muted);
  margin-bottom: 0.125rem;
}

.icon-upload__preview {
  width: 48px;
  height: 48px;
  object-fit: contain;
  border-radius: 0.25rem;
}

.icon-upload__replace {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.icon-upload__placeholder-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

.icon-upload__hint {
  font-size: 0.75rem;
  color: var(--text-muted);
}


.icon-upload__info {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: var(--text-muted);
  margin: 0;
}

.icon-upload__error {
  font-size: 0.75rem;
  color: #ef4444;
  margin: 0;
}


.icon-upload__clear {
  align-self: flex-start;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid #fecaca;
  border-radius: 0.375rem;
  background: var(--bg-panel);
  color: #ef4444;
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
}

.icon-upload__clear:hover {
  background: var(--bg-stage);
  border-color: #ef4444;
}


.icon-upload__file-input {
  display: none;
}
</style>