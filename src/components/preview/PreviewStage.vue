<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import { useNotificationStore } from '@/store/useNotificationStore'

const { config } = useNotificationStore()

const stageStyle = computed(() => {
  const [vertical, horizontal] = config.position.split('-')
  return {
    alignItems:     vertical === 'top' ? 'flex-start' : 'flex-end',
    justifyContent: horizontal === 'left' ? 'flex-start'
                  : horizontal === 'center' ? 'center'
                  : 'flex-end',
  }
})


const motionVariants = computed(() => {
  const { animation, position } = config
  const fromLeft = position.endsWith('left')
  const fromTop  = position.startsWith('top')

  const enter = { opacity: 1, x: 0, y: 0, scale: 1 }

  if (animation === 'fade') {
    return {
      initial: { opacity: 0, y: fromTop ? -10 : 10, scale: 0.97 },
      enter:   {
        ...enter,
        transition: { duration: 380, ease: [0.16, 1, 0.3, 1] },
      },
    }
  }

  if (animation === 'slide') {
    return {
      initial: { opacity: 0, x: fromLeft ? -80 : 80 },
      enter:   {
        ...enter,
        transition: {
          type: 'spring',
          stiffness: 260,
          damping: 28,
          mass: 0.8,
        },
      },
    }
  }

  return {
    initial: { opacity: 0, scale: 0.78, y: fromTop ? -14 : 14 },
    enter:   {
      ...enter,
      transition: {
        type: 'spring',
        stiffness: 350,
        damping: 22,
        mass: 0.75,
      },
    },
  }
})

const replayKey = ref(0)
watch(
  () => [config.animation, config.position],
  () => { replayKey.value++ }
)
</script>

<template>
  <div class="preview-stage" :style="stageStyle">
    <div
      :key="replayKey"
      v-motion
      :initial="motionVariants.initial"
      :enter="motionVariants.enter"
      class="preview-stage__toast"
      :style="{
        backgroundColor: config.backgroundColor,
        color: config.textColor,
      }"
    >
      <span v-if="config.showIcon" class="preview-stage__icon">
        <img
          v-if="config.customIconUrl"
          :src="config.customIconUrl"
          class="preview-stage__icon-img"
          alt="icon"
        />
        <template v-else>{{ config.icon }}</template>
      </span>

      <div class="preview-stage__content">
        <p class="preview-stage__title">{{ config.title }}</p>
        <p class="preview-stage__message">{{ config.message }}</p>
      </div>

      <button
        v-if="config.showCloseButton"
        class="preview-stage__close"
        :style="{ color: config.textColor }"
      >
        ✕
      </button>

      <div v-if="config.duration > 0" class="preview-stage__progress-track">
        <div
          class="preview-stage__progress-bar"
          :style="{ backgroundColor: config.textColor }"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.preview-stage {
  background: var(--bg-stage);
  border-radius: 0.5rem;
  border: 1px solid var(--border);
  min-height: 200px;
  display: flex;
  padding: 1rem;
  overflow: hidden;
  transition: align-items 0.3s ease, justify-content 0.3s ease;
}

.preview-stage__toast {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.875rem 1rem 1.25rem;
  border-radius: 0.5rem;
  min-width: 240px;
  max-width: 300px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition:
    background-color 0.25s ease,
    color 0.25s ease,
    box-shadow 0.25s ease;
  will-change: transform, opacity;
}

.preview-stage__icon {
  font-size: 1.125rem;
  flex-shrink: 0;
  margin-top: 0.1rem;
  transition: opacity 0.2s ease;
}

.preview-stage__icon-img {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.preview-stage__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.preview-stage__title {
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.4;
  transition: color 0.2s ease;
}

.preview-stage__message {
  font-size: 0.8125rem;
  opacity: 0.9;
  line-height: 1.4;
  transition: color 0.2s ease;
}

.preview-stage__close {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  opacity: 0.7;
  padding: 0;
  flex-shrink: 0;
  transition: opacity 0.15s ease;
}

.preview-stage__close:hover {
  opacity: 1;
}

.preview-stage__progress-track {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(0, 0, 0, 0.12);
  border-radius: 0 0 0.5rem 0.5rem;
  overflow: hidden;
}

.preview-stage__progress-bar {
  height: 100%;
  width: 60%;
  border-radius: inherit;
  transition: background-color 0.25s ease;
}
</style>