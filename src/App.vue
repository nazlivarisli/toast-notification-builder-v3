<script setup lang="ts">
import ConfigPanel from '@/components/builder/ConfigPanel.vue'
import PreviewPanel from '@/components/preview/PreviewPanel.vue'
import ToastContainer from '@/components/toast/ToastContainer.vue'
import { useNotificationStore } from '@/store/useNotificationStore'
import { useTheme } from '@/composables/useTheme'
import { POSITIONS } from '@/utils/notificationDefaults'

const { activeNotifications } = useNotificationStore()
const { theme, toggleTheme } = useTheme()

</script>

<template>
  <div class="app">
    <header class="app__header">
      <h1 class="app__title">Toast Notification Builder</h1>
      <button class="app__theme-btn" @click="toggleTheme">
        {{ theme === 'light' ? '🌙 Dark' : '☀️ Light' }}
      </button>
    </header>

    <main class="app__main">
      <ConfigPanel />
      <PreviewPanel />
    </main>

    <ToastContainer
      v-for="position in POSITIONS"
      :key="position"
      :position="position"
      :notifications="activeNotifications.filter((n) => n.position === position)"
    />
  </div>
</template>

<style scoped>
.app {
  height: 100dvh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-app);
  transition: background-color 0.2s;
  overflow: hidden;
}

.app__header {
  flex-shrink: 0;
  padding: 0.75rem 2rem;
  background-color: var(--header-bg);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.app__title {
  font-size: var(--font-size-app-title);
  font-weight: var(--font-weight-title);
  color: var(--text-primary);
  margin: 0;
}

.app__theme-btn {
  padding: 0.375rem 0.875rem;
  border: 1px solid var(--border);
  border-radius: 0.375rem;
  background: transparent;
  color: var(--text-secondary);
  font-size: var(--font-size-body);
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
}

.app__theme-btn:hover {
  background: var(--border);
}

.app__main {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  padding: 1.25rem 2rem;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  align-items: stretch;
}

/* ── iPad portrait & small tablets (≤ 768px) ────────────────────────────── */
@media (max-width: 768px) {
  .app {
    height: auto;
    min-height: 100dvh;
    overflow: visible;
  }

  .app__header {
    padding: 0.75rem 1.25rem;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .app__title {
    font-size: 1rem;
  }

  .app__main {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 1rem 1.25rem 1.25rem;
    min-height: unset;
    align-items: start;
  }
}

/* ── iPad landscape & small laptops (769px–1024px) ──────────────────────── */
@media (min-width: 769px) and (max-width: 1024px) {
  .app__header {
    padding: 0.75rem 1.5rem;
  }

  .app__main {
    gap: 1rem;
    padding: 1rem 1.5rem;
    max-width: 100%;
  }
}

/* ── Standard laptops (1025px–1440px) ───────────────────────────────────── */
@media (min-width: 1025px) and (max-width: 1440px) {
  .app__main {
    max-width: 1200px;
    padding: 1.25rem 2rem;
  }
}

/* ── Large monitors (≥ 1441px) ──────────────────────────────────────────── */
@media (min-width: 1441px) {
  .app__main {
    max-width: 1400px;
    gap: 1.75rem;
    padding: 1.75rem 3rem;
  }

  .app__header {
    padding: 1rem 3rem;
  }
}
</style>