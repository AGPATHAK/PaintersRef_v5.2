# Milestones

Suggested GitHub milestones for practical solo development.

## M1 Current App Stabilization

### Scope

Protect the current deterministic app and reduce regression risk.

### Included Roadmap Items

- Phase 1 cleanup.
- Bug fixes from real painting use.
- Manual regression checklist.
- Export sheet verification.
- Service worker/deployment checklist.

### Risks

- Refactoring may accidentally change visual output.
- Export behavior may regress without image-based checks.
- App state changes may affect composition crop selection.

### Completion Definition

- Existing Core Lab features work as before.
- Major views and export sheets are checked against a test checklist.
- Known P0/P1 bugs are closed or explicitly deferred.
- No AI code has been added yet.

## M2 Workflow UX Upgrade

### Scope

Improve daily studio usability without changing product scope.

### Included Roadmap Items

- Compare mode design.
- Presets for common settings.
- Reset-current-stage action.
- Export preview exploration.
- Sidebar polish from actual use.

### Risks

- UI may become denser.
- Compare mode can create state complexity.
- Presets may duplicate existing controls if not designed carefully.

### Completion Definition

- Workflow improvements reduce clicks or confusion.
- Deterministic outputs remain visible first.
- UI remains compact and painter-facing.

## M3 Compare & Session Features

### Scope

Add the foundation needed for variant comparison before AI Studio.

### Included Roadmap Items

- Compare gallery.
- Selected view/variant state.
- Session-local settings persistence.
- Export selected comparison view if useful.

### Risks

- Variant/session state may overlap with composition selection state.
- Storing image data locally may be too heavy.
- Export expectations may expand beyond simple sheets.

### Completion Definition

- User can compare original/current/selected views without losing workflow stage.
- Session behavior is predictable and documented.
- No cloud sync is introduced.

## M4 AI Studio Beta

### Scope

Add the first bounded AI features behind an optional AI Studio panel.

### Included Roadmap Items

- AI Studio placeholder panel.
- `aiService.js` or equivalent API wrapper.
- AI Simplify.
- AI Composition Variants, maximum 3.
- AI Painting Plan text suggestions.
- Graceful API error handling.
- Compare generated variants.

### Risks

- API latency may feel confusing.
- Prompt drift may produce non-useful variants.
- Costs can grow if generation is too easy to repeat.
- Privacy expectations must be clear.

### Completion Definition

- AI Studio is opt-in and clearly separated.
- Core Lab works without API configuration.
- AI failures are recoverable.
- Results can be compared, selected, or discarded.
- MVP scope exclusions remain excluded.

## M5 Public Release Candidate

### Scope

Prepare a stable public-facing version.

### Included Roadmap Items

- Onboarding and documentation.
- Performance polish.
- Accessibility pass.
- Landing page or project page.
- Known limitations.
- Release/deploy checklist.

### Risks

- Documentation may drift from the app.
- Large-image performance may vary by device.
- AI expectations may need clearer public wording.

### Completion Definition

- App is usable by a new painter without guided explanation.
- Docs match live behavior.
- PWA install/offline behavior is checked.
- Known limitations are documented.

