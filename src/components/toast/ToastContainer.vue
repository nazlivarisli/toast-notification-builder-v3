<script setup lang="ts">
import ToastItem from '@/components/toast/ToastItem.vue'
import type { ActiveNotification, Position } from '@/types/notification'
defineProps<{
  position: Position
  notifications: readonly ActiveNotification[]
}>()
</script>

<template>
  <div
    v-if="notifications.length > 0"
    class="toast-container"
    :class="`toast-container--${position}`"
  >
    <TransitionGroup name="toast-list">
      <ToastItem
        v-for="notification in notifications"
        :key="notification.id"
        :notification="notification"
      />
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  pointer-events: none;
}

.toast-container > * {
  pointer-events: all;
}
.toast-container--top-left {
  top: 0;
  left: 0;
  align-items: flex-start;
}

.toast-container--top-center {
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  align-items: center;
}

.toast-container--top-right {
  top: 0;
  right: 0;
  align-items: flex-end;
}

.toast-container--bottom-left {
  bottom: 0;
  left: 0;
  align-items: flex-start;
}

.toast-container--bottom-center {
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  align-items: center;
}

.toast-container--bottom-right {
  bottom: 0;
  right: 0;
  align-items: flex-end;
}
.toast-list-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
  position: absolute;
  pointer-events: none;
}

.toast-list-leave-to {
  opacity: 0;
  transform: scale(0.92) translateY(-4px);
}

.toast-list-move {
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
</style>