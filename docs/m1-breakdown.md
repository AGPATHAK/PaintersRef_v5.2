# M1 Breakdown: Current App Stabilization

Milestone 1 protects the working Painter's Ref Lab app while making the codebase safer for future work. The goal is not new capability. The goal is lower regression risk.

## M1A Safety Baseline

Protect the current working version before refactoring.

### Purpose

Create a reliable baseline so every M1 change can be compared against the known-good app.

### Stable Branch / Tag Recommendation

- Keep `main` as the stable branch.
- Create a stabilization branch for work: `codex/m1-stabilization`.
- Before the first code refactor, tag the current working version:
  - suggested tag: `m1-baseline`
  - suggested command after confirming clean state: `git tag m1-baseline`
- If using GitHub Desktop, confirm the current working app is committed before starting M1 code changes.

### Backup Guidance

- Keep a committed baseline on `main`.
- Avoid large mixed commits.
- Prefer one issue per commit.
- Do not delete existing working logic during extraction; move it first, then verify.
- Keep a copy of at least one representative test image outside the repo for manual checks.

### Execution Discipline

- One issue = one branch.
- One issue = one PR.
- Run the smoke test before merge.
- Merge only after the smoke test passes.
- If the same issue causes regressions twice, revert it and split the issue into smaller pieces before trying again.

### Smoke Test Checklist

- Load a JPG.
- Load a PNG.
- Toggle dark/light mode.
- Turn grid on/off and change rows/columns.
- Place a focal point.
- Change crop size.
- Select each composition crop and verify later stages use it.
- Clear composition selection.
- View Squint and move softness slider.
- View Outline Sketch and apply Low/Medium/High presets.
- View Mirror Check.
- View Grayscale.
- View 3-Value Notan and reset standard thresholds.
- View Light, Midtone, and Shadow masks.
- View Temperature Study and adjust sliders.
- View Palette Notes.
- Export Current View.
- Export Sheets 1, 2, and 3.
- Refresh page and confirm PWA cache does not serve broken assets.

### Key Workflows To Preserve

- loaded image remains local and visible
- selected composition crop becomes working reference for later stages
- mirror works on the generated outline
- squint works as an observation/value-mass study
- grid overlays current canvas view
- exports match the current deterministic studies
- dark mode remains readable

### Screenshots / Views To Verify After Changes

- initial empty state
- loaded original with grid
- focal study before point selection
- focal study with four crop panels
- selected crop shown in Squint
- outline sketch, medium preset
- mirror check
- 3-value notan, standard thresholds
- tonal mask sheet views
- temperature study side-by-side view
- palette notes view
- export sheet outputs

### Risk

XS. Planning and baseline setup have low risk, but skipping this step makes later refactors risky.

### Success Criteria

- Baseline tag or equivalent committed reference exists.
- Smoke test checklist exists and is used before code extraction.
- Known working behavior is documented.

### Effort

XS

## M1B Deterministic Module Extraction

Reduce `app.js` safely by moving pure deterministic helpers into modules.

### Purpose

Make the code easier to navigate without changing behavior.

### Likely Extraction Candidates

- grayscale logic
- notan / posterize logic
- tonal masks
- temperature masks
- palette helpers
- export helpers

### Recommended Extraction Order

1. canvas utility helpers
2. grayscale and notan helpers
3. tonal and temperature mask helpers
4. palette helpers
5. export helpers

### Rules

- No behavior changes.
- Keep function names stable where practical.
- Move code first, then update imports.
- Run the smoke test after each extraction group.
- Do not extract focal-study render logic yet unless needed.

### Risk

M. The algorithms are mostly pure, but they feed every view and export.

### Success Criteria

- `app.js` is smaller.
- Extracted modules are behavior-preserving.
- All existing views and exports still work.
- No new UI or AI code is introduced.

### Effort

M

## M1C State & Render Cleanup

Clarify runtime flow without redesigning the app.

### Purpose

Make it easier to understand what changes state, what rebuilds processed canvases, and what renders the canvas.

### Central State Object Proposal

