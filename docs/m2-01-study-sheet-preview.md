# M2-01 Study Sheet Preview

## Implementation Approach

This feature adds an in-app preview path for the existing reference study sheets without changing the underlying deterministic image-processing workflow.

The main canvas is reused as the preview surface. When the user opens Sheet Preview from the Previews stage, the selected sheet is rendered onto the main canvas using the current image and current settings.

## Reused Existing Logic vs New Logic

### Reused

- Existing Sheet 1 / Sheet 2 / Sheet 3 panel definitions
- Existing `drawPanel(...)` layout logic
- Existing `createCompositeSheet(...)` sheet builder
- Existing export buttons and download path

### New

- Lightweight preview controls in the Previews stage
- Small preview state inside `app.js`
- Preview render branch that draws the selected study sheet onto the main canvas

`createCompositeSheet(...)` now supports a non-downloading path so the same sheet-building logic can be used for both preview and export.

## UI Location Chosen

The preview controls live inside the existing Previews stage.

Added controls:

- `Previews`
- `Sheet 1`
- `Sheet 2`
- `Sheet 3`
- `Export Current Sheet`
- `Close Preview`

When sheet preview is open, the regular lower action block is hidden so only the sheet-preview controls remain visible.
The older standalone `Export Sheet 1/2/3` buttons were removed so sheet export flows through preview only.

This keeps the workflow compact and painter-focused without adding a separate modal or compare system.

## Validation Checks

Completed:

- `node --check app.js`
- `git diff --check`
- local static server HEAD checks for `/`, `/app.js`, and `/styles.css`

Intended browser checks for this issue:

- App loads
- Image loads
- Preview Sheet 1 works
- Preview Sheet 2 works
- Preview Sheet 3 works
- Export from preview works
- Existing grayscale/notan/masks remain unaffected

## Deferred Enhancements

- Custom sheet builder
- Drag/drop panels
- Dedicated compare mode
- Zoom sync
- Saved templates
- Print settings engine

## Notes

The implementation favors the lowest-risk reuse path. It does not introduce a new export architecture or new image-processing logic.
