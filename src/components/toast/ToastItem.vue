<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue'
import type { ActiveNotification } from '@/types/notification'
import { useNotificationStore } from '@/store/useNotificationStore'

const props = defineProps<{
  notification: ActiveNotification
}>()

const { dismissNotification } = useNotificationStore()

const progress = ref(100)
let timer: ReturnType<typeof setTimeout> | null = null
let interval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  if (props.notification.duration === 0) return

  const duration = props.notification.duration
  const step = 100 / (duration / 100)

  interval = setInterval(() => {
    progress.value = Math.max(0, progress.value - step)
  }, 100)

  timer = setTimeout(() => {
    dismissNotification(props.notification.id)
  }, duration)
})

onUnmounted(() => {
  if (timer) clearTimeout(timer)
  if (interval) clearInterval(interval)
})


const motionVariants = computed(() => {
  const { animation, position } = props.notification
  const fromLeft  = position.endsWith('left')
  const fromTop   = position.startsWith('top')

  const enter = { opacity: 1, x: 0, y: 0, scale: 1 }

  if (animation === 'fade') {
    return {
      initial: { opacity: 0, y: fromTop ? -6 : 6 },
      enter:   { ...enter, transition: { duration: 280, ease: 'easeOut' } },
    }
  }

  if (animation === 'slide') {
    return {
      initial: { opacity: 0, x: fromLeft ? -100 : 100 },
      enter:   { ...enter, transition: { type: 'spring', stiffness: 380, damping: 38, mass: 0.9 } },
    }
  }

  return {
    initial: { opacity: 0, scale: 0.82, y: fromTop ? -10 : 10 },
    enter:   { ...enter, transition: { type: 'spring', stiffness: 420, damping: 30, mass: 0.85 } },
  }
})
</script>

<template>
  <div
    v-motion
    :initial="motionVariants.initial"
    :enter="motionVariants.enter"
    class="toast"
    :style="{
      backgroundColor: notification.backgroundColor,
      color: notification.textColor,
    }"
  >
    <span v-if="notification.showIcon" class="toast__icon">
      <img
        v-if="notification.customIconUrl"
        :src="notification.customIconUrl"
        class="toast__icon-img"
        alt="icon"
      />
      <template v-else>{{ notification.icon }}</template>
    </span>

    <div class="toast__content">
      <p class="toast__title">{{ notification.title }}</p>
      <p class="toast__message">{{ notification.message }}</p>
    </div>

    <button
      v-if="notification.showCloseButton"
      class="toast__close"
      :style="{ color: notification.textColor }"
      @click="dismissNotification(notification.id)"
    >
      ✕
    </button>

    <div v-if="notification.duration > 0" class="toast__progress-track">
      <div
        class="toast__progress-bar"
        :style="{
          width: `${progress}%`,
          backgroundColor: notification.textColor,
        }"
      />
    </div>
  </div>
</template>

<style scoped>
.toast {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.875rem 1rem 1.25rem;
  border-radius: 0.5rem;
  min-width: 280px;
  max-width: 380px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.toast__icon {
  font-size: 1.125rem;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.toast__icon-img {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.toast__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.toast__title {
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.4;
}

.toast__message {
  font-size: 0.8125rem;
  opacity: 0.9;
  line-height: 1.4;
}

.toast__close {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  opacity: 0.8;
  padding: 0;
  flex-shrink: 0;
  line-height: 1;
  transition: opacity 0.15s;
}

.toast__close:hover {
  opacity: 1;
}

.toast__progress-track {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(0, 0, 0, 0.15);
}

.toast__progress-bar {
  height: 100%;
  transition: width 0.1s linear;
}
</style>