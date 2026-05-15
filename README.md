# Toast Notification Builder

A real-time, fully configurable toast notification builder built with **Vue 3** and **TypeScript**. Design, preview, and export toast notifications with live updates as you configure them.

---

## a. Setup Instructions

### Prerequisites

- **Node.js** `>= 18`
- **npm** `>= 9`

### Install & Run

```bash
npm install
npm run dev
```

The app will be available at **https://toast-notification-builder-v3-verce.vercel.app/**.

### Run Tests

```bash
npm run test
```

### Build for Production

```bash
npm run build
```

---

## b. Description of Approach

### Architecture

The app uses a **single-store, component-tree** pattern built with Vue 3's Composition API — no Pinia or Vuex needed. A module-level `useNotificationStore` composable holds a `reactive` singleton that both panels share.

```
useNotificationStore (reactive singleton)
       │
  ┌────┴────┐
  │         │
ConfigPanel  PreviewPanel
 (writes)   (reads + triggers)
```

- **ConfigPanel** (left panel) — all configuration controls. Writes changes via `updateConfig()` and `changeType()`.
- **PreviewPanel** (right panel) — reads the same reactive state and renders a live preview. Includes `PreviewStage`, `PresetManager`, and `CodeExport`.
- **ToastContainer** — fixed-position overlay rendered once per position (6 total). Receives `ActiveNotification[]` filtered by position and stacks them with `TransitionGroup`.

### State Design

| State | Type | Lifetime |
|---|---|---|
| `config` | `reactive<NotificationConfig>` | App session |
| `activeNotifications` | `reactive<ActiveNotification[]>` | Until dismissed or auto-expired |
| Presets | `ref<Preset[]>` + `localStorage` | Persistent across page refreshes |

`config` is exposed as `readonly` to all consumers. All mutations go through typed action functions (`updateConfig`, `changeType`, `resetConfig`) so state changes are always traceable.

### Animations

Three animation styles implemented via **@vueuse/motion** spring physics. Direction is automatically derived from the active `position` value:

| Style | Behaviour |
|---|---|
| **Fade** | Opacity + Y nudge + subtle scale, expo-out easing |
| **Slide** | Horizontal spring from the nearest screen edge |
| **Bounce** | Scale + Y spring — a light pop on entry |

### Design System

All color and typography tokens live in `style.css` as CSS variables (`--bg-panel`, `--text-primary`, `--font-size-body`, etc.) under `:root` for light mode and `[data-theme='dark']` for dark mode. Components reference variables only — no hardcoded values.

### Testing

Tests are in `src/__tests__/notification.spec.ts` using **Jest** + **@vue/test-utils** + **ts-jest**. They test the store in isolation (no DOM mount needed). A dedicated `tsconfig.test.json` handles the CommonJS transform required by Jest while the main app stays ESM.

### Project Structure

```
src/
├── components/
│   ├── builder/        # ConfigPanel, TypeSelector, PositionSelector,
│   │                   # AnimationSelector, IconSelector
│   ├── preview/        # PreviewPanel, PreviewStage, PresetManager, CodeExport
│   └── toast/          # ToastContainer, ToastItem
├── store/
│   └── useNotificationStore.ts
├── composables/
│   ├── usePresets.ts
│   └── useTheme.ts
├── types/
│   └── notification.ts
├── utils/
│   └── notificationDefaults.ts
└── style.css
```

### Bonus Features Implemented

All optional bonus features from the spec were completed:

- ✅ Animation styles — fade, slide, bounce (selectable per notification)
- ✅ Code export — syntax-highlighted JS snippet with copy-to-clipboard and file download
- ✅ Preset delete — delete button per saved preset
- ✅ Progress bar — live countdown bar inside each toast
- ✅ Custom icon upload — drag-and-drop or click-to-upload (PNG/JPG/SVG, max 100 KB)
- ✅ Dark / light theme toggle — persisted to `localStorage`

### Key Libraries

| Library | Purpose |
|---|---|
| `vue` 3 | UI framework (Composition API, `<script setup>`) |
| `nanoid` | Collision-free unique ID generation for notifications and presets |
| `@vueuse/motion` | Physics-based spring animations (fade / slide / bounce) |
| `jest` + `@vue/test-utils` + `ts-jest` | Unit testing |

---

## c. Assumptions

1. **Single user / single tab.** The store is a module-level singleton. Two tabs open simultaneously will have independent, unsynced state — acceptable for a local builder tool.

2. **Preset persistence is best-effort.** Presets are stored in `localStorage`. Clearing browser storage loses them. No additional backup mechanism is provided.

3. **Custom icons are small and inline.** Uploaded icons are Base64-encoded and stored in reactive state directly (limited to 100 KB). No file server or CDN is required.

4. **Code export is framework-agnostic.** The exported snippet is plain JavaScript (`const notification = { ... }`). The user is expected to wire it into their own notification handler.

5. **Six positions instead of four.** The spec defines four positions. The implementation supports six (adding `top-center` and `bottom-center`) to give users more placement control.

6. **Desktop-first responsive layout.** The UI is optimised for laptops and monitors (≥ 1024 px). On tablets (≤ 768 px) the panels stack vertically and the page scrolls; mobile phones are functional but not the primary target.

7. **No Pinia used.** The spec lists Pinia/Vuex as optional. A hand-rolled reactive composable was chosen to keep the dependency count low and the state pattern transparent.

8. **`nanoid` chosen over `crypto.randomUUID`.** The spec explicitly allows `uuid` or `nanoid`. `nanoid` was preferred because it generates shorter IDs (21 characters vs 36 for UUID v4), has no hyphens making them cleaner as React/Vue `:key` values, is faster, has zero dependencies, and is listed as a direct allowed option in the spec. It is used in two places: `triggerNotification()` to stamp each active toast, and `savePreset()` to identify saved presets.
