<script setup lang="ts">
import { useNotificationStore } from '@/store/useNotificationStore'
import type { AnimationStyle } from '@/types/notification'

const { config, updateConfig } = useNotificationStore()

const animations: { value: AnimationStyle; label: string }[] = [
  { value: 'fade',   label: 'Fade'   },
  { value: 'slide',  label: 'Slide'  },
  { value: 'bounce', label: 'Bounce' },
]
</script>

<template>
  <div class="animation-selector">
    <button
      v-for="anim in animations"
      :key="anim.value"
      class="selector-btn"
      :class="{ 'selector-btn--active': config.animation === anim.value }"
      @click="updateConfig({ animation: anim.value })"
    >
      {{ anim.label }}
    </button>
  </div>
</template>

<style scoped>
.animation-selector {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

.selector-btn {
  padding: 0.5rem 0.625rem;
  border: 1px solid var(--border-input);
  border-radius: 0.375rem;
  background: var(--bg-panel);
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
  font-family: inherit;
  text-align: center;
}

.selector-btn:not(.selector-btn--active):hover {
  border-color: #6366f1;
  color: #6366f1;
}

.selector-btn--active {
  background: #6366f1;
  border-color: #6366f1;
  color: #ffffff;
}
</style>