# Tambo-Driven Composite Sections – Suggestions

Aapke architecture plan ke hisaab se codebase check kiya. Yeh document refinements, SDK alignment, aur extra tips deta hai.

---

## 1. Composite section: `silk-hero-splittext`

### 1.1 Types & defaults
- **ComponentId**: `src/types/components.ts` mein `'silk-hero-splittext'` add karna sahi hai.
- **Props merging**: `getDefaultPropsForType('silk-hero-splittext')` mein Silk + SplitText dono ke props ek hi flat object mein rahen (e.g. `speed`, `text`, `animateBy`, `className`). Collision avoid karne ke liye agar kabhi Silk-specific vs text-specific override chahiye to optional prefixes soch sakte ho (e.g. `silkSpeed` vs `splitTextClassName`), lekin abhi single bag theek hai.
- **INNER_LAYOUT_TYPES**: Composite section ke andar InteractableSplitText hai, to uske inner padding/margin ke liye `'silk-hero-splittext'` ko `INNER_LAYOUT_TYPES` mein add karna useful hai.

### 1.2 CanvasPreview
- Silk background + InteractableSplitText wala branch bilkul plan jaisa: wrapper `relative min-h-screen`, Silk full-bleed, upar `z-10` wala div with `InteractableSplitText` + `id={section.id}` taaki Interactables is section ko map karein.
- **InteractableSplitText props**: `section.props` se sirf woh keys pass karo jo `SplitTextProps` / Interactable expect karti hain (e.g. `text`, `delay`, `duration`, `animateBy`, `className`). Baaki layout/figma/silk keys wrapper/style pe lagao.

### 1.3 LayersPanel
- Naya category **"Composites"** add karke sirf `silk-hero-splittext` wahan rakhna clear hai. `sectionIcons` mein is type ke liye koi icon (e.g. `Layout` ya `Layers`) assign karna mat bhoolna.
- `CATEGORY_KEYS` aur `defaultCategoriesOpen` mein `composites` add karo.

### 1.4 InspectorPanel
- `silk-hero-splittext` ke liye inspector mein props ko do groups mein dikhana helpful hoga: **Silk** (speed, scale, color, etc.) aur **Hero text** (text, animateBy, duration, className). Existing `InspectSection` pattern reuse karke dono groups dikha sakte ho.

---

## 2. Builder tools (add / update sections)

### 2.1 Tambo SDK: tools kaise register hon

- **Static registration**: `TamboProvider` ko `tools={[...]}` pass kiya ja sakta hai (docs + `tambo-provider.d.ts`).
- **Dynamic registration**: `useTamboRegistry()` se `registerTool` / `registerTools` milte hain. Plan wala approach (builder mount hote hi tools register karna, ref se actions lena) dono tarah se kaam karega:
  - **Option A**: Saare builder tools **ref-based** bana ke `TamboProvider` ko `tools={createBuilderTools(builderActionsRef)}` pass karo. Ref `Layout` (ya App) mein create ho, aur `WebsiteBuilderPage` ke andar ek bridge is ref ko set kare.
  - **Option B**: Layout ke andar ek component `useTamboRegistry().registerTools(createBuilderTools(ref))` useEffect mein call kare; ref context se aaye.  
Dono mein tools **har waqt** registered rehenge; implementation andar `if (!ref.current) return "Builder is not open."` kare.

### 2.2 Tool shape: `defineTool` use karo

Plan mein `defineTool` from `@tambo-ai/react` likha hai – SDK mein yeh maujood hai (`import { defineTool } from "@tambo-ai/react"`). Tambo docs ke mutabiq:

```ts
import { defineTool } from "@tambo-ai/react";
import { z } from "zod";
```

- **add_builder_section**: `inputSchema` mein `type: z.enum([...ComponentId values...])` ya detailed description mein saare allowed types likh do, especially `silk-hero-splittext` ("silk background with hero text and split text animation").
- **update_builder_section**: `sectionId: z.string()`, `props: z.record(z.unknown())` jaise schema theek rahenge.
- **Return type**: Dono tools string return karein (success/error message); `outputSchema: z.string()`.

### 2.3 Builder actions ref + `addSection` return value

- **Ref type**:  
  `{ addSection: (type: ComponentId) => string | void; dispatch: React.Dispatch<PageAction>; getSection?: (id: string) => PageSection | undefined } | null`  
  Optional: `getLastSectionId?: () => string | null` agar aap state expose nahi karna chahte.

- **Recommendation**: `addSection` ko **new section id return karna** hi rakhna (plan bhi yahi kehta hai). Implementation:
  - `BuilderContext` mein `addSection` id generate kare, `dispatch(ADD_SECTION, ...)` kare, aur **return id** kare.
  - Tool: `const id = ref.current.addSection(type);` phir agar `props` diye gaye hon to `ref.current.dispatch({ type: 'UPDATE_PROPS', id, props })`.

### 2.4 Ref kahan create ho, kahan set ho

- **Create**: Layout (ya App) mein `const builderActionsRef = useRef<BuilderActions | null>(null)`.
- **Provide**: Ek chota `BuilderActionsRefContext` bana ke is ref ko provide karo (value: `{ builderActionsRef }`). Provider Layout ke andar, `Outlet` ke upar.
- **Set**: `WebsiteBuilderPage` ke andar, **BuilderProvider ke children** mein ek component (e.g. `BuilderTamboBridge`) mount karo jo `useBuilder()` use kare aur `useEffect` mein `builderActionsRef.current = { addSection, dispatch, getSection }; return () => { builderActionsRef.current = null; };`.
- **Register**: Layout ke andar ek component (e.g. `BuilderTamboToolRegistration`) jo `useContext(BuilderActionsRefContext)` se ref le aur `useTamboRegistry().registerTools(createBuilderTools(ref))` useEffect mein run kare. Tools globally registered rahenge; jab builder page pe nahi ho to ref null hoga aur tools no-op message return karenge.

