import { useNotificationStore } from '@/store/useNotificationStore'

beforeEach(() => {
  useNotificationStore().resetConfig()
})

describe('useNotificationStore', () => {
  it('updateConfig merges partial updates without overwriting other fields', () => {
    const { config, updateConfig } = useNotificationStore()

    updateConfig({ title: 'Hello', duration: 5000 })

    expect(config.title).toBe('Hello')
    expect(config.duration).toBe(5000)
    expect(config.position).toBe('top-right')
    expect(config.type).toBe('success')
  })

  it('changeType applies correct type defaults and resets customIconUrl', () => {
    const { config, changeType, updateConfig } = useNotificationStore()

    updateConfig({ customIconUrl: 'data:image/png;base64,abc123' })

    changeType('error')

    expect(config.type).toBe('error')
    expect(config.backgroundColor).toBe('#ef4444')
    expect(config.textColor).toBe('#ffffff')
    expect(config.customIconUrl).toBeNull()
  })

  it('triggerNotification adds a notification and dismissNotification removes it', () => {
    const { activeNotifications, triggerNotification, dismissNotification } =
      useNotificationStore()

    expect(activeNotifications).toHaveLength(0)

    triggerNotification()

    expect(activeNotifications).toHaveLength(1)
    const id = activeNotifications[0].id
    expect(typeof id).toBe('string')
    expect(id.length).toBeGreaterThan(0)

    dismissNotification(id)

    expect(activeNotifications).toHaveLength(0)
  })
})