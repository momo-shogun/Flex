# Flex

Flex is a Vite + React design system playground for experimenting with React-Bits-inspired components, plus a simple page builder/export tool. It also includes optional Tambo-powered AI editing for supported components.

Built with **React + TypeScript + Tailwind CSS**, and inspired by **[React-Bits](https://github.com/DavidHDev/react-bits)**.

**Highlights**

- Interactive playground for components (preview + prop controls + code view)
- Simple website builder that exports a starter React project as a `.zip`
- Optional Tambo-powered AI editing for supported components

**Status:** Early-stage playground; APIs and component list may change. See [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) for current work and planned features.

## What you can do

- **Component playground** (`/`)
  - Preview components and tweak props in the right-side **Customize** panel.
  - View the generated code in the **Code** tab.
- **Website Builder** (`/tools/website-builder`)
  - Add sections/components from the left panel, edit their props in **Inspector**, and export a starter project as a `.zip`.

## Currently implemented components

See [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) for the authoritative list of components that are wired into the playground and website builder/export flow.

The set is expected to grow over time (text animations, backgrounds, and page sections).

Examples include:

- Text animations: `SplitText`, `BlurText`, `TextCursor`
- Backgrounds: `Silk`, `FloatingLines`, `LightPillar`
- Sections: `SmoothScrollHero`, `AuroraHero`, `FAQ`

## Quick start

### Install

This repo uses `pnpm` (lockfile: `pnpm-lock.yaml`) and is tested with `pnpm`. `npm`/`yarn` may work, but are not the primary supported path.

If you don't have `pnpm` installed, see the [pnpm installation guide](https://pnpm.io/installation).

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

You should see the component playground with a preview pane and a Customize/Code panel.

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

To see how Tambo is wired into the app shell, start from `src/main.tsx` (`TamboProvider`) and `src/config/tambo-components.ts`.

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

Licensing is currently under review (there is no `LICENSE` file). Earlier revisions of this README mentioned MIT, but no `LICENSE` file was added.

Until a license is explicitly published in a `LICENSE` file, treat this repository as "all rights reserved" outside of local evaluation and contribution back to this repository.
