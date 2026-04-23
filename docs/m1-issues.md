# M1 Issues

Lean executable issue set for Milestone 1. Tiny tasks are merged; speculative work is excluded.

| ID | Sub-Milestone | Priority | Title | Size | Depends On | Acceptance Criteria |
|---|---|---|---|---|---|---|
| M1-01 | M1A Safety Baseline | P0 | Create baseline tag and smoke test checklist | XS | None | Working app is committed/tagged as `m1-baseline` or equivalent; smoke checklist covers load, grid, focal crops, squint, outline, mirror, grayscale, notan, masks, temperature, palette, and exports. |
| M1-02 | M1A Safety Baseline | P1 | Capture reference screenshots for core views | S | M1-01 | Screenshots or manually verified reference views exist for original/grid, focal study, selected crop, squint, outline, mirror, notan, temperature, palette, and export sheets. |
| M1-03 | M1B Deterministic Module Extraction | P1 | Extract canvas utilities plus grayscale/notan helpers | M | M1-01 | Canvas utility, grayscale, and notan/posterize helpers move out of `app.js`; all related views and Sheet 1 still match baseline behavior. |
| M1-04 | M1B Deterministic Module Extraction | P1 | Extract tonal and temperature mask helpers | M | M1-03 | Light/midtone/shadow and warm/cool/neutral helpers move out of `app.js`; Painting views and Sheets 2/3 still work. |
| M1-05 | M1B Deterministic Module Extraction | P1 | Extract palette and export helpers | M | M1-03 | Palette analysis/render helpers and composite export helpers are isolated; Palette Notes and all export buttons still work. |
| M1-06 | M1C State & Render Cleanup | P1 | Document and group app state responsibilities in code | S | M1-03 | Documentation/comments and structure grouping clarify file/view/settings/composition/processed/ui responsibilities; no behavior, render timing, rebuild rules, or workflow behavior changes. |
| M1-07 | M1C State & Render Cleanup | P1 | Clarify event-to-state-to-render flow | M | M1-06 | Common event handlers follow a consistent update-state, rebuild-if-needed, update-controls, render sequence; no visible workflow regression. |
| M1-08 | M1C State & Render Cleanup | P2 | Reduce unnecessary processed-canvas rebuilds | M | M1-07 | Grid-only and UI-only changes do not rebuild unrelated processed canvases; visual output remains unchanged. |
| M1-09 | M1D UI Bug Fixes / Polish | P2 | Fix small UI polish issues from current notes | S | M1-07 | Spacing, slider alignment, readability, redundant helper text, and small overflow issues are addressed only where low-risk and already evident, after state/render cleanup is stable. |
| M1-10 | M1E Closeout Review | P0 | Run M1 regression and readiness review | S | M1-03, M1-04, M1-05, M1-07, M1-09 | Smoke test passes; exports verified; no AI, framework, redesign, or feature expansion entered M1; readiness for M2 is documented. |
