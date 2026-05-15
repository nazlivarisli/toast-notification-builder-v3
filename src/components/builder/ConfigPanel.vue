<script setup lang="ts">
import TypeSelector from '@/components/builder/TypeSelector.vue'
import PositionSelector from '@/components/builder/PositionSelector.vue'
import AnimationSelector from '@/components/builder/AnimationSelector.vue'
import IconSelector from '@/components/builder/IconSelector.vue'
import { useNotificationStore } from '@/store/useNotificationStore'

const { config, updateConfig } = useNotificationStore()

function handleHexInput(field: 'backgroundColor' | 'textColor', value: string) {
  const hex = value.startsWith('#') ? value : `#${value}`
  if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex)) {
    updateConfig({ [field]: hex })
  }
}
</script>

<template>
  <div class="config-panel">
    <h2 class="config-panel__title">Configuration</h2>

    <section class="config-panel__section">
      <label class="config-panel__label">Type</label>
      <TypeSelector />
    </section>


    <section class="config-panel__section">
      <label class="config-panel__label" for="title">Title</label>
      <input
        id="title"
        class="config-panel__input"
        type="text"
        :value="config.title"
        @input="updateConfig({ title: ($event.target as HTMLInputElement).value })"
      />
    </section>

    <section class="config-panel__section">
      <label class="config-panel__label" for="message">Message</label>
      <textarea
        id="message"
        class="config-panel__textarea"
        :value="config.message"
        @input="updateConfig({ message: ($event.target as HTMLTextAreaElement).value })"
      />
    </section>

    <section class="config-panel__section">
      <label class="config-panel__label">
        Duration
        <span class="config-panel__duration-value">
          {{ config.duration === 0 ? 'Persistent' : `${config.duration / 1000}s` }}
        </span>
      </label>
      <input
        class="config-panel__slider"
        type="range"
        min="1"
        max="10"
        :value="config.duration === 0 ? 1 : config.duration / 1000"
        :disabled="config.duration === 0"
        @input="updateConfig({ duration: Number(($event.target as HTMLInputElement).value) * 1000 })"
      />
      <label class="config-panel__checkbox-label">
        <input
          type="checkbox"
          :checked="config.duration === 0"
          @change="updateConfig({ duration: ($event.target as HTMLInputElement).checked ? 0 : 3000 })"
        />
        Persistent (no auto-dismiss)
      </label>
    </section>

    <section class="config-panel__section">
      <label class="config-panel__label">Position</label>
      <PositionSelector />
    </section>

    <section class="config-panel__section">
      <label class="config-panel__label config-panel__label--section">Style</label>
      <div class="config-panel__colors">
        <div class="config-panel__color-field">
          <label class="config-panel__label" for="bg-color">Background</label>
          <div class="config-panel__color-row">
            <input
              id="bg-color"
              type="color"
              :value="config.backgroundColor"
              @input="updateConfig({ backgroundColor: ($event.target as HTMLInputElement).value })"
            />
            <input
              class="config-panel__hex-input"
              type="text"
              :value="config.backgroundColor"
              maxlength="7"
              spellcheck="false"
              @change="handleHexInput('backgroundColor', ($event.target as HTMLInputElement).value)"
            />
          </div>
        </div>
        <div class="config-panel__color-field">
          <label class="config-panel__label" for="text-color">Text Color</label>
          <div class="config-panel__color-row">
            <input
              id="text-color"
              type="color"
              :value="config.textColor"
              @input="updateConfig({ textColor: ($event.target as HTMLInputElement).value })"
            />
            <input
              class="config-panel__hex-input"
              type="text"
              :value="config.textColor"
              maxlength="7"
              spellcheck="false"
              @change="handleHexInput('textColor', ($event.target as HTMLInputElement).value)"
            />
          </div>
        </div>
      </div>
    </section>

    <section class="config-panel__section">
      <label class="config-panel__label">Options</label>
      <div class="config-panel__options">
        <label class="config-panel__checkbox-label">
          <input
            type="checkbox"
            :checked="config.showIcon"
            @change="updateConfig({ showIcon: ($event.target as HTMLInputElement).checked })"
          />
          Show Icon
        </label>
        <label class="config-panel__checkbox-label">
          <input
            type="checkbox"
            :checked="config.showCloseButton"
            @change="updateConfig({ showCloseButton: ($event.target as HTMLInputElement).checked })"
          />
          Show Close Button
        </label>
      </div>
    </section>

    <section v-if="config.showIcon" class="config-panel__section">
      <IconSelector />
    </section>

    <section class="config-panel__section">
      <label class="config-panel__label">Animation</label>
      <AnimationSelector />
    </section>
  </div>