Keep the current single state object, but document and group it more deliberately:

- `file`: loaded filename and original dimensions
- `view`: active stage and view mode
- `settings`: grid, outline, squint, notan, temperature, focal-study settings
- `composition`: focal point and selected composition choice
- `processed`: original canvas, reference canvas, generated canvases, palette notes
- `ui`: transient status, layout helpers, selected panel data

This does not require a framework or store library.

### M1-06 Boundary

`M1-06` is documentation and structure cleanup only.

Allowed:

- add comments describing state groups
- move state fields into clearer grouped sections if behavior stays identical
- document ownership of transient runtime helpers

Not allowed:

- changing behavior
- changing render timing
- changing rebuild rules
- changing composition selection behavior
- introducing a new state-management system

### Implicit Globals / Runtime Helpers To Identify

- `this.focalStudyLayout`
- `this.ctx`
- `this.maxCanvasDimension`
- direct DOM references in `this.dom`
- processed canvas cache in `this.state.processed`
- service worker cache version in `service-worker.js`

### Event -> State -> Render Flow

Target flow:

```text
DOM event
  -> validate input
  -> update state
  -> rebuild derived canvases only when needed
  -> update controls/status
  -> render current view
```

### Redraw Triggers

Current redraw triggers include:

- image load
- stage/view change
- grid changes
- outline slider or preset change
- squint slider change
- notan threshold change
- temperature slider change
- focal point placement
- crop-size change
- composition crop selection
- clear selection

### Cache Opportunities

- Avoid rebuilding unrelated processed canvases when only grid settings change.
- Rebuild notan only when notan thresholds change.
- Rebuild outline/mirror only when outline settings or working reference change.
- Rebuild temperature masks only when temperature settings or working reference change.
- Treat palette notes as derived from the working reference unless later design says otherwise.

### Risk

M/L. State/render cleanup touches the most connected part of the app.

### Success Criteria

- Render triggers are easier to trace.
- Processed canvas rebuilds are intentional.
- No change to visible behavior.
- Composition crop workflow remains intact.

### Effort

M

## M1D UI Bug Fixes / Polish

Address known low-risk UI annoyances after state/render cleanup is in place.

### Purpose

Reduce visible friction without redesigning the interface.

M1D should happen after M1C because visual fixes are easier to verify once event, state, and render flow are stable.

### Notes Incorporated

No standalone bug-note file is currently present in the repo. M1D should use existing repository documentation and observed current UI structure. Earlier known UI themes already reflected in the docs include:

- spacing inconsistencies
- redundant controls
- slider alignment
- readability issues
- mobile or small-screen overflow
- helper text density
- export/palette note decisions

### Allowed M1D Work

- fix spacing inconsistencies
- fix controls touching or overflowing
- improve label readability
- align sliders and buttons
- remove redundant helper text if already duplicated
- fix mobile overflow edge cases
- improve empty/loading/error clarity if small

### Not M1D Work

- no visual redesign
- no new feature panels
- no new AI UI
- no export redesign unless fixing a bug

### Risk

S. UI polish is lower risk if limited to existing controls and verified through screenshots.

### Success Criteria

- Known visual annoyances are reduced.
- Existing workflow remains familiar.
- Dark and light modes remain readable.
- No new controls or features are added.

### Effort

S

## M1E Closeout Review

Confirm M1 has made the app safer without changing its identity.

### Purpose

Decide whether the repo is ready for Milestone 2.

### Closeout Checklist

- Run the M1 smoke test.
- Review changed files for accidental scope creep.
- Confirm `app.js` is smaller or clearer.
- Confirm modules have clear responsibilities.
- Confirm no AI integration exists.
- Confirm exports still work.
- Confirm service worker cache was handled correctly if app assets changed.
- Update docs if implementation differs from plan.

### Risk

XS. Review itself is low risk; the risk is finding regressions late.

### Success Criteria

- App still works fully.
- Known P0/P1 issues are closed or explicitly deferred.
- Milestone 2 has a clear starting point.
- There is no unresolved refactor half-state.

### Effort

S
