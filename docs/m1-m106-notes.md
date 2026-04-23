# M1-06 Notes: Documentation / Structure Cleanup

## Scope

M1-06 is a zero-behavior-risk cleanup pass. It keeps the stable single-script architecture intact and adds navigation structure plus maintenance notes inside `app.js`.

No production logic was moved, split, renamed, or rewritten.

## Sections Added

- Maintainer map
- App configuration / constants
- Image loading helpers
- Core canvas and painting transforms
- Drawing / observation transforms
- View composition and export helpers
- App controller / runtime state
- Startup

## Risky Zones Identified

- Script loading and module extraction, because prior M1-03 attempts caused image-load regressions.
- `rebuildWorkingCanvasesFromSource`, because selected crops and original images flow through it before later-stage processing.
- `selectCompositionChoice`, because it changes the working source for observation, drawing, painting, palette, and exports.
- `state.processed`, because render and export methods read directly from this derived canvas cache.
- Export builders, because sheet generation depends on current processed canvases and grid state.
- Service worker caching, because stale browser assets can look like app regressions during testing.

## Functions Intentionally Not Moved

All functions were intentionally left in their existing order. M1-06 favors landmarks and dependency notes over regrouping because the app is currently working and previous extraction attempts exposed browser loading fragility.

Deferred to later milestones:

- Split export builders after a test harness exists.
- Map state dependencies before any file extraction.
- Separate UI handlers from render logic only after smoke and screenshot baselines are reliable.

## Checks Performed

- `node --check app.js`
- `git diff --check`
- Local static server HEAD checks for `/`, `/app.js`, and `/styles.css`

Manual browser smoke checks should still be run before merge:

- Load JPG/PNG image.
- Confirm grid, focal crop selection, squint, outline, mirror, grayscale, notan, masks, temperature, palette, and exports still behave normally.
