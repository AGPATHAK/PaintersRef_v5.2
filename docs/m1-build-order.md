# M1 Build Order

Safest implementation sequence for Milestone 1.

## Execution Discipline

- One issue = one branch.
- One issue = one PR.
- Run the smoke test before merge.
- Merge only after the smoke test passes.
- If regressions repeat twice on the same issue, revert and split the issue smaller.

## Step 1: Create Safety Baseline

Create or confirm a clean commit, then tag the known working app as `m1-baseline` or create an equivalent GitHub Desktop checkpoint.

### Why First?

Every later refactor needs a safe return point. This is especially important because Painter's Ref Lab already works and the main risk is regression.

## Step 2: Write And Use Smoke Test Checklist

Run through the key workflows once before code changes.

### Why Next?

The checklist turns "it seems fine" into a repeatable baseline. It also reveals whether any existing issue should be fixed before refactoring.

## Step 3: Capture Reference Views

Capture or manually verify the important views: original/grid, focal study, selected crop, squint, outline, mirror, notan, masks, temperature, palette, and export sheets.

### Why Next?

Module extraction can preserve syntax while subtly changing output. Reference views give the eye something concrete to compare.

## Step 4: Extract Canvas Utilities, Grayscale, And Notan

Move the lowest-dependency deterministic helpers first.

### Why Next?

These functions are mostly pure and are easier to move safely than render or state logic. They also exercise the module pattern before touching more connected code.

## Step 5: Extract Tonal And Temperature Masks

Move light/midtone/shadow and warm/cool/neutral mask generation.

### Why Next?

These are deterministic processors used by Painting views and export sheets. They are connected, but still safer than composition/render flow.

## Step 6: Extract Palette And Export Helpers

Move palette analysis/render helpers and composite export sheet helpers.

### Why Next?

Palette and export code are larger and more specialized. By this point, the project already has a proven extraction pattern.

## Step 7: Document And Group State Responsibilities

Clarify `state` sections and transient runtime helpers.

### Why Next?

Once pure processors are less tangled with the app class, state cleanup becomes easier to see. Do not redesign state yet; first make ownership clear.

## Step 8: Normalize Event -> State -> Render Flow

Make common handlers follow a predictable sequence.

### Why Next?

This is the most behavior-sensitive M1 refactor. It should happen only after the simple extractions and smoke tests are reliable.

## Step 9: Reduce Obvious Unnecessary Rebuilds

Avoid recalculating unrelated processed canvases for grid-only or UI-only changes.

### Why Next?

Optimization is only allowed where it clarifies behavior and reduces work without changing output. This comes after state/render flow is understandable.

## Step 10: Apply Small UI Polish Fixes

Fix only low-risk issues: spacing, alignment, readability, redundant text, and small overflow problems.

### Why Next?

UI polish is easier to verify after state and render behavior are stable. It should not distract from code stabilization or mask render-flow regressions.

## Step 11: Run Closeout Regression

Run the smoke test, verify exports, review scope, and document M2 readiness.

### Why Last?

M1 succeeds only if the app still works fully. Closeout catches accidental scope creep and confirms whether Milestone 2 can start safely.