---

## 3. Custom chat on Website Builder

### 3.1 Chat UI
- **Hooks**: `useTamboThread()`, `useTamboThreadInput()` – plan sahi hai; existing `TamboModePanel` jaisa pattern follow karo.
- **Messages**: `message.content` ko array maan ke `contentPart.type === 'text'` pe `contentPart.text` render karna (Build a Custom Chat Interface ke mutabiq). Tool calls agar dikhane hon to `message.toolCallRequest` / tool result bhi render kar sakte ho.

### 3.2 Placement
- Right panel mein **Inspector + AI Chat** tabs (Inspector | AI Chat) – recommendation theek hai; canvas beech mein rahega, chat inspector ke saath visible.

### 3.3 Context for builder
- `useTamboContextAttachment()` se ek attachment attach karo jisme likha ho:  
  "Editing the website builder canvas. Use add_builder_section to add sections (e.g. silk-hero-splittext for silk background with hero split text animation). Use update_builder_section to change section props. Interactables are used to edit existing components."
- Yeh builder chat mount hote hi (ya builder page pe focus) set karo, taaki Tambo ko builder tools ka pata rahe.

### 3.4 Thread scope (builder vs playground)
- Abhi single thread list bhi chal sakta hai. Baad mein agar builder conversations alag rakhni hon to **contextKey** change karna padega. TamboProvider level pe `contextKey` hai; builder route ke liye alag threads ke liye nested provider ya route-based `contextKey` (agar SDK support kare) dekhna padega. Pehle phase mein same thread list se start karna simple hai.

### 3.5 Suggestions
- `useTamboSuggestions()` optional hai; agar use karo to last assistant message ke baad suggestion buttons dikha kar `accept(suggestion)` ya `accept(suggestion, true)` call karna docs ke hisaab se theek hai.

---

## 4. Interactables

- **InteractableSplitText**: Composite section ke andar `id={section.id}` pass karna zaroori hai taaki "change the hero text to X" jaisi request isi section ki SplitText ko update kare.
- Silk background ko abhi non-interactable rakhna theek hai; baad mein agar chahiye to InteractableSilk add kar sakte ho.

---

## 5. Production / behaviour

- **Tool descriptions**: Dono tools ki description mein explicitly likh do ki "Adds a new section to the canvas" / "Updates an existing section's props", aur allowed section types list karo (including `silk-hero-splittext` for silk hero + split text).
- **Idempotency**: `add_builder_section` ko description mein clear karo ki yeh **naya section add karta hai** (har call pe naya section); update nahi.
- **Errors**: `ref.current === null` pe "The website builder is not open. Open the builder to add or update sections." jaisa message return karo; invalid `sectionId` pe "Section not found" jaisa message.
- **Agent instructions**: Tambo project dashboard par instructions add karo ki website builder pe "add a hero with silk and split text" jaisi request pe `add_builder_section` with type `silk-hero-splittext` use kare.

---

## 6. File summary (implementation order)

| Step | Area | File / action |
|------|------|----------------|
| 1 | Types | `src/types/components.ts` – add `'silk-hero-splittext'` to ComponentId |
| 2 | Builder state | `src/contexts/BuilderContext.tsx` – COMPONENT_LABELS, getDefaultPropsForType, INNER_LAYOUT_TYPES; make addSection return id |
| 3 | Canvas | `src/components/builder/CanvasPreview.tsx` – branch for silk-hero-splittext (Silk + InteractableSplitText) |
| 4 | Layers | `src/components/builder/LayersPanel.tsx` – Composites category, sectionIcons |
| 5 | Ref + bridge | New: BuilderActionsRefContext; Layout provide ref; WebsiteBuilderPage mein BuilderTamboBridge set ref from useBuilder() |
| 6 | Tools | New: `src/lib/builder-tambo-tools.ts` – createBuilderTools(ref), defineTool for add_builder_section, update_builder_section |
| 7 | Registration | Layout: BuilderTamboToolRegistration – useTamboRegistry().registerTools(createBuilderTools(ref)) |
| 8 | Chat UI | New: BuilderTamboChat – useTamboThread, useTamboThreadInput, messages + input; useTamboContextAttachment for builder context |
| 9 | Layout | Right panel: Inspector + AI Chat tabs; BuilderTamboChat in AI Chat tab |
| 10 | Inspector | InspectorPanel – optional: silk-hero-splittext ke liye Silk vs Hero text prop groups |

---

## 7. Quick checklist

- [ ] ComponentId + COMPONENT_LABELS + getDefaultPropsForType + INNER_LAYOUT_TYPES for `silk-hero-splittext`
- [ ] addSection returns new section id
- [ ] CanvasPreview renders Silk + InteractableSplitText for silk-hero-splittext with section.id
- [ ] LayersPanel: Composites category + sectionIcons
- [ ] BuilderActionsRefContext + ref set in builder, createBuilderTools(ref), registerTools in Layout
- [ ] add_builder_section / update_builder_section with clear descriptions and allowed types
- [ ] Builder chat panel (tabs with Inspector), context attachment, optional suggestions
- [ ] Dashboard agent instructions for builder behaviour

Yeh suggestions aapke existing plan ke saath align karke implementation ko SDK-accurate aur maintainable banate hain. Agar kisi step ka code-level example chahiye (e.g. createBuilderTools ya BuilderTamboBridge) to batao, us hisaab se snippet de sakta hoon.
