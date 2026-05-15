import type { NotificationType, Position } from '@/types/notification'

interface TypeDefaults {
  backgroundColor: string
  textColor: string
  icon: string
}

export const TYPE_DEFAULTS: Record<NotificationType, TypeDefaults> = {
  success: {
    backgroundColor: '#22c55e',
    textColor: '#ffffff',
    icon: '✓',
  },
  error: {
    backgroundColor: '#ef4444',
    textColor: '#ffffff',
    icon: '✕',
  },
  warning: {
    backgroundColor: '#f59e0b',
    textColor: '#ffffff',
    icon: '⚠',
  },
  info: {
    backgroundColor: '#3b82f6',
    textColor: '#ffffff',
    icon: 'ℹ',
  },
}

export function getTypeDefaults(type: NotificationType): TypeDefaults {
  return TYPE_DEFAULTS[type]
}

export const POSITION_LABELS: Record<Position, string> = {
  'top-left':      'Top Left',
  'top-center':    'Top Center',
  'top-right':     'Top Right',
  'bottom-left':   'Bottom Left',
  'bottom-center': 'Bottom Center',
  'bottom-right':  'Bottom Right',
}

export const POSITIONS = Object.keys(POSITION_LABELS) as Position[]

export function formatPosition(pos: Position): string {
  return POSITION_LABELS[pos]
}