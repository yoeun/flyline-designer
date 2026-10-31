# flyline-designer

## Worktrees

Start every new task in its own git worktree under `.worktrees/`, not on a branch in the main checkout:

```sh
git worktree add .worktrees/<name> -b <branch> main
```

Do all edits, tests and commits there, and leave the main checkout on `main`. Follow-up requests within the same piece of work stay in its worktree; only start a new one for separate work.

`.worktrees/` is gitignored, and `vite.config.js` keeps Vitest and the dev server's file watcher out of it. A worktree has no `node_modules`, so run `npm ci` in it first.

## Pull requests

- Create every PR as a **draft**. Drafts run no GitHub Actions (the PR title check skips them), which saves minutes.
- While it is a draft, push as often as needed. Mark it ready for review only once all the work is done and everything passes locally: `npm test`, `npm run build` (add any new lint or type check script if one exists). Marking it ready runs the PR title check.
- After it is ready, push only fixes. PR titles follow Conventional Commits (see README); squash merge.
- Render previews are off by default. Only when the owner asks for one, add `[render preview]` to the PR title (this only works once previews are set to manual in Render; see the README).
- Production follows the `release` branch, which `.github/workflows/release.yml` fast-forwards to `main` at 5:47 and 17:47 Pacific (cron is UTC, so it drifts an hour with daylight saving). To ship right after a merge, put a line containing only `!!hotfix` in the PR description (a mention elsewhere does nothing, and the title must stay a normal Conventional Commit), or run the **Release** workflow by hand (Actions, Release, Run workflow).
- Each release bumps the version in the root `package.json` from the commit types since the last one (a `!` or `BREAKING CHANGE:` is major, `feat` minor, `fix`, `perf`, `revert`, `refactor` and `build` patch, anything that isn't a Conventional Commit patch), commits `chore(release): vX.Y.Z` to `main`, tags it `vX.Y.Z` and creates a GitHub Release. `docs`, `test`, `ci`, `chore` and `style` changes alone don't make a release: the scheduled run skips them and they go out with the next real release (a manual run or a hotfix always releases, as a patch at least).
- If Actions is down, release by hand with `scripts/release.sh --force --no-gh-release` (run `scripts/release.sh --dry-run` first to see the version and notes); it does the same steps, and the scheduled workflow's rules live in `scripts/release-level.mjs`. Otherwise never push to `release` directly.
