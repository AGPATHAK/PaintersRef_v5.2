# M1 Baseline Tag Procedure

Only tag after the M1 smoke test passes.

## Recommended Commands

```bash
git status
git add -A
git commit -m "Prepare M1 baseline"
git tag m1-baseline
git push origin <current-branch>
git push origin m1-baseline
```

Replace `<current-branch>` with the active M1 branch name.

## Notes

- Use this tag as the known-good recovery point before M1 refactoring begins.
- If the smoke test needs fixes, do not create the tag yet.
- If the working tree is not clean, review the changed files before committing.
- If using GitHub Desktop, create the commit there first, then run the tag and push commands from the terminal if needed.

