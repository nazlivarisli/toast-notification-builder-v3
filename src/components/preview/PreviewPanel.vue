<script setup lang="ts">
import PreviewStage from '@/components/preview/PreviewStage.vue'
import PresetManager from '@/components/preview/PresetManager.vue'
import CodeExport from '@/components/preview/CodeExport.vue'
import { useNotificationStore } from '@/store/useNotificationStore'

const { triggerNotification } = useNotificationStore()
</script>

<template>
  <div class="preview-panel">
    <h2 class="preview-panel__title">Preview</h2>

    <PreviewStage />

    <button class="preview-panel__trigger" @click="triggerNotification">
      Show Notification
    </button>

    <PresetManager />

    <CodeExport />
  </div>
</template>

<style scoped>
.preview-panel {
  background: var(--bg-panel);
  border-radius: 0.75rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  border: 1px solid var(--border);
}

@media (max-width: 768px) {
  .preview-panel {
    padding: 1rem;
  }
}

.preview-panel__title {
  font-size: var(--font-size-panel-title);
  font-weight: var(--font-weight-title);
  color: var(--text-primary);
}

.preview-panel__trigger {
  width: 100%;
  padding: 0.75rem;
  background: #6366f1;
  color: #ffffff;
  border: none;
  border-radius: 0.5rem;
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-label);
  cursor: pointer;
  transition: background 0.15s;
  font-family: inherit;
}

.preview-panel__trigger:hover {
  background: #4f46e5;
}
</style>