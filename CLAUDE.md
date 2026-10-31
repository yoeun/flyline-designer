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
- How releases are versioned, and how to release by hand if Actions is down, is in the shared `release` skill (`/shared:release`); the scripts are `scripts/release.sh` and `scripts/release-level.mjs`. A `docs`, `test`, `ci`, `chore` or `style` change alone makes no release.
