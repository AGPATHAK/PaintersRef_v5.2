# Painter's Reference Lab

Painter's Reference Lab is a small browser app for painters who want to turn a reference image into practical study material before starting a painting.

It helps you quickly switch between value-study views, add a drawing grid, and export ready-to-use composite sheets from a single uploaded image.

## Live App

GitHub Pages deployment:

[https://agpathak.github.io/PaintersRef_v5.2/](https://agpathak.github.io/PaintersRef_v5.2/)

## What It Does

- Loads a local JPG or PNG reference image
- Preserves aspect ratio while fitting the image to the working canvas
- Switches between multiple study views:
  - Original
  - Grayscale
  - 3-value notan
  - Light mask
  - Midtone mask
  - Shadow mask
  - Rough outline sketch
- Lets you choose outline detail: low, medium, or high
- Adds a configurable grid with adjustable rows and columns
- Exports two composite study sheets as JPEG files
- Works as a Progressive Web App (PWA) for installable, offline-friendly use

## Quick Use

1. Open the live app.
2. Load a JPG or PNG reference image.
3. Choose the view mode you want to study.
4. Adjust outline detail if you are using the sketch view.
5. Turn the grid on or off and set row/column counts.
6. Export one of the prepared study sheets.

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

## Run Locally

Because the app registers a service worker, serve it from a local web server instead of opening `index.html` directly.

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
- `app.js` - image processing, grid controls, view switching, and export logic
- `manifest.webmanifest` - PWA manifest
- `service-worker.js` - offline caching

## Deployment

- Repository is published on GitHub
- Hosted with GitHub Pages
- Live URL: [https://agpathak.github.io/PaintersRef_v5.2/](https://agpathak.github.io/PaintersRef_v5.2/)
