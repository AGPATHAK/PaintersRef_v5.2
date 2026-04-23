# Current State Audit

## Current Features Implemented

Inventory based on the current repository:

- Local JPG/PNG image loading through a file input.
- Canvas-based image fitting with preserved aspect ratio.
- Workflow sidebar with staged sections:
  - Baseline
  - Composition
  - Observation
  - Drawing
  - Painting
  - Exports
- Baseline grid overlay with adjustable rows and columns.
- Composition focal study:
  - click-to-place focal point
  - four rule-of-thirds crop studies
  - crop-size slider
  - click-to-select composition crop as the working reference
  - clear selection back to original
- Observation squint view based on grayscale value-mass simplification.
- Drawing views:
  - outline sketch / edge detection
  - mirror check based on the generated outline
  - outline presets and sliders
- Painting views:
  - grayscale
  - 3-value notan / posterization
  - light mask
  - midtone mask
  - shadow mask
  - warm/cool/neutral temperature study
  - palette notes with sampled colors and watercolor-friendly mix suggestions
- Exports:
  - current canvas view as JPEG
  - Sheet 1: original, grayscale, notan, outline
  - Sheet 2: original, light mask, midtone mask, shadow mask
  - Sheet 3: original, warm mask, cool mask, neutral mask
- Light/dark theme toggle stored in `localStorage`.
- PWA support through manifest and service worker caching.
- GitHub Pages compatible static app structure.

## Architecture Snapshot

### File Structure

```text
/
  index.html
  styles.css
  app.js
  manifest.webmanifest
  service-worker.js
  README.md
  icons/icon.svg
  docs/
```

### Major JavaScript Responsibilities

`app.js` currently owns almost all runtime behavior:

- image file validation and loading
- canvas sizing and drawing utilities
- grayscale conversion
- notan / posterization
- tonal mask generation
- hue/temperature mask generation
- palette extraction and watercolor mix-note analysis
- outline sketch generation
- squint generation
- mirror generation
- grid overlay drawing
- composition crop generation and selection
- composite sheet creation
- app state
- DOM references
- event binding
- stage/view selection
- render routing
- export handling
- service worker registration

The main app class is `PaintersReferenceApp`. Most processing helpers are plain functions in the same file.

### CSS/UI Structure

`styles.css` contains:

- theme tokens for light and dark mode
- shell layout and responsive desktop-oriented grid
- sidebar cards and workflow stage accordions
- segmented view-mode buttons
- form controls and custom sliders
- canvas matte frame
- export/action button styling
- palette, info, and placeholder styling
- responsive adjustments

The UI is staged and painter-facing, but CSS is still in one file.

### PWA Assets

- `manifest.webmanifest` defines install metadata and the SVG icon.
- `service-worker.js` caches the app shell and serves cached assets offline.
- `icons/icon.svg` is the app icon.
- Cache version is manually bumped when deploy-relevant assets change.

## Strengths

- Strong painter-first workflow: composition, observation, drawing, painting, exports.
- Fast local deterministic processing with no server dependency.
- Useful and differentiated feature set for real painting preparation.
- Good restraint: the app avoids becoming a general photo editor.
- Composition crop workflow is now meaningful because selected crops feed later stages.
- Squint, outline, notan, masks, and temperature studies support different painting decisions rather than duplicating one another.
- Export sheets make the app useful outside the browser.
- Dark mode and compact sidebar improve real studio use.
- PWA support makes the tool installable and offline-friendly.
- Existing documentation clearly protects the product identity.

## Technical Risks

- `app.js` is monolithic at roughly 2,800 lines, combining processing, state, DOM events, rendering, and exports.
- Render logic is coupled to app state and DOM updates, making regression risk higher as features grow.
- Processed canvases are rebuilt in several places; cache invalidation rules may become harder to reason about.
- Composition selection, focal-study layout, view routing, and working-reference state are tightly coupled.
- Export sheet logic depends directly on current in-memory canvas state.
- No automated regression tests exist for image-processing outputs or export sheets.
- No module boundaries exist yet for deterministic processors.
- AI integration would add latency, async errors, privacy messaging, and variant history to an already dense app class.
- Service worker cache versioning is manual and can be forgotten during documentation or asset changes.
- Palette-note logic is heuristic and may need careful labeling to avoid over-promising.

## Recommended Next Moves

Top 5 only:

1. Split deterministic image-processing helpers from `app.js` into small modules without changing behavior.
2. Add a central state/update boundary so UI events, derived canvases, and rendering have clearer responsibilities.
3. Create a lightweight regression checklist or test harness for core render modes and export sheets.
4. Add compare-gallery groundwork for original/current/variant views before adding AI.
5. Add an `AI Studio` placeholder only after the Core Lab structure is easier to maintain.

