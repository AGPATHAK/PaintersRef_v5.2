# Painter's Reference Lab

Painter's Reference Lab is a small browser app for painters who want to turn a reference image into practical study material before and during a painting.

It helps you move through a simple painterly workflow: composition, observation, drawing, and painting studies from a single uploaded image.

## Live App

GitHub Pages deployment:

[https://agpathak.github.io/PaintersRef_v5.2/](https://agpathak.github.io/PaintersRef_v5.2/)

## What It Does

- Loads a local JPG or PNG reference image
- Preserves aspect ratio while fitting the image to the working canvas
- Organizes tools by workflow stage:
  - Baseline
  - Composition
  - Observation
  - Drawing
  - Painting
  - Exports
- Switches between multiple study views:
  - Original
  - Focal study
  - Squint
  - Outline sketch
  - Mirror check
  - Grayscale
  - 3-value notan
  - Light mask
  - Midtone mask
  - Shadow mask
  - Temperature study
  - Palette notes with watercolor-friendly mix suggestions
- Lets you adjust outline sensitivity and smoothing
- Lets you adjust 3-value notan thresholds
- Lets you compare warm, cool, and neutral temperature masks
- Generates palette notes with a few watercolor mix suggestions from sampled color families
- Adds a configurable grid with adjustable rows and columns
- Includes a light/dark interface toggle for different studio lighting conditions
- Exports the current view directly as a JPEG
- Exports composite study sheets as JPEG files
- Works as a Progressive Web App (PWA) for installable, offline-friendly use

## Quick Use

1. Open the live app.
2. Load a JPG or PNG reference image.
3. Move through the workflow stages on the left:
   - `Composition`: choose a point of interest, keep the original or select one of four crop studies, and clear the selection when needed
   - `Observation`: use `Squint` to study large value masses
   - `Drawing`: use `Outline Sketch` and `Mirror Check`
   - `Painting`: use grayscale, notan, mask, temperature, and palette views
4. Adjust sliders when needed:
   - focal-study crop size
   - squint softness
   - outline sensitivity and smoothing
   - notan shadow and light cutoffs
5. Turn the grid on or off and set row/column counts.
6. Export the current view or one of the prepared study sheets.

## Export Sheets

`Sheet 1`

- Original
- Grayscale
- Notan
- Outline sketch
- Grid applied to the outline panel only

`Sheet 2`

- Original
- Light mask
- Midtone mask
- Shadow mask

`Sheet 3`

- Original
- Warm mask
- Cool mask
- Neutral mask

## Why It Is Useful

This app is meant to reduce setup time for traditional painting studies. Instead of manually preparing several reference variations, you can generate value simplifications and drawing aids from one image in a single place.

Because everything runs in the browser, your image stays local to your device while you work.

## Workflow

- `Baseline`
  Use the original image and optional grid as a neutral starting point.
- `Composition`
  `Focal Study` creates four rule-of-thirds crop options around a chosen point of interest. The selected crop, or the original image, becomes the working reference for later stages.
- `Observation`
  `Squint` simplifies the reference into broader value masses.
- `Drawing`
  `Outline Sketch` supports block-in, and `Mirror Check` helps with structural checking.
- `Painting`
  Grayscale, notan, value masks, temperature study, and palette notes help simplify value and color relationships while painting. Palette notes show extracted reference colors and a few watercolor mix suggestions from the largest sampled color families.
- `Exports`
  Export the current canvas view or prepared study sheets for printing, saving, or later studio reference.

## Local Development (Optional)

If you want to run the app from the repository, serve it from a local web server instead of opening `index.html` directly. This is especially helpful because the app registers a service worker.

Example:

```bash
python3 -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080).

## PWA Notes

- `manifest.webmanifest` defines install metadata
- `service-worker.js` caches the app shell for offline reuse
- `icons/icon.svg` provides the app icon
- The hosted GitHub Pages build is installable as a PWA in supported browsers
- Theme preference is stored locally in the browser

## Project Files

- `index.html` - app structure and controls
- `styles.css` - layout and visual styling
- `app.js` - image processing, workflow controls, view switching, and export logic
- `manifest.webmanifest` - PWA manifest
- `service-worker.js` - offline caching

## Planning Documents

Future AI-assisted features are documented as an optional extension, not as a replacement for the current deterministic workflow.

- [Master Project Document](docs/master-project-document.md)
- [Source Doc Revisions](docs/source-doc-revisions.md)
- [Feature Roadmap](docs/feature-roadmap.md)
- [Codex Implementation Notes](docs/codex-implementation-notes.md)
- [UX Rules](docs/ux-rules.md)

## Deployment

- Repository is published on GitHub
- Hosted with GitHub Pages
- Live URL: [https://agpathak.github.io/PaintersRef_v5.2/](https://agpathak.github.io/PaintersRef_v5.2/)

## Version 2 Roadmap

This prototype now has a solid painter-first structure. The next version should focus on refinement through real use rather than adding many new tools.

### Priority Areas

- `Squint redesign`
  Continue refining squint so smaller details disappear more naturally and larger value masses merge in a more perceptual way.
- `Outline simplification`
  Replace technical outline controls with a more painter-facing `Simplify` control.
- `Mirror workflow`
  Likely move mirror to `Baseline` as a toggle between original and mirrored reference. If the mirrored version is chosen there, later stages can work from that mirrored reference consistently.
- `Export refinement`
  Improve `Export Current View` naming and consider later options such as export format choices or grid inclusion choices.
- `Export preview / print preview`
  Preview export sheets before downloading or printing so the painter can judge whether the selected studies are worth saving.
- `Palette notes refinement`
  Refine the watercolor mix suggestion rules based on real painting use. Keep the notes conditional and painter-facing rather than trying to prescribe exact pigment matches for every extracted color.
- `UI polish from actual use`
  Tighten labels, spacing, helper text, and control organization based on real painting sessions.

### Secondary Improvements

- `Reset Current Stage`
  Add a quick way to return one stage to sensible defaults.
- `Preset memory`
  Remember recent settings during a session.
- `Composition export`
  Consider exporting the selected composition study or all four focal-study crop options if that proves useful in practice.

### Design Judgment / Low Priority Backlog

- `Composition crop edge behavior`
  Review whether adaptive crop shrinking near image edges feels intuitive enough, or whether the UI needs a clearer explanation.
- `Color contrast audit`
  Recheck text and control contrast in both light and dark themes after real studio use.
- `Sidebar helper text audit`
  Keep pruning repeated explanatory text where the controls are already self-explanatory.
- `Palette notes export`
  Decide whether palette notes should stay on-screen only or become a printable sheet after the mix suggestions feel reliable enough.

### What To Avoid

- generic image-editing features
- tool sprawl
- Photoshop-like workflows
- features that replace painter judgment instead of supporting it
