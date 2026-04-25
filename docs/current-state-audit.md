# Current State Audit

## Version Checkpoint

- Stable working prototype: **V5.2**
- Product type: browser-based deterministic painting-reference tool
- Current posture: stable working app first, refactor later

## Current Working Product

Painter's Reference Lab V5.2 is a working local-first reference-preparation tool for painters. It currently supports the full workflow from loading an image through simplified studies and exportable reference sheets.

The app is currently being treated as a stable prototype rather than an active refactor target. Workflow clarity and real-use testing now matter more than architectural cleanup.

## Major Implemented Features

- JPG/PNG image loading
- Aspect-ratio-preserving image fit to canvas
- Grid overlay with adjustable rows and columns
- Grayscale study
- 3-value Notan
- Tonal masks:
  - Light Mask
  - Midtone Mask
  - Shadow Mask
- Rough outline sketch with bounded presets:
  - Low Detail
  - Medium Detail
  - High Detail
- Current-view export
- Composite preview/export workflow with 3 prepared sheets
- Light/dark theme toggle
- PWA-compatible static app structure

## 3-Sheet Workflow

The app now includes a preview workflow with three prepared sheets under **Previews**.

### Sheet 1 - Value & Drawing

- Original
- Grayscale
- 3-Value Notan
- Outline with grid

Notes:

- Grid is included only on the outline panel in Sheet 1 export.
- This is the main value/drawing study sheet.

### Sheet 2 - Tonal Masks

- Original
- Light Mask
- Midtone Mask
- Shadow Mask

Notes:

- This sheet is intended for value grouping and mass interpretation.

### Sheet 3 - Temperature Map

- Original
- Warm Mask
- Cool Mask
- Neutral Mask

Notes:

- This sheet is intended as a practical warm/cool balance aid, not absolute color truth.

## Current Export Behavior

- **Export Current View** is a visible top-level action in the main control panel.
- The **Previews** stage opens directly into the sheet-preview workflow.
- Users can preview Sheet 1 / Sheet 2 / Sheet 3 before export.
- Sheet export is routed through the preview workflow.
- Current view export remains separate from sheet export.

## Additional Working Workflow Notes

- The app still includes composition/focal-point workflow and crop studies that can become the working reference.
- Rough outline output can be mirrored for drawing checks.
- The current app state is good enough for real painter usage and observational testing.

## Current Stable Architecture

- Static app structure:
  - `index.html`
  - `styles.css`
  - `app.js`
  - `manifest.webmanifest`
  - `service-worker.js`
- Single-file runtime architecture centered in `app.js`
- Deterministic client-side image processing
- Manual browser smoke testing remains the main regression check

## Known Limitations / Observations

- Outline can still be too busy for some images, especially architecture and foliage.
- Warm/cool/neutral masks may need calibration based on real-world usage.
- UI is functional and usable, but still open to a later aesthetics/polish pass.
- `app.js` remains large and monolithic.
- Code refactor is intentionally deferred until workflow stabilizes after more real use.

## Intentionally Deferred

- Broad refactor of `app.js`
- Module extraction
- Algorithm changes for current stable studies
- Larger UX redesign
- AI integration

## Practical Resume Guidance

If a future session needs to resume quickly, the most important facts are:

- V5.2 is the current stable prototype.
- Export Current View is now always visible.
- Previews contains the 3-sheet workflow.
- The app should be treated as working and worth testing in real painting use before structural cleanup resumes.
