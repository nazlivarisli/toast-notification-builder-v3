import { ref, watch } from 'vue'

type Theme = 'light' | 'dark'

const theme = ref<Theme>(
  (localStorage.getItem('toast-builder-theme') as Theme) ?? 'light'
)

function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

watch(theme, (val) => {
  document.documentElement.setAttribute('data-theme', val)
  localStorage.setItem('toast-builder-theme', val)
}, { immediate: true })

export function useTheme() {
  return { theme, toggleTheme }
}