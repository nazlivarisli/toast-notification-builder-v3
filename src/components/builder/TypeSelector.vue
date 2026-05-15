<script setup lang="ts">
import { useNotificationStore } from '@/store/useNotificationStore'
import { TYPE_DEFAULTS } from '@/utils/notificationDefaults'
import type { NotificationType } from '@/types/notification'

const { config, changeType } = useNotificationStore()

const types: NotificationType[] = ['success', 'error', 'warning', 'info']

const typeIcons: Record<NotificationType, string> = {
  success: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  error: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  warning: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  info: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
}

const typeColors: Record<NotificationType, { icon: string; glow: string }> = {
  success: { icon: '#22c55e', glow: 'rgba(34,197,94,0.15)' },
  error:   { icon: '#ef4444', glow: 'rgba(239,68,68,0.15)' },
  warning: { icon: '#f59e0b', glow: 'rgba(245,158,11,0.15)' },
  info:    { icon: '#3b82f6', glow: 'rgba(59,130,246,0.15)' },
}
</script>

<template>
  <div class="type-selector">
    <button
      v-for="type in types"
      :key="type"
      class="selector-btn"
      :class="{ 'selector-btn--active': config.type === type }"
      :style="config.type === type
        ? { '--type-icon-color': '#fff', '--type-glow': typeColors[type].glow, borderColor: TYPE_DEFAULTS[type].backgroundColor, background: TYPE_DEFAULTS[type].backgroundColor }
        : { '--type-icon-color': typeColors[type].icon, '--type-glow': 'transparent' }"
      @click="changeType(type)"
    >
      <span class="selector-btn__icon" v-html="typeIcons[type]" />
      <span class="selector-btn__label">{{ type.charAt(0).toUpperCase() + type.slice(1) }}</span>
    </button>
  </div>
</template>

<style scoped>
.type-selector {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}

.selector-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  padding: 0.625rem 0.375rem 0.5rem;
  border: 1.5px solid var(--border-input);
  border-radius: 0.5rem;
  background: var(--bg-panel);
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, color 0.15s, box-shadow 0.15s;
  font-family: inherit;
  color: var(--text-secondary);
}

.selector-btn:not(.selector-btn--active):hover {
  border-color: var(--type-icon-color);
  background: var(--type-glow);
}

.selector-btn--active {
  color: #ffffff;
  box-shadow: 0 2px 8px var(--type-glow);
}

.selector-btn__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--type-icon-color);
  line-height: 1;
  transition: color 0.15s;
}

.selector-btn__label {
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.01em;
}
</style>