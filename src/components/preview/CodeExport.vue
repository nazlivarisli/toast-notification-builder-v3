<script setup lang="ts">
import { computed, ref } from 'vue'
import { useNotificationStore } from '@/store/useNotificationStore'

type TokenType = 'property' | 'string' | 'number' | 'boolean' | 'null' | 'punctuation' | 'whitespace'

interface Token {
  type: TokenType
  value: string
}

const { config } = useNotificationStore()

const exportObject = computed(() => ({
  type:            config.type,
  title:           config.title,
  message:         config.message,
  duration:        config.duration,
  position:        config.position,
  backgroundColor: config.backgroundColor,
  textColor:       config.textColor,
  showIcon:        config.showIcon,
  showCloseButton: config.showCloseButton,
  animation:       config.animation,
}))

const rawCode = computed(() => JSON.stringify(exportObject.value, null, 2))

const JSON_TOKEN_RE = /("(?:[^"\\]|\\.)*")(\s*:)?|(true|false)|(null)|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|([\{\}\[\],:])|(\n)|( +)/g

const tokens = computed<Token[]>(() => {
  const result: Token[] = []
  const json = rawCode.value
  let match: RegExpExecArray | null
  JSON_TOKEN_RE.lastIndex = 0

  while ((match = JSON_TOKEN_RE.exec(json)) !== null) {
    const [, quoted, colon, bool, nil, num, punct, newline, spaces] = match

    if (quoted !== undefined) {
      result.push({ type: colon !== undefined ? 'property' : 'string', value: quoted })
      if (colon !== undefined) result.push({ type: 'punctuation', value: colon })
    } else if (bool !== undefined) {
      result.push({ type: 'boolean', value: bool })
    } else if (nil !== undefined) {
      result.push({ type: 'null', value: nil })
    } else if (num !== undefined) {
      result.push({ type: 'number', value: num })
    } else if (punct !== undefined) {
      result.push({ type: 'punctuation', value: punct })
    } else if (newline !== undefined) {
      result.push({ type: 'whitespace', value: '\n' })
    } else if (spaces !== undefined) {
      result.push({ type: 'whitespace', value: spaces })
    }
  }

  return result
})

const copied = ref(false)

async function copyToClipboard() {
  await navigator.clipboard.writeText(rawCode.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}

function downloadFile() {
  const blob = new Blob([rawCode.value], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'notification.json'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="code-export">
    <div class="code-export__header">
      <h3 class="code-export__title">Code Export</h3>
      <button class="code-export__export-btn" @click="downloadFile">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        Export to JSON
      </button>
    </div>

    <pre class="code-export__block"><span
      v-for="(token, index) in tokens"
      :key="index"
      :class="token.type !== 'whitespace' ? `code-export__token--${token.type}` : ''"
    >{{ token.value }}</span></pre>

    <button class="code-export__copy" @click="copyToClipboard">
      <svg v-if="!copied" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
      </svg>
      <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      {{ copied ? 'Copied!' : 'Copy to Clipboard' }}
    </button>
  </div>
</template>

<style scoped>
.code-export {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.code-export__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.code-export__title {
  font-size: var(--font-size-section-title);
  font-weight: var(--font-weight-title);
  color: var(--text-primary);
  margin: 0;
}

.code-export__block {
  background: #1a1a2e;
  padding: 1.25rem;
  border-radius: 0.5rem;
  font-family: 'Fira Code', 'Cascadia Code', 'Courier New', monospace;
  font-size: 0.8125rem;
  line-height: 1.8;
  overflow-x: auto;
  white-space: pre;
  margin: 0;
}

.code-export__token--property {
  color: #89ddff;
}

.code-export__token--string {
  color: #c3e88d;
}

.code-export__token--boolean,
.code-export__token--number {
  color: #f78c6c;
}

.code-export__token--null {
  color: #c792ea;
}

.code-export__token--punctuation {
  color: #a6accd;
}

.code-export__copy {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  align-self: flex-start;
  padding: 0.5rem 1rem;
  background: var(--bg-stage);
  border: 1px solid var(--border-input);
  border-radius: 0.375rem;
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-label);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
}

.code-export__copy:hover {
  background: var(--border);
}

.code-export__export-btn {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.3rem 0.75rem;
  border: 1px solid var(--border-input);
  border-radius: 0.375rem;
  background: var(--bg-stage);
  color: var(--text-secondary);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-label);
  cursor: pointer;
  transition: all 0.15s;
}

.code-export__export-btn:hover {
  border-color: #6366f1;
  color: #6366f1;
  background: rgba(99, 102, 241, 0.06);
}
</style>