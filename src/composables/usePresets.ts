import { ref } from 'vue'
import { nanoid } from 'nanoid'
import type { Preset, NotificationConfig } from '@/types/notification'

const STORAGE_KEY = 'toast-builder-presets'

function loadFromStorage(): Preset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveToStorage(presets: Preset[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets))
}

export function usePresets() {
  const presets = ref<Preset[]>(loadFromStorage())

  function savePreset(name: string, config: Omit<NotificationConfig, 'id'>): void {
    const preset: Preset = {
      id: nanoid(),
      name: name.trim(),
      config,
      createdAt: new Date().toISOString(),
    }

    presets.value.push(preset)
    saveToStorage(presets.value)
  }

  function loadPreset(id: string): Preset | undefined {
    return presets.value.find((p) => p.id === id)
  }

  function deletePreset(id: string): void {
    presets.value = presets.value.filter((p) => p.id !== id)
    saveToStorage(presets.value)
  }

  return {
    presets,
    savePreset,
    loadPreset,
    deletePreset,
  }
}