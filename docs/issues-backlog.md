# Issues Backlog

Prioritized issue backlog based on the current repository state.

| Priority | Type | Title | Size | Depends On | Acceptance Criteria |
|---|---|---|---|---|---|
| P0 critical | bug | Fix any image-load or export-breaking regression immediately | S/M | As discovered | Loading and exporting remain functional before any release. |
| P1 high | refactor | Split deterministic processing helpers from `app.js` | L | None | Grayscale, notan, masks, temperature, outline, squint, palette, and crop helpers move into modules with no behavior change. |
| P1 high | refactor | Separate render routing from UI event handlers | M | Split deterministic processing helpers | Event handlers update state and call clear render/update functions; current views still render correctly. |
| P1 high | refactor | Define central app state shape | M | None | State fields are documented in code or docs; derived canvases and UI selections have clear ownership. |
| P1 high | bug | Create manual regression checklist for all view modes | S | None | Checklist covers image load, grid, focal study, squint, outline, mirror, grayscale, notan, masks, temperature, palette, and exports. |
| P1 high | bug | Add export sheet regression test assets or fixtures | M | Manual regression checklist | At least one repeatable sample image and expected export checklist exists. |
| P1 high | ux | Verify composition crop selection across later stages | S | None | Selecting each of four crops correctly feeds observation, drawing, painting, and export flows. |
| P1 high | infra | Document service worker cache bump process | S | None | Deployment notes explain when and how to bump cache version. |
| P1 high | refactor | Isolate composite export sheet builder | M | Split deterministic processing helpers | Export sheet layout and download code are testable without touching app event logic. |
| P1 high | bug | Review large-image performance and canvas limits | M | Regression checklist | Large images are resized predictably and do not freeze typical desktop browsers. |
| P2 medium | feature | Add compare gallery mode | L | Render routing cleanup | User can compare original, current view, and selected study in one panel. |
| P2 medium | feature | Add selected-view history state | M | Central app state shape | User can keep a small session-local list of selected studies without reloading. |
| P2 medium | ux | Add reset-current-stage action | M | Central app state shape | Active stage can return to sensible defaults without resetting the loaded image. |
| P2 medium | feature | Add preset settings for common workflows | M | Reset-current-stage action | Presets apply grouped settings for drawing, notan, and temperature without hiding manual controls. |
| P2 medium | ux | Add export preview before download | L | Isolate composite export sheet builder | User can preview Sheet 1/2/3 before saving. |
| P2 medium | feature | Add palette notes export sheet decision spike | S | Export preview | Decide whether palette notes become Sheet 4 or remain screen-only. |
| P2 medium | ux | Refine squint labels and slider behavior | M | Regression checklist | Squint control language remains painter-facing and effect changes are predictable. |
| P2 medium | refactor | Rename technical outline settings toward `Simplify` model | M | Outline regression checks | Painter-facing control can replace sensitivity/smoothing or sit above them without output regression. |
| P2 medium | bug | Fix mobile and small-screen overflow edge cases | M | CSS audit | Sidebar, canvas, and export views remain usable on narrower screens. |
| P2 medium | docs | Keep README aligned with current live features | S | None | README feature list and workflow match the app. |
| P2 medium | infra | Add lightweight lint/syntax check script | S | None | A documented command checks JavaScript syntax and obvious file issues. |
| P2 medium | ux | Add first-run or empty-state guidance | M | UI polish pass | New user understands load-image and staged workflow without reading docs. |
| P2 medium | refactor | Move theme handling into small utility | S | Central app state shape | Dark mode still persists and updates theme-color meta. |
| P2 medium | feature | Add AI Studio placeholder panel | S | UX rules agreed | Panel exists but no API calls are made; Core Lab remains first. |
| P2 medium | refactor | Add `aiService.js` wrapper scaffold | M | AI Studio placeholder panel | Service boundary exists with stubbed success/error paths and no production AI calls. |
| P2 medium | feature | Add generated variant state model | M | Compare gallery mode | App can store local variant metadata and selected variant id. |
| P2 medium | feature | Add graceful API unavailable state | M | `aiService.js` scaffold | UI shows clear error/retry state without affecting Core Lab. |
| P3 low | feature | Add AI Simplify MVP | L | AI service, compare gallery, API unavailable state | User can request one simplified reference and compare it with original. |
| P3 low | feature | Add AI Composition Variants MVP | L | AI Simplify MVP | User can request up to 3 variants and select or discard them. |
| P3 low | feature | Add AI Painting Plan text analysis | M | AI service scaffold | User receives concise painter-facing suggestions, not a chat interface. |
| P3 low | docs | Add privacy note for AI Studio | S | AI Studio placeholder panel | UI/docs clearly state when images may leave the browser. |
| P3 low | infra | Add API cost guardrails | M | AI feature implementation | AI actions are explicit and generation count/cost warnings are documented or visible. |
| P3 low | ux | Add loading/cancel/retry states for AI tasks | M | AI service scaffold | User sees progress and can recover from failed or slow requests. |
| P3 low | docs | Add known limitations page | S | Public release work | Limitations are documented for deterministic and AI-assisted features. |
| P3 low | ux | Add accessibility pass for controls and canvas state | M | Major UI changes settled | Keyboard focus, labels, and status text are reviewed and adjusted. |
| P3 low | infra | Add release checklist for GitHub Pages | S | Service worker cache docs | Checklist covers cache bump, smoke test, docs, and PWA install. |
