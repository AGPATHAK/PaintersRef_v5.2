# Product Roadmap 2026

This roadmap assumes a solo developer workflow using Codex and GitHub. It favors maintainability, visible usefulness, and controlled AI growth.

## Phase 1 - Stabilize & Prepare

### Purpose

Make the current deterministic app easier to maintain before adding larger UX or AI features.

### Estimated Effort

M

### Dependencies

- Current app remains behaviorally stable.
- Existing visual workflow stays intact.
- No AI implementation during this phase.

### Work Items

- Split deterministic processors into modules.
- Separate render routing from UI event handlers.
- Clarify app state and derived canvas lifecycle.
- Add a manual regression checklist for major view modes.
- Add lightweight export sheet verification.
- Fix known visual and overflow bugs from real use.
- Keep service worker cache versioning explicit.

### Success Criteria

- Core views still match current behavior.
- `app.js` is smaller and easier to navigate.
- Rendering and export behavior can be checked predictably after changes.
- No regression in PWA install/offline behavior.

## Phase 2 - UX Power Features

### Purpose

Improve the app as a serious studio tool without adding feature bloat.

### Estimated Effort

M/L

### Dependencies

- Phase 1 cleanup completed enough to reduce change risk.
- Stable state model for current image, selected composition, and processed canvases.

### Work Items

- Compare mode for original/current/selected study.
- Presets for common painter workflows.
- Saved session state for current image settings where feasible.
- Better export preview or print preview.
- More polished empty/loading/error states.
- Optional reset-current-stage action.
- Sidebar density and helper-text refinement from real use.

### Success Criteria

- Painter can compare studies without losing context.
- Common setup choices take fewer clicks.
- Exports are easier to judge before download.
- UI remains compact and calm.

## Phase 3 - AI Studio Layer

### Purpose

Add a bounded optional AI layer for reference preparation, not finished art generation.

### Estimated Effort

L

### Dependencies

- Compare mode or compare-gallery foundation.
- Clear API/privacy strategy.
- `aiService.js` wrapper or equivalent service boundary.
- Graceful unavailable/error states.

### Work Items

- AI Simplify.
- AI Composition Variants, maximum 3 per request.
- AI Painting Plan text suggestions.
- Compare generated variants against original and deterministic views.
- Session-local generated variant history.
- Explicit opt-in cloud/API messaging.

### Success Criteria

- Core Lab remains fully usable without AI.
- AI actions are user-initiated and bounded.
- AI results appear in comparison context.
- Failed AI requests do not break deterministic workflow.
- The feature feels like painter preparation, not an art generator.

## Phase 4 - Release Readiness

### Purpose

Prepare the app for broader use while keeping support burden realistic.

### Estimated Effort

M

### Dependencies

- Stable Core Lab.
- Stable compare/session experience.
- AI Studio Beta decisions documented.

### Work Items

- Onboarding tips or first-run guidance.
- Documentation refresh.
- Landing page or concise project page.
- Performance polish on large images.
- Accessibility pass for controls and canvas status.
- Deployment checklist for GitHub Pages/PWA.
- Known limitations page.

### Success Criteria

- New users can understand the workflow without explanation.
- Documentation matches the live app.
- Performance is acceptable on typical desktop images.
- Release candidate has a clear known-issues list.

