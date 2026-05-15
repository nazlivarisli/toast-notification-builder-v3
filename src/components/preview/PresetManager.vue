<script setup lang="ts">
import { ref } from 'vue'
import { useNotificationStore } from '@/store/useNotificationStore'
import { usePresets } from '@/composables/usePresets'
import { formatPosition } from '@/utils/notificationDefaults'

const { config, updateConfig } = useNotificationStore()
const { presets, savePreset, loadPreset, deletePreset } = usePresets()

const presetName = ref('')

function handleSave() {
  if (!presetName.value.trim()) return
  savePreset(presetName.value, { ...config })
  presetName.value = ''
}

function handleLoad(id: string) {
  const preset = loadPreset(id)
  if (!preset) return
  updateConfig({ ...preset.config })
}

</script>

<template>
  <div class="preset-manager">
    <h3 class="preset-manager__title">Saved Presets</h3>

    <ul v-if="presets.length > 0" class="preset-manager__list">
      <li
        v-for="preset in presets"
        :key="preset.id"
        class="preset-manager__item"
      >
        <span
          class="preset-manager__dot"
          :style="{ backgroundColor: preset.config.backgroundColor }"
        />
        <div class="preset-manager__info">
          <span class="preset-manager__name">{{ preset.name }}</span>
          <span class="preset-manager__meta">
            {{ preset.config.duration === 0 ? 'Persistent' : `${preset.config.duration / 1000}s` }}
            • {{ formatPosition(preset.config.position) }}
          </span>
        </div>
        <div class="preset-manager__actions">
          <button class="preset-manager__btn" @click="handleLoad(preset.id)">
            Load
          </button>
          <button
            class="preset-manager__btn preset-manager__btn--danger"
            @click="deletePreset(preset.id)"
          >
            Delete
          </button>
        </div>
      </li>
    </ul>

    <p v-else class="preset-manager__empty">No saved presets yet.</p>

    <div class="preset-manager__save-row">
      <input
        v-model="presetName"
        class="preset-manager__input"
        type="text"
        placeholder="Preset name..."
        @keyup.enter="handleSave"
      />
      <button
        class="preset-manager__save-btn"
        :disabled="!presetName.trim()"
        @click="handleSave"
      >
        Save
      </button>
    </div>
  </div>
</template>

<style scoped>
.preset-manager {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
  min-height: 0;
}

.preset-manager__title {
  font-size: var(--font-size-section-title);
  font-weight: var(--font-weight-title);
  color: var(--text-primary);
}

.preset-manager__list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow-y: auto;
  max-height: 220px;
  padding-right: 2px;
}

.preset-manager__item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.75rem;
  border: 1px solid var(--border-input);
  border-radius: 0.5rem;
  background: var(--bg-preset-item);
}

.preset-manager__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.preset-manager__info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.preset-manager__name {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-label);
  color: var(--text-primary);
}

.preset-manager__meta {
  font-size: var(--font-size-caption);
  color: var(--text-muted);
}

.preset-manager__actions {
  display: flex;
  gap: 0.375rem;
}

.preset-manager__btn {
  padding: 0.25rem 0.625rem;
  font-size: var(--font-size-caption);
  font-weight: var(--font-weight-label);
  border-radius: 0.375rem;
  border: 1px solid var(--border-input);
  background: var(--bg-panel);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
}

.preset-manager__btn:hover {
  background: var(--bg-stage);
}

.preset-manager__btn--danger {
  color: #ef4444;
  border-color: #fecaca;
}

.preset-manager__btn--danger:hover {
  background: var(--bg-stage);
}

.preset-manager__save-row {
  display: flex;
  gap: 0.5rem;
}

.preset-manager__input {
  flex: 1;
  border: 1px solid var(--border-input);
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  font-size: var(--font-size-body);
  color: var(--text-primary);
  background: var(--bg-panel);
  outline: none;
  transition: border-color 0.15s;
  font-family: inherit;
}

.preset-manager__input:focus {
  border-color: #6366f1;
}

.preset-manager__save-btn {
  padding: 0.5rem 1rem;
  background: #6366f1;
  color: #ffffff;
  border: none;
  border-radius: 0.375rem;
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-label);
  cursor: pointer;
  transition: background 0.15s;
  font-family: inherit;
  white-space: nowrap;
}

.preset-manager__save-btn:hover:not(:disabled) {
  background: #4f46e5;
}

.preset-manager__save-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.preset-manager__empty {
  font-size: var(--font-size-body);
  color: var(--text-muted);
  text-align: center;
  padding: 1rem 0;
}
</style>