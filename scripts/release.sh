#!/usr/bin/env bash
# Releases `main` to production: works out the next SemVer version from the
# commits that `release` lacks, bumps it, tags it, moves `release` up (Render
# deploys from `release`) and creates the GitHub Release.
#
#   scripts/release.sh --dry-run          print the range, level, version and notes; change nothing
#   scripts/release.sh                    release if any commit is user-facing (what the schedule runs)
#   scripts/release.sh --force            release even if every commit is docs, test, ci, chore or style (a patch)
#   scripts/release.sh --no-gh-release    skip the GitHub Release (no gh CLI)
#
# Each run looks at the commit subjects in origin/release..origin/main:
#   `!` before the colon, or `BREAKING CHANGE:` in a body   major
#   feat                                                    minor
#   fix, perf, revert, refactor, build, or anything that
#   isn't a Conventional Commit                             patch
#   docs, test, ci, chore, style only                       nothing: wait for the next release
# The rules live in scripts/release-level.mjs. It then:
#   1. bumps the version in the root package.json and commits `chore(release): vX.Y.Z` to main;
#   2. tags that commit `vX.Y.Z`;
#   3. fast-forwards `release` to it (never forced);
#   4. creates the GitHub Release.
# The commit needs a git identity (the workflow sets github-actions[bot]).
# Run it by hand only when GitHub Actions is down, `--dry-run` first.
set -euo pipefail

dry_run=false force=false gh_release=true
for arg in "$@"; do
  case "$arg" in
    --dry-run) dry_run=true ;;
    --force) force=true ;;
    --no-gh-release) gh_release=false ;;
    -h | --help) sed -n '2,23p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "Unknown option: $arg (see --help)" >&2; exit 2 ;;
  esac
done

root=$(git rev-parse --show-toplevel)
cd "$root"
helper="$root/scripts/release-level.mjs"

say() { # to the terminal, and to the Actions summary when there is one
  printf '%s\n' "$*"
  if [[ -n "${GITHUB_STEP_SUMMARY:-}" ]]; then printf '%s\n' "$*" >> "$GITHUB_STEP_SUMMARY"; fi
}

# Sets level, range, notes, version and next for what origin/release..origin/main holds.
plan() {
  git fetch --quiet origin main release
  git fetch --quiet --tags origin
  if [[ "$(git rev-parse origin/release)" == "$(git rev-parse origin/main)" ]]; then
    say "Nothing to release: \`release\` is already at \`main\`."
    exit 0
  fi
  # Only ever fast-forward: never merge, never force.
  if ! git merge-base --is-ancestor origin/release origin/main; then
    echo "::error::release has commits that main doesn't, so it can't be fast-forwarded. Fix it by hand." >&2
    exit 1
  fi
  range="origin/release..origin/main"
  local out
  out=$(git log --no-merges --reverse --format='%s%x1f%b%x1e' "$range" | node "$helper" changes)
  level=${out%%$'\n'*}
  notes=${out#*$'\n'}
  version=$(git show origin/main:package.json | node -p 'JSON.parse(require("fs").readFileSync(0, "utf8")).version')
  if [[ ! "$version" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "::error::The root package.json on main has no X.Y.Z version (found: ${version:-none})." >&2
    exit 1
  fi
  if [[ "$level" == none ]]; then
    if [[ "$force" == true ]]; then level=patch; else next=; return 0; fi
  fi
  next=$(node "$helper" bump "$version" "$level")
  if git rev-parse --quiet --verify "refs/tags/v$next" > /dev/null; then
    echo "::error::The tag v$next already exists. Fix it by hand." >&2
    exit 1
  fi
}

report() {
  echo "Range:   $range ($(git rev-list --count "$range") commits)"
  echo "Level:   $level"
  echo "Version: ${version:-?} -> ${next:-none}"
  echo
  echo "$notes"
}

skip_if_nothing() {
  if [[ "$level" == none ]]; then
    say "Nothing user-facing to release: only docs, test, ci, chore and style commits since \`release\`. They go out with the next release."
    exit 0
  fi
}

level= range= notes= version= next=
plan

if [[ "$dry_run" == true ]]; then
  report
  if [[ "$level" == none ]]; then echo; echo "Nothing user-facing to release (--force would release a patch)."; fi
  exit 0
fi
skip_if_nothing

work=$(mktemp -d)
trap 'git worktree remove --force "$work" 2> /dev/null || true; rm -rf "$work"' EXIT

# Bumps the version in a throwaway worktree at origin/main, so the caller's checkout is left alone.
commit_release() {
  git worktree add --quiet --detach "$work" origin/main
  (
    cd "$work"
    if [[ -f package-lock.json ]]; then
      npm version "$level" --no-git-tag-version > /dev/null
    else
      node -e '
        const fs = require("fs")
        const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"))
        pkg.version = process.argv[1]
        fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2) + "\n")
      ' "$next"
    fi
    [[ "$(node -p 'require("./package.json").version')" == "$next" ]] || { echo "::error::The version did not become $next." >&2; exit 1; }
    git add -u
    git commit --quiet -m "chore(release): v$next"
  )
}

pushed=false
for attempt in 1 2; do
  commit_release
  if git -C "$work" push --quiet origin HEAD:refs/heads/main; then pushed=true; break; fi
  echo "main moved while releasing (attempt $attempt of 2)." >&2
  git worktree remove --force "$work"
  [[ "$attempt" == 2 ]] && break
  plan
  skip_if_nothing
done
if [[ "$pushed" != true ]]; then
  echo "::error::main moved twice while releasing; run it again." >&2
  exit 1
fi

sha=$(git -C "$work" rev-parse HEAD)
git tag -a "v$next" -m "v$next" "$sha"
git push --quiet origin "refs/tags/v$next"

# Same ancestor check as the plan: `release` must still be behind the new commit.
git fetch --quiet origin release
if ! git merge-base --is-ancestor origin/release "$sha"; then
  echo "::error::release has commits that main doesn't, so it can't be fast-forwarded. main and the tag v$next are pushed; fix release by hand." >&2
  exit 1
fi
git push --quiet origin "$sha:refs/heads/release"

if [[ "$gh_release" == true ]]; then
  gh release create "v$next" --verify-tag --title "v$next" --notes "$notes"
fi

{
  echo "### Released v$next to production ($level)"
  echo
  echo "$notes"
} | while IFS= read -r line; do say "$line"; done
