# Flex – Hackathon Project Video Guide

**Video length:** Not more than **3 minutes**  
Use this guide to plan and record your hackathon submission video so it clearly covers the expected points.

---

## 1. About the Project (~45–60 sec)

**What to say:**

- **One-liner:** “Flex is an AI-powered design system playground where you can build and customize website sections, then export a ready-to-use React project.”
- **Problem:** Designers and developers spend time wiring components, copying code, and keeping design systems in sync. Building landing pages or prototypes is repetitive.
- **Solution:** Flex gives you:
  - **Component playground** – Try text animations (SplitText, BlurText, TextCursor), backgrounds (Silk, FloatingLines, LightPillar), and sections (Aurora Hero, FAQ, Smooth Scroll Hero) with live prop controls and code view.
  - **Website builder** – Drag-and-drop style workflow: add sections from the layers panel, edit props in the inspector, see the canvas update in real time.
  - **AI with Tambo** – In the builder, use natural language to add sections (e.g. “add a silk hero with split text”) or edit existing ones; Tambo calls tools to update the canvas.
  - **Export** – Export the current canvas as a starter Vite + React + Tailwind project (e.g. a `.zip`) so you can keep building in your own repo.

**Optional:** Mention inspiration from **React-Bits** and that Flex adds a builder, AI, and export on top of that component set.

---

## 2. Tech Stack and Architecture (~45–60 sec)

**What to show or describe:**

- **Frontend:** React 18, TypeScript, Vite 5, Tailwind CSS.
- **UI/UX:** Radix UI primitives, Framer Motion (and/or GSAP where used) for animations, resizable panels for the builder layout.
- **AI:** Tambo SDK (`@tambo-ai/react`) – tools (e.g. `add_builder_section`, `update_builder_section`, template/custom website tools), Interactable components for natural-language edits, optional context attachments for the builder.
- **Export:** JSZip (or similar) to bundle the generated project; export produces a minimal Vite + React + Tailwind starter.
- **State:** React context for builder state (sections, selection, device/zoom); ref-based bridge so Tambo tools can mutate builder state only when the builder page is open.

**Architecture in one sentence:**  
“A React SPA with a component playground and a page builder; the builder state is the source of truth, and Tambo tools + Interactables sit on top to add or edit sections via chat.”

**Optional:** Show a simple diagram or slide: **User → Builder Chat → Tambo → Builder Tools → Builder Context → Canvas.**

---

## 3. Demo (if possible) (~60–75 sec)

**Suggested flow (keep it tight):**

1. **Playground (15–20 sec)**  
   - Open the component playground (`/`).  
   - Switch between one or two components (e.g. SplitText, Aurora Hero).  
   - Show the Customize panel and maybe the Code tab so judges see “live props + code.”

2. **Website builder (25–35 sec)**  
   - Go to Website Builder (`/tools/website-builder`).  
   - Add 2–3 sections from the left panel (e.g. Silk Hero + Split Text, FAQ, or a template).  
   - Select a section and change a prop in the Inspector; show the canvas updating.  
   - Open the **AI Chat** (or Tambo panel) and say something like:  
     - “Add a silk hero with split text,” or  
     - “Change the hero text to ‘Welcome to our hackathon project’.”  
   - Show the new section or updated text on the canvas.

3. **Export (10–15 sec)**  
   - Use the export action (e.g. “Export website” or similar).  
   - Briefly show that a `.zip` (or download) is generated and that it contains a runnable Vite + React project (e.g. open the folder or run `pnpm install && pnpm dev` in one shot if time allows).

**Tip:** Pre-open the app and resize the window so the builder + chat are visible; avoid long loading or tab switches to stay under 3 minutes.

---

## 4. Learning and Growth (optional) (~20–30 sec)

**Ideas you can mention (pick 1–2):**

- **Tambo integration:** Learning how to expose builder state to AI via tools and refs so tools only run when the builder is active; designing tool descriptions so the model picks the right section types (e.g. `silk-hero-splittext` vs separate sections).
- **Composite sections:** Combining background + text animation into one section type (e.g. Silk + SplitText) so one AI command adds a full “hero” instead of two separate blocks.
- **Export pipeline:** Deciding what to include in the exported project (entry file, Tailwind config, component tree) so the zip is minimal but runnable.
- **State and refs:** Using a ref for “builder actions” so the same Tambo tools can be registered globally but only affect the canvas when the user is on the builder page.

Keep this short so most of the video is **About + Tech + Demo**.

---

## Timing Cheat Sheet (total ≤ 3:00)

| Section              | Suggested time |
|----------------------|----------------|
| About the project    | 0:45–1:00      |
| Tech stack & architecture | 0:45–1:00 |
| Demo                 | 1:00–1:15      |
| Learning & growth    | 0:20–0:30 (optional) |

---

## Checklist Before Submitting

- [ ] Video is **under 3 minutes**.
- [ ] **About:** Project name, problem, and what Flex does (playground, builder, AI, export) are clear.
- [ ] **Tech:** Stack (React, TypeScript, Vite, Tailwind, Tambo) and high-level architecture (builder state + tools + canvas) are mentioned or shown.
- [ ] **Demo:** At least one of: playground with props/code, builder with add/edit, AI command that changes the canvas, or export to zip.
- [ ] (Optional) **Learning:** One or two concrete learnings or design decisions.

Good luck with your hackathon submission.
