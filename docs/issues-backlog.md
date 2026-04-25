# Issues Backlog

Focused backlog from the current stable V5.2 checkpoint.

Completed items have been removed from this list. This backlog is intentionally shorter and more practical than earlier planning versions.

## Near Term

| Priority | Type | Title | Size | Depends On | Acceptance Criteria |
|---|---|---|---|---|---|
| P1 high | ux | Calibrate outline detail presets on difficult references | M | Real usage feedback | Low / Medium / High detail feel distinct and useful across common scenes, including architecture and foliage. |
| P1 high | ux | Calibrate warm/cool/neutral mask thresholds | M | Real usage feedback | Temperature masks read as painter-useful across a range of references without obvious misclassification. |
| P1 high | ux | Review sheet labels and export wording for clarity | S | Current preview/export workflow | Sheet names, preview labels, and export wording feel clear and non-redundant in normal use. |
| P1 high | docs | Keep README and docs aligned with V5.2 workflow | S | None | Public-facing docs accurately describe current view export, previews, and the 3-sheet workflow. |
| P1 high | bug | Fix any regression found during real painting use | S/M | As discovered | Stable workflow remains intact after bug fixes. |
| P2 medium | ux | UI aesthetics and spacing polish pass | M | Stable usage feedback | Interface looks cleaner and more intentional without changing the current workflow model. |
| P2 medium | ux | Review small-screen and iPad layout behavior | M | Stable usage feedback | The current control hierarchy remains usable on narrower screens and tablets. |
| P2 medium | docs | Add or refresh release/deployment checklist for V5.2 | S | None | Current stable state can be resumed, tested, and redeployed without guesswork. |

## Later / Nice To Have

| Priority | Type | Title | Size | Depends On | Acceptance Criteria |
|---|---|---|---|---|---|
| P2 medium | refactor | Re-enter refactor planning only after workflow stabilizes | S | More real usage | Refactor work is scoped from observed needs, not from code size alone. |
| P2 medium | refactor | Isolate export/sheet builder logic when safe | M | Refactor re-entry conditions met | Sheet building can be maintained more easily without changing output behavior. |
| P2 medium | refactor | Separate deterministic processors from UI/runtime code | L | Stronger regression safety | Behavior remains unchanged while processing helpers gain clearer boundaries. |
| P3 low | feature | Consider compare mode only if current preview workflow proves insufficient | M | More real usage | Compare mode is justified by actual workflow friction, not by speculation. |
| P3 low | feature | Consider saved presets after more usage data | M | Stable workflow | Presets reduce real repetition without cluttering the UI. |
| P3 low | feature | AI layer planning checkpoint | S | Deterministic workflow stabilized | Any future AI work is clearly bounded and separate from Core Lab. |
