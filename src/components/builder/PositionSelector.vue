<script setup lang="ts">
import { useNotificationStore } from '@/store/useNotificationStore'
import { formatPosition, POSITIONS } from '@/utils/notificationDefaults'

const { config, updateConfig } = useNotificationStore()
</script>

<template>
  <div class="position-selector">
    <button
      v-for="pos in POSITIONS"
      :key="pos"
      class="selector-btn"
      :class="{ 'selector-btn--active': config.position === pos }"
      @click="updateConfig({ position: pos })"
    >
      {{ formatPosition(pos) }}
    </button>
  </div>
</template>

<style scoped>
.position-selector {
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
  line-height: 1.4;
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