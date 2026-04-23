# M1 No-Go Zones

Milestone 1 is stabilization only. These areas should not be touched unless required to fix a direct regression.

## Execution And Rollback Rule

- One issue = one branch.
- One issue = one PR.
- Run the smoke test before merge.
- Merge only after the smoke test passes.
- If regressions repeat twice on the same issue, revert and split the issue into smaller pieces.

## No AI API Integration

Do not add:

- API keys
- `fetch` calls to AI services
- AI provider configuration
- image upload to cloud services
- generated variant state
- AI Studio runtime UI

AI planning docs may exist, but M1 code must remain deterministic/local.

## No Feature Expansion

Do not add new painter tools, new export sheet types, new palette systems, or new comparison modes during M1.

Allowed:

- bug fixes
- behavior-preserving extraction
- small polish to existing controls

## No Framework Migration

Do not migrate to React, Vue, Svelte, TypeScript, Vite, or any build system in M1.

The current static HTML/CSS/JavaScript app should remain deployable as-is.

## No Visual Redesign

Do not redesign the sidebar, canvas frame, typography, colors, workflow hierarchy, or layout system.

Allowed:

- small spacing fixes
- readability fixes
- alignment fixes
- overflow fixes

## No Export Redesign Unless Bug Fix

Do not change export sheet content, export format, naming conventions, or layout unless fixing a verified bug.

Exports are a high-trust workflow and should remain stable.

## No Speculative Optimization

Do not optimize code merely because it could be faster.

Allowed optimization must meet both conditions:

- it reduces obvious unnecessary work
- it does not change visual output

## No Composition Workflow Rewrite

Do not rewrite focal-point selection, crop panels, or selected-composition behavior unless fixing a direct bug.

This area is useful but state-sensitive.

## No Palette Algorithm Rework

Do not redesign palette notes or watercolor mix suggestions in M1.

Allowed:

- preserve existing behavior during extraction
- adjust labels only if needed for clarity

## No Broad Backlog Expansion

Do not add a large new issue list during M1.

Use the lean M1 issue set and defer larger product ideas to later milestones.
