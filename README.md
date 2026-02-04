# Flex

Flex is a Vite + React playground for experimenting with React-Bits-inspired components, plus a simple page builder/export tool. It also includes optional Tambo-powered AI editing for supported components.

Built with **React + TypeScript + Tailwind CSS**, and inspired by **[React-Bits](https://github.com/DavidHDev/react-bits)**.

**Highlights**

- Interactive playground for components (preview + prop controls + code view)
- Simple website builder that exports a starter React project as a `.zip`
- Optional Tambo-powered AI editing for supported components

**Status:** Early-stage playground; APIs and component list may change. See [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) and [issue #1](https://github.com/momo-shogun/Flex/issues/1) for current work.

## What you can do

- **Component playground** (`/`)
  - Preview components and tweak props in the right-side **Customize** panel.
  - View the generated code in the **Code** tab.
- **Website Builder** (`/tools/website-builder`)
  - Add sections/components from the left panel, edit their props in **Inspector**, and export a starter project as a `.zip`.

The website builder/export flow currently supports the components listed below. For the latest status/roadmap, see [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md).

## Currently implemented components

These components are currently wired into both the playground and the website builder/export flow.

- Text animations: `SplitText`, `BlurText`, `TextCursor`
- Backgrounds: `Silk`, `FloatingLines`, `LightPillar`
- Sections: `SmoothScrollHero`, `AuroraHero`, `FAQ`

## Quick start

### Install

This repo uses `pnpm` (lockfile: `pnpm-lock.yaml`), but `npm`/`yarn` should also work.

```bash
pnpm install
```

### Run the dev server

```bash
pnpm dev
```

If you prefer `npm` or `yarn`:

- Install: `npm install` or `yarn install`
- Dev: `npm run dev` or `yarn dev`

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

If you prefer `npm` or `yarn`:

- Build: `npm run build` or `yarn build`
- Lint: `npm run lint` or `yarn lint`
- Preview: `npm run preview` or `yarn preview`

## Optional: Tambo integration

The project includes `@tambo-ai/react` and a set of `Interactable*` wrappers in `src/components/react-bits/` that can be used for AI-driven edits. The wrappers expose targets for Tambo to modify, but you'll still need to add a thread/chat UI to send instructions.

For how to wire up a thread/chat UI and skills, see [TAMBO_CONCEPTS.md](./TAMBO_CONCEPTS.md) and [SKILLS_GUIDE.md](./SKILLS_GUIDE.md).

Tambo-registered generative UI components live in `src/components/tambo/`.

To provide a Tambo API key locally:

```bash
# .env.local
VITE_TAMBO_API_KEY=sk_...
```

## Additional docs

- [GET_STARTED.md](./GET_STARTED.md) - more detailed setup and usage steps
- [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) - current implementation status and roadmap
- [REACT_BITS_INTEGRATION.md](./REACT_BITS_INTEGRATION.md) - React-Bits component notes and integration details
- [TAMBO_CONCEPTS.md](./TAMBO_CONCEPTS.md) - concepts and patterns for Tambo integration
- [SKILLS_GUIDE.md](./SKILLS_GUIDE.md) - defining and using AI skills
- [PROJECT_IMPLEMENTATION_GUIDE.md](./PROJECT_IMPLEMENTATION_GUIDE.md) - broader project plan

## Contributing

Contributions are welcome. If you'd like to propose changes (components, playground UX, export, or Tambo integration), please open an issue or pull request.

## License

This repository does not currently include a `LICENSE` file, so licensing is not finalized. Code is provided for evaluation and contribution only until a `LICENSE` is added.
