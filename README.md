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
  - Palette notes
- Lets you adjust outline sensitivity and smoothing
- Lets you adjust 3-value notan thresholds
- Adds a configurable grid with adjustable rows and columns
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
  Grayscale, notan, value masks, temperature study, and palette notes help simplify value and color relationships while painting.

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

## Project Files

- `index.html` - app structure and controls
- `styles.css` - layout and visual styling
- `app.js` - image processing, workflow controls, view switching, and export logic
- `manifest.webmanifest` - PWA manifest
- `service-worker.js` - offline caching

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
- `Limited-palette pigment matching`
  Explore extracting a small set of representative image colors, then matching them to the nearest anchors in a fixed painter's palette, such as warm/cool primaries, earth colors, and a green.
- `UI polish from actual use`
  Tighten labels, spacing, helper text, and control organization based on real painting sessions.

### Secondary Improvements

- `Reset Current Stage`
  Add a quick way to return one stage to sensible defaults.
- `Preset memory`
  Remember recent settings during a session.
- `Focal study evolution`
  Consider expanding from one focal point study to multiple candidate focal studies if real use supports it.
- `Palette study display`
  Show extracted image colors beside their nearest pigment anchors, making clear that these are starting points for mixing rather than exact paint recipes.

### What To Avoid

- generic image-editing features
- tool sprawl
- Photoshop-like workflows
- features that replace painter judgment instead of supporting it