</template>

<style scoped>
.config-panel {
  background: var(--bg-panel);
  border-radius: 0.75rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  border: 1px solid var(--border);
  height: 100%;
  min-height: 0;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--border) transparent;
}

@media (max-width: 768px) {
  .config-panel {
    padding: 1rem;
    height: auto;
    overflow-y: visible;
  }
}

.config-panel::-webkit-scrollbar {
  width: 4px;
}

.config-panel::-webkit-scrollbar-track {
  background: transparent;
}

.config-panel::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 99px;
}

.config-panel::-webkit-scrollbar-thumb:hover {
  background: var(--border-input);
}

.config-panel__title {
  font-size: var(--font-size-panel-title);
  font-weight: var(--font-weight-title);
  color: var(--text-primary);
}

.config-panel__section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.config-panel__label {
  font-size: var(--font-size-label);
  font-weight: var(--font-weight-label);
  color: var(--text-secondary);
  display: flex;
  justify-content: space-between;
}

.config-panel__label--section {
  font-weight: var(--font-weight-title);
  color: var(--text-primary);
}

.config-panel__duration-value {
  font-weight: var(--font-weight-body);
  color: var(--text-muted);
  font-size: var(--font-size-caption);
}

.config-panel__input,
.config-panel__textarea {
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

.config-panel__input:focus,
.config-panel__textarea:focus {
  border-color: #6366f1;
}

.config-panel__textarea {
  resize: vertical;
  min-height: 80px;
}

.config-panel__slider {
  width: 100%;
  accent-color: #6366f1;
}

.config-panel__slider:disabled {
  opacity: 0.4;
}

.config-panel__checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: var(--font-size-body);
  color: var(--text-secondary);
  cursor: pointer;
}

.config-panel__colors {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.config-panel__color-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.config-panel__color-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: var(--text-secondary);
  background: transparent;
}

.config-panel__color-row input[type='color'] {
  appearance: none;
  -webkit-appearance: none;
  width: 2rem;
  height: 2rem;
  border: 1px solid var(--border-input);
  outline: none;
  padding: 0;
  background: transparent;
  cursor: pointer;
  border-radius: 0.375rem;
  overflow: hidden;
  flex-shrink: 0;
  transition: border-color 0.15s;
}

.config-panel__color-row input[type='color']:hover {
  border-color: #6366f1;
}

.config-panel__color-row input[type='color']::-webkit-color-swatch-wrapper {
  padding: 0;
  border: none;
}

.config-panel__color-row input[type='color']::-webkit-color-swatch {
  border: none;
  border-radius: 0.25rem;
}

.config-panel__color-row input[type='color']::-moz-color-swatch {
  border: none;
  border-radius: 0.25rem;
}

.config-panel__hex-input {
  flex: 1;
  padding: 0.375rem 0.625rem;
  font-size: 0.8125rem;
  font-family: 'Courier New', monospace;
  color: var(--text-secondary);
  border: 1px solid var(--border-input);
  border-radius: 0.375rem;
  background: var(--bg-panel);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  outline: none;
  transition: border-color 0.15s;
  width: 0;
}

.config-panel__hex-input:focus {
  border-color: #6366f1;
  color: var(--text-primary);
}

.config-panel__options {
  display: flex;
  gap: 1.5rem;
}
</style>