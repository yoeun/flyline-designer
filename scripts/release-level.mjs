// Works out a release from the commits it ships: the SemVer level, the next
// version and the release notes. Pure functions, so the rules can be tested;
// `scripts/release.sh` is the only caller. As a command:
//
//   git log --format='%s%x1f%b%x1e' <range> | node scripts/release-level.mjs changes
//       prints the level (major, minor, patch or none) on the first line, then
//       the release notes in Markdown
//   node scripts/release-level.mjs bump <version> <level>
//       prints the next version

import { pathToFileURL } from 'node:url'

const TYPE_LEVEL = {
  feat: 'minor',
  fix: 'patch',
  perf: 'patch',
  revert: 'patch',
  refactor: 'patch',
  // `build` may or may not touch dependencies; counting it as a patch is the
  // simple, safe side.
  build: 'patch',
  docs: 'none',
  test: 'none',
  ci: 'none',
  chore: 'none',
  style: 'none',
}

const CONVENTIONAL = /^(\w+)(?:\([^)]*\))?(!)?:\s/
const BREAKING_FOOTER = /^BREAKING[ -]CHANGE:/m
const RELEASE_COMMIT = /^chore\(release\):/

/**
 * Reads one commit.
 * @param {{ subject: string, body?: string }} commit
 * @returns {{ type: string | null, breaking: boolean, level: 'major' | 'minor' | 'patch' | 'none' }}
 */
export function parseCommit({ subject, body = '' }) {
  const match = CONVENTIONAL.exec(subject)
  if (!match) {
    // Not a Conventional Commit: count it as a fix, so it still ships.
    return { type: null, breaking: BREAKING_FOOTER.test(body), level: 'patch' }
  }
  const type = match[1].toLowerCase()
  const breaking = match[2] === '!' || BREAKING_FOOTER.test(body)
  // An unknown type (`wip:`) is treated like a fix, too.
  const level = breaking ? 'major' : (TYPE_LEVEL[type] ?? 'patch')
  return { type, breaking, level }
}

const ORDER = ['none', 'patch', 'minor', 'major']

/**
 * The SemVer level a list of commits calls for. `none` means every commit is
 * docs, test, ci, chore or style (or there are no commits), which a scheduled
 * run leaves for the next real release. Earlier release commits don't count.
 * @param {{ subject: string, body?: string }[]} commits
 * @returns {'major' | 'minor' | 'patch' | 'none'}
 */
export function bumpLevel(commits) {
  let level = 'none'
  for (const commit of commits) {
    if (RELEASE_COMMIT.test(commit.subject)) continue
    const next = parseCommit(commit).level
    if (ORDER.indexOf(next) > ORDER.indexOf(level)) level = next
  }
  return level
}

/**
 * @param {string} version `X.Y.Z`
 * @param {'major' | 'minor' | 'patch'} level
 */
export function bumpVersion(version, level) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version)
  if (!match) throw new Error(`Not a plain X.Y.Z version: ${version}`)
  const [major, minor, patch] = match.slice(1).map(Number)
  if (level === 'major') return `${major + 1}.0.0`
  if (level === 'minor') return `${major}.${minor + 1}.0`
  if (level === 'patch') return `${major}.${minor}.${patch + 1}`
  throw new Error(`Not a bump level: ${level}`)
}

const GROUPS = [
  ['Breaking', (c) => c.breaking],
  ['Features', (c) => c.type === 'feat'],
  ['Fixes', (c) => ['fix', 'perf', 'revert'].includes(c.type)],
  ['Other', () => true],
]

/**
 * The release notes: the shipped subjects under Breaking, Features, Fixes and
 * Other (each commit once, under the first that fits).
 * @param {{ subject: string, body?: string }[]} commits
 */
export function releaseNotes(commits) {
  const rest = commits
    .filter((commit) => !RELEASE_COMMIT.test(commit.subject))
    .map((commit) => ({ subject: commit.subject, ...parseCommit(commit) }))
  const sections = []
  for (const [title, fits] of GROUPS) {
    const mine = rest.filter(fits)
    if (mine.length === 0) continue
    for (const commit of mine) rest.splice(rest.indexOf(commit), 1)
    sections.push(
      `### ${title}\n\n${mine.map((c) => `- ${c.subject}`).join('\n')}`,
    )
  }
  return sections.join('\n\n')
}

/**
 * Splits `git log --format='%s%x1f%b%x1e'` output.
 * @param {string} log
 */
export function parseLog(log) {
  return log
    .split('\x1e')
    .map((record) => record.replace(/^\n/, ''))
    .filter((record) => record.trim() !== '')
    .map((record) => {
      const [subject, body = ''] = record.split('\x1f')
      return { subject: subject.trim(), body }
    })
}

async function main(argv) {
  const [command, ...args] = argv
  if (command === 'changes') {
    let log = ''
    for await (const chunk of process.stdin) log += chunk
    const commits = parseLog(log)
    console.log(bumpLevel(commits))
    console.log(releaseNotes(commits))
  } else if (command === 'bump') {
    console.log(bumpVersion(args[0], args[1]))
  } else {
    console.error('Usage: release-level.mjs changes | bump <version> <level>')
    process.exit(2)
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  await main(process.argv.slice(2))
}
