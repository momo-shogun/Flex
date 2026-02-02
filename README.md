# Flex — AI Design System Playground

Scaffold + core: Vite + React + TypeScript, Zustand store, `withInteractable` HOC, and one full flow (canvas → chat → AI intent → mutations → store → UI).

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:5173. Click a button on the canvas, then in the chat try:

- **Make it accessible** — mock applies accessible styles (contrast, min size, focus)
- **Round corners** / **Make it more playful** — mock adds rounded corners

No API key needed for these mock commands. For real Claude API, set `VITE_CLAUDE_API_KEY` and use the same chat.

## What’s included

| Area | Files |
|------|--------|
| **Scaffold** | `vite.config.ts`, `tailwind.config.js`, `src/main.tsx`, `src/index.css` |
| **Types** | `src/types/design-system.ts`, `ai.ts`, `a11y.ts` |
| **Store** | `src/store/design-system-store.ts` (Zustand + Immer, theme, tokens, components, undo/redo) |
| **HOC** | `src/core/interactable/withInteractable.tsx` + `types.ts` |
| **AI** | `src/core/ai/intent-parser.ts`, `mutation-engine.ts`, `prompts.ts` |
| **One flow** | `Canvas` (2 interactable buttons) → `ChatPanel` (input → parser → mutations → store) → GSAP highlight on change |

## Project structure (abridged)

```
src/
├── components/
│   ├── canvas/Canvas.tsx
│   ├── chat/ChatPanel.tsx
│   └── design-system/Button.tsx, InteractableButton.tsx
├── core/
│   ├── interactable/withInteractable.tsx, types.ts
│   └── ai/intent-parser.ts, mutation-engine.ts, prompts.ts
├── store/design-system-store.ts
├── types/
├── App.tsx, main.tsx, index.css
```

## Optional: Claude API

Create `.env`:

```
VITE_CLAUDE_API_KEY=sk-ant-...
```

Then in app init (e.g. in `main.tsx` or a provider), set the key on the parser:

```ts
import { IntentParser } from '@/core/ai/intent-parser';
// parser.setApiKey(import.meta.env.VITE_CLAUDE_API_KEY ?? null);
```

Right now the parser uses **mock responses** for phrases like “make it accessible”, “round corners”, “increase contrast”, “make it more playful”, so the flow works without an API key.

---

Next steps (from your guides): inspector panel, a11y analyzer, export, voice, health dashboard.
