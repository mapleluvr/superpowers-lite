# Superpowers Lite

Superpowers Lite is a host-neutral [Agent Skills](https://agentskills.io/) pack for
software development. It keeps the 14 Superpowers workflows and routes work by
risk so small tasks do not inherit feature-scale ceremony.

It is not an extension or runtime adapter. The package registers no tools,
commands, hooks, background services, task stores, or automatic context. A host
only discovers the `skills/` directory and loads a matching `SKILL.md` through
its native skill mechanism.

## What "Lite" Means

Lite describes process cost, not a reduced skill inventory:

| Route | Use for | Default workflow |
|---|---|---|
| **Micro** | Mechanical, local, non-behavioral edits | Inspect, change, focused validation |
| **Standard** | Bounded behavior changes and bug fixes | Work in place, TDD when behavioral, self-review, scoped verification |
| **Full** | Cross-cutting, ambiguous, security-sensitive, migratory, concurrent, or externally consequential work | Durable authority, milestones, isolation, bounded review, L0-L3 evidence |

A task may escalate when newly discovered risk crosses a route boundary. It must
never silently downgrade.

## Skill Loading

`using-superpowers` is an on-demand router. Because this is a pure skill pack, it
is not injected into every session. A compatible host may select it from its
description, a user may load it explicitly, or a host-level instruction may
require it.

Every operational skill has its own trigger description and can be used without
the router already being loaded. Skill text names capabilities rather than tool
APIs: the host decides how to read files, track tasks, create isolated workspaces,
or dispatch workers.

## Install

Clone the skill pack:

```bash
git clone https://github.com/mapleluvr/superpowers-lite.git
```

Point your host's native skill discovery at `<checkout>/skills`, or install the
repository directly when the host supports Git-based Agent Skills packages. No
`npm install`, build step, Pi extension, or host adapter is required.

Do not load Superpowers Lite and another Superpowers distribution at the same
time. They expose the same 14 skill names, so duplicate discovery is ambiguous.

## Included Skills

- `brainstorming`
- `dispatching-parallel-agents`
- `executing-plans`
- `finishing-a-development-branch`
- `receiving-code-review`
- `requesting-code-review`
- `subagent-driven-development`
- `systematic-debugging`
- `test-driven-development`
- `using-git-worktrees`
- `using-superpowers`
- `verification-before-completion`
- `writing-plans`
- `writing-skills`

## Host Capabilities

The core pack needs only file reading and the development tools required by the
user's repository. Full additionally requires an independent final reviewer:
either a host-provided fresh-context reviewer or a named human who did not author
the change. When neither is available, Full stops rather than substituting the
controller's self-review.

Isolation, implementation workers, and a native task tracker are optional. Skills
fall back to one inline writer when isolation or worker execution is unavailable.
Shell and Git are required only by workflows that use their commands. Published
shell and Node helpers are invoked explicitly through `bash` or `node`, so they do
not depend on executable mode surviving a Windows-built archive. No host
capability is supplied by this package.

## Source Verification

Run these commands from a source checkout. Development scripts and tests are
intentionally excluded from the published skill pack.

```bash
node scripts/test.mjs
node scripts/upstream-sync.mjs check --source /path/to/superpowers
npm pack --dry-run --json --ignore-scripts
```

The source suite validates package purity, the extracted package artifact, Agent
Skills metadata, internal links, workflow contracts, upstream provenance, and the
imported debugging regression test. CI runs on Linux and Windows.

## Upstream

The current import is based on Superpowers `v6.2.0`. See [UPSTREAM.md](UPSTREAM.md)
for the exact commit, intentionally excluded host assets, file hashes, modes, and
reconciliation procedure.

## License

MIT. See [LICENSE](LICENSE).
