---
name: Tools menu and Website Builder
overview: Add proper client-side routing (React Router) with separate routes for the component playground and the Website Builder tool, add a "Tools" menu in the sidebar, and implement the Website Builder with export-as-project (zip).
todos: []
isProject: false
---

# Tools Menu + Website Builder with Proper Routing

## 1. Routing setup (ek hi index par sab render nahi)

- **Add `react-router-dom**` to [package.json](package.json).
- **Route structure** (dhaag se alag pages):
  - `**/**` – Component playground (current view: Sidebar + MainContent + CustomizePanel). Ye default/home route.
  - `**/tools/website-builder**` – Website Builder tool (left panel + preview + export). Alag route, alag UI.
- **Layout vs routes**:
  - [src/main.tsx](src/main.tsx): Wrap app in `<BrowserRouter>`, render `<Routes>` with `<Route path="/" element={<App />} />` and `<Route path="/tools/website-builder" element={<WebsiteBuilderPage />} />`, **ya** App ke andar hi `<Routes>` + `<Outlet />` use karein.
  - **Recommended**: `main.tsx` me `<BrowserRouter><App /></BrowserRouter>`. `App.tsx` me:
    - **Shared shell** (TopBar + Sidebar) sab routes par dikhe.
    - **Content area** = `<Routes>` + `<Outlet />`:
      - `path="/"` → layout route with `<Outlet />`; nested route index → Component playground (MainContent + CustomizePanel).
      - `path="tools/website-builder"` → layout route same shell; nested → Website Builder full view.
      Simpler alternative (minimal change):
  - `**/**` → Component playground page (Sidebar + MainContent + CustomizePanel).
  - `**/tools/website-builder**` → Website Builder page (optional: same TopBar + Sidebar, center = Builder; ya Builder ka apna layout).
  - `App.tsx` me `<Routes><Route path="/" element={<ComponentPlaygroundPage />} /><Route path="/tools/website-builder" element={<WebsiteBuilderPage />} /></Routes>`. TopBar + Sidebar dono pages par chahiye to unhe `ComponentPlaygroundPage` aur `WebsiteBuilderPage` dono me include karein, **ya** ek parent layout route bana ke `<Outlet />` me child render karein.
- **Concrete structure** (recommended):

```mermaid
flowchart TB
  main[main.tsx BrowserRouter]
  main --> App[App.tsx]
  App --> Routes[Routes]
  Routes --> LayoutRoute[Route path="/" element=Layout]
  LayoutRoute --> Layout[Layout: TopBar + Sidebar + Outlet]
  Layout --> IndexRoute[Route index element=PlaygroundPage]
  Layout --> ToolRoute[Route path="tools/website-builder" element=WebsiteBuilderPage]
  IndexRoute --> PlaygroundPage[Component playground]
  ToolRoute --> WebsiteBuilderPage[Website Builder UI]
```



- **Files**:
  - [src/App.tsx](src/App.tsx): `<Routes>`, layout route with `<Outlet />`, nested routes for `/` (playground) and `/tools/website-builder` (builder).
  - New `src/pages/Layout.tsx` (optional): TopBar + Sidebar + `<Outlet />` so dono pages same chrome share karein.
  - New `src/pages/ComponentPlaygroundPage.tsx`: Current playground content (Sidebar already in layout, so isme sirf MainContent + CustomizePanel **ya** agar Sidebar layout me hai to isme sirf main + customize panel).
  - New `src/pages/WebsiteBuilderPage.tsx`: Website Builder tool (left panel + preview + export). Is route par Sidebar me "Website Builder" highlighted ho.
- **Sidebar navigation**:
  - "Text Animations", "Backgrounds", "Sections" items **current behaviour**: click → update component state (playground). Ye tab hi work kare jab route `/` ho (ya `/` par koi component selected ho).
  - **Tools → Website Builder**: `<Link to="/tools/website-builder">` **ya** `useNavigate()` – click par route change to `/tools/website-builder`, koi single-page state toggle nahi.
  - Back to components: Sidebar me koi bi component (e.g. "Split Text") par click → `<Link to="/">` **ya** `navigate('/')` so that playground route par wapas jayein.

---

## 2. Tools menu in Sidebar

- [src/components/layout/Sidebar.tsx](src/components/layout/Sidebar.tsx): Add section **"Tools"** (same style as "Get Started", "Text Animations", …).
  - One item: **Website Builder** with icon (e.g. layout/grid).
  - Use `**<Link to="/tools/website-builder">**` from `react-router-dom` (or `useNavigate` + button). Highlight when `**location.pathname === '/tools/website-builder'**` (e.g. active class / left border).
  - Get Started / Text Animations / etc. links ko bhi `**<Link to="/">**` de sakte ho (optional), taaki direct "/" par jayein; component selection abhi bhi state se ho sakta hai on "/".

---

## 3. Website Builder tool (same as before, route par)

- **Route**: Only rendered when **path = `/tools/website-builder**` (no single-page toggle).
- **Layout**: Left panel (add section + page structure), center (live preview), "Export as project" (zip).
- **State**: Builder sections array (e.g. `{ id, type }[]`) – either in a **context** (e.g. `WebsiteBuilderProvider`) **ya** local state in `WebsiteBuilderPage` so it doesn’t live on the index route.
- **New components**: `Header.tsx` (minimal), `WebsiteBuilder/WebsiteBuilder.tsx`, `PagePreview`, export util with JSZip, etc. – same as previous plan, but mounted only on `/tools/website-builder`.

---

## 4. Export as project (unchanged)

- "Export as project" → zip with Vite + React project (package.json, vite.config, index.html, src/main.tsx, App.tsx, sections code) – JSZip, download. No change in behaviour; only triggered from the builder route.

---

## 5. File summary (routing + tools)


| Action          | Path                                                                                                                                                                  |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Add dep         | `react-router-dom` in package.json                                                                                                                                    |
| Wrap app        | [src/main.tsx](src/main.tsx): `<BrowserRouter>` around app                                                                                                            |
| Routes + layout | [src/App.tsx](src/App.tsx): `<Routes>`, layout route with TopBar + Sidebar + `<Outlet />`, nested `index` = playground, `tools/website-builder` = builder page        |
| New page        | `src/pages/ComponentPlaygroundPage.tsx` – current MainContent + CustomizePanel (and component state)                                                                  |
| New page        | `src/pages/WebsiteBuilderPage.tsx` – Website Builder UI                                                                                                               |
| Optional layout | `src/pages/Layout.tsx` – TopBar + Sidebar + `<Outlet />` (or inline in App)                                                                                           |
| Update Sidebar  | [src/components/layout/Sidebar.tsx](src/components/layout/Sidebar.tsx): Tools section, `<Link to="/tools/website-builder">`, active state by `useLocation().pathname` |
| Command palette | Open "Website Builder" → `navigate('/tools/website-builder')`                                                                                                         |


---

## 6. Order of work

1. Add `react-router-dom`; in main.tsx wrap with BrowserRouter; in App.tsx add Routes + layout route (TopBar + Sidebar + Outlet) + nested route "/" → ComponentPlaygroundPage, "/tools/website-builder" → WebsiteBuilderPage. Move current main content into ComponentPlaygroundPage so "/" par behaviour same rahe.
2. Sidebar: add Tools section, Link to `/tools/website-builder`, highlight by pathname.
3. Implement WebsiteBuilderPage + builder UI (add section, page structure, preview, export).
4. Export util (JSZip) and Command Palette link to builder route.

Isse **routing sahi se** hogi: index page sirf component playground hoga, Website Builder alag URL par.