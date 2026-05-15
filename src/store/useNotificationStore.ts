import { reactive, readonly } from 'vue'
import { nanoid } from 'nanoid'
import type { NotificationConfig, ActiveNotification } from '@/types/notification'
import { getTypeDefaults } from '@/utils/notificationDefaults'

function createDefaultConfig(): Omit<NotificationConfig, 'id'> {
  return {
    type: 'success',
    title: 'Success!',
    message: 'Your changes have been saved successfully.',
    duration: 3000,
    position: 'top-right',
    backgroundColor: '#22c55e',
    textColor: '#ffffff',
    showIcon: true,
    showCloseButton: true,
    animation: 'slide',
    icon: '✓',
    customIconUrl: null,
  }
}

const config = reactive<Omit<NotificationConfig, 'id'>>(createDefaultConfig())
const activeNotifications = reactive<ActiveNotification[]>([])

function updateConfig(partial: Partial<Omit<NotificationConfig, 'id'>>) {
  Object.assign(config, partial)
}

function changeType(type: NotificationConfig['type']) {
  const defaults = getTypeDefaults(type)
  Object.assign(config, {
    type,
    backgroundColor: defaults.backgroundColor,
    textColor: defaults.textColor,
    icon: defaults.icon,
    customIconUrl: null,
  })
}

function resetConfig() {
  Object.assign(config, createDefaultConfig())
}

function triggerNotification() {
  const notification: ActiveNotification = {
    ...config,
    id: nanoid(),
    createdAt: Date.now(),
  }
  activeNotifications.push(notification)
}

function dismissNotification(id: string) {
  const index = activeNotifications.findIndex((n) => n.id === id)
  if (index !== -1) {
    activeNotifications.splice(index, 1)
  }
}

export function useNotificationStore() {
  return {
    config: readonly(config),
    activeNotifications: readonly(activeNotifications),
    updateConfig,
    changeType,
    resetConfig,
    triggerNotification,
    dismissNotification,
  }
}