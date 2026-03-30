# Painter's Reference Lab

Painter's Reference Lab is a small browser app for painters who want to break a source image into practical study aids before painting.

## Current features

- Load a local JPG or PNG reference image
- View the image as original, grayscale, 3-value notan, tonal masks, or rough outline sketch
- Overlay a configurable grid
- Export two composite study sheets as JPEG files
- Install the app as a PWA for quick launch and offline reuse

## Run locally

Because the app registers a service worker, serve it from a local web server instead of opening `index.html` directly.

Examples:

```bash
python3 -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080).

## Export sheets

- Sheet 1: Original, Grayscale, Notan, Outline
- Sheet 2: Original, Light Mask, Midtone Mask, Shadow Mask

## PWA notes

- `manifest.webmanifest` defines install metadata
- `service-worker.js` caches the app shell for offline use
- `icons/icon.svg` provides the install/app icon
