# 🎨 Flex - AI-Powered Design System Playground

**Beautiful React components inspired by [React-Bits](https://github.com/DavidHDev/react-bits), enhanced with AI modification capabilities using Tambo SDK.**

---

## ✨ What is Flex?

Flex is an interactive design system playground where:
- 🎭 **Browse beautiful React-Bits components** — Text animations, backgrounds, interactive effects
- ✏️ **Click to edit in real-time** — Select any component and modify its properties
- 🤖 **Use AI to enhance** — Ask Tambo to modify components ("make it faster", "change color to blue")
- 📦 **Export your designs** — Download as React code, Tailwind config, or design tokens

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd /Users/apple/Desktop/pp/hakathon/Flex

# Using npm
npm install

# Or using pnpm
pnpm install

# Or using yarn
yarn install
```

### 2. Start Dev Server

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev
```

### 3. Open Browser

Navigate to **http://localhost:5173**

You should see 3 beautiful text animation components working!

### 4. Next Steps

- Check **[IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md)** for what's been built
- Read **[TAMBO_CONCEPTS.md](./TAMBO_CONCEPTS.md)** for Phase 2 (AI features)
- Follow **[GET_STARTED.md](./GET_STARTED.md)** for detailed guide

---

## 🎯 Current Status

### Phase 1: React-Bits Text Animations ✅ COMPLETE!

**Implemented:**
- ✅ Complete Vite + React + TypeScript setup
- ✅ Tailwind CSS configured
- ✅ SplitText component (character/word reveal)
- ✅ TextCursor component (typewriter effect)
- ✅ BlurText component (blur fade-in)
- ✅ Demo showcase with all 3 components
- ✅ Production-ready code

### Phase 2: Tambo Integration 🔄 IN PROGRESS

**Done:**
- ✅ Tambo SDK (`@tambo-ai/react` + `zod`) added
- ✅ Interactable wrappers (InteractableSplitText, InteractableTextCursor, InteractableBlurText)
- ✅ TamboProvider + generative components in `main.tsx`
- ✅ Preview uses Interactable components (AI can target `preview-split-text`, `preview-text-cursor`, `preview-blur-text`)

**To enable AI:** Set `VITE_TAMBO_API_KEY` in `.env` (get key from [tambo.co/dashboard](https://tambo.co/dashboard)). Then add a chat/thread UI (e.g. `useTamboThread`, `useTamboThreadInput`) to talk to Tambo and modify components.

---

## 📚 Documentation

### Complete Guide (Read in Order)

1. **[README.md](./README.md)** — Project overview (you are here)
2. **[IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md)** ⭐ — What's built & next steps
3. **[GET_STARTED.md](./GET_STARTED.md)** — Setup guide (already done!)
4. **[REACT_BITS_INTEGRATION.md](./REACT_BITS_INTEGRATION.md)** — Component documentation
5. **[TAMBO_CONCEPTS.md](./TAMBO_CONCEPTS.md)** — Generative & Interactable (Phase 2)
6. **[SKILLS_GUIDE.md](./SKILLS_GUIDE.md)** — AI Skills (Phase 2)
7. **[PROJECT_IMPLEMENTATION_GUIDE.md](./PROJECT_IMPLEMENTATION_GUIDE.md)** — Complete roadmap

---

## 🎨 Component Library

### Phase 1: Text Animations (Week 1)

From [React-Bits Text Animations](https://github.com/DavidHDev/react-bits/tree/main/src/content/TextAnimations):

- **SplitText** — Character/word reveal animation
- **TextCursor** — Typewriter effect with blinking cursor
- **BlurText** — Blur fade-in reveal effect

### Phase 2: Extended Animations (Week 2)

- RevealText — Slide reveal animation
- GlitchText — Glitch/distortion effect
- WaveText — Wave motion effect
- RotateText — 3D rotation effect
- ScrambleText — Random character scramble

### Phase 3: Backgrounds & Effects (Week 3)

- MeshGradient — Animated gradient background
- ParticleField — Interactive particles
- WaveBackground — Animated wave patterns
- RippleEffect — Click ripple interaction
- ShineAnimation — Hover shine overlay

---

## 🤖 Tambo AI Integration

Modify any component using natural language:

```tsx
// User clicks a component, then asks:
"Make the animation faster"
"Change text color to blue"
"Add a gradient effect"
"Animate by words instead of characters"

// Tambo SDK generates modified version instantly
```

---

## 🛠️ Tech Stack

### Core
- **React 18** + TypeScript
- **Vite** — Fast build tool
- **Tailwind CSS** — Utility-first styling

### Animations
- **Framer Motion** — Smooth React animations
- **GSAP** — Advanced animation timeline (optional)

### State & AI
- **Zustand** — Lightweight state management
- **Tambo SDK** — AI component generation & modification
- **MCP Tools** — External tool integrations (Figma, GitHub)

---

## 📖 Inspiration

This project is inspired by:
- **[React-Bits](https://github.com/DavidHDev/react-bits)** — 110+ animated React components
- **[Shadcn UI](https://ui.shadcn.com)** — Component architecture patterns
- **[Radix UI](https://www.radix-ui.com)** — Accessibility standards

---

## 🎯 Roadmap

### Week 1: Foundation
- [x] Project documentation
- [ ] Initialize Vite + React + TS
- [ ] Implement 3 React-Bits text animations
- [ ] Create demo showcase page
- [ ] Setup Zustand store

### Week 2: Interactivity
- [ ] Add interactable HOC wrapper
- [ ] Implement Inspector panel (prop editing)
- [ ] Add Toolbar (undo/redo, theme toggle)
- [ ] Integrate Tambo SDK
- [ ] Add 5 more text animations

### Week 3: Advanced Features
- [ ] MCP tool integrations (Figma, GitHub)
- [ ] Component modification with AI
- [ ] Background effects
- [ ] Export functionality
- [ ] Command palette (Cmd+K)

### Week 4: Polish
- [ ] Accessibility improvements
- [ ] Performance optimization
- [ ] Comprehensive testing
- [ ] Demo video preparation

---

## 🤝 Contributing

This is a hackathon project, but contributions are welcome!

1. Fork the repository
2. Create your feature branch
3. Follow React-Bits component patterns
4. Ensure accessibility (WCAG AA)
5. Submit a pull request

---

## 📄 License

MIT License - Free to use, modify, and distribute

---

## 🙏 Acknowledgments

- **[DavidHDev](https://github.com/DavidHDev)** for the amazing React-Bits library
- **Tambo SDK** for AI-powered features
- **React community** for incredible tools and libraries

---

## 📞 Contact

Questions? Issues? Suggestions?

Open an issue or reach out!

---

**Start building:**

```bash
cd /Users/apple/Desktop/pp/hakathon/Flex
cat GET_STARTED.md
```

**Happy coding! 🚀**
