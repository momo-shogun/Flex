# Flex

Flex is a Vite + React playground for experimenting with React-Bits-inspired components, plus a simple page builder/export tool.

## What you can do

- **Component playground** (`/`)
  - Preview components and tweak props in the right-side **Customize** panel.
  - View the generated code in the **Code** tab.
- **Website Builder** (`/tools/website-builder`)
  - Add sections/components from the left panel, edit their props in **Inspector**, and export a starter project as a `.zip`.

## Included components

- Text animations: `SplitText`, `BlurText`, `TextCursor`
- Backgrounds: `Silk`, `FloatingLines`, `LightPillar`
- Sections: `SmoothScrollHero`, `AuroraHero`, `FAQ`

## Quick start

### Install

This repo uses `pnpm` (lockfile: `pnpm-lock.yaml`).

```bash
pnpm install
```

### Run the dev server

```bash
pnpm dev
```

Then open `http://localhost:5173`.

### Useful commands

```bash
# Production build
pnpm build

# Lint
pnpm lint

# Preview a production build
pnpm preview
```

## Optional: Tambo integration

The project includes `@tambo-ai/react` and a set of `Interactable*` wrappers in `src/components/react-bits/` that can be used for AI-driven edits.

To provide a Tambo API key locally:

```bash
# .env.local
VITE_TAMBO_API_KEY=sk_...
```

## Additional docs

- [GET_STARTED.md](./GET_STARTED.md)
- [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md)
- [REACT_BITS_INTEGRATION.md](./REACT_BITS_INTEGRATION.md)
- [TAMBO_CONCEPTS.md](./TAMBO_CONCEPTS.md)
- [SKILLS_GUIDE.md](./SKILLS_GUIDE.md)
- [PROJECT_IMPLEMENTATION_GUIDE.md](./PROJECT_IMPLEMENTATION_GUIDE.md)
