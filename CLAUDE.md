# flyline-designer

## Worktrees

Start every new task in its own git worktree under `.worktrees/`, not on a branch in the main checkout:

```sh
git worktree add .worktrees/<name> -b <branch> main
```

Do all edits, tests and commits there, and leave the main checkout on `main`. Follow-up requests within the same piece of work stay in its worktree; only start a new one for separate work.

`.worktrees/` is gitignored, and `vite.config.js` keeps Vitest and the dev server's file watcher out of it. A worktree has no `node_modules`, so run `npm ci` in it first.
