# Superpowers Lite Skill Pack Design

**Date:** 2026-07-28
**Status:** Accepted and implemented
**Supersedes:** `2026-07-12-pi-superpowers-lite-design.md` for package/runtime architecture

## Decision

Superpowers Lite is a host-neutral Agent Skills pack. Its runtime surface is the
`skills/` tree only. It does not register extensions, tools, commands, hooks,
task state, background services, or automatic context.

## Loading Model

Hosts discover skill metadata and load full skill instructions through their own
native mechanism. `using-superpowers` is an on-demand router, not an injected
bootstrap. Each operational skill therefore has a self-contained trigger and
must remain usable when the router was not previously loaded.

Mandatory global routing is outside the pack boundary. A host or user may opt
into a global instruction, but the package does not ship an adapter to enforce
one.

## Tool Boundary

Skill text describes capabilities, not concrete tool names. Task tracking,
worker dispatch, isolation, file operations, shell execution, and review are
provided by the host when available. Optional capabilities require a documented
inline fallback or an explicit escalation/blocking rule. Missing isolation or
worker execution falls back to one inline writer. Full review does not fall back
to controller self-review: a fresh-context or named non-author human reviewer is
required, otherwise Full stops before execution.

## Packaging

The published package contains only:

- `skills/`
- `README.md`
- `LICENSE`
- `UPSTREAM.md`
- `upstream-manifest.json`

Development tests, evaluation fixtures, provenance scripts, and historical
design records remain in the source repository but are excluded from the
runtime package.

## Compatibility

The existing 14 skill names remain stable. Loading this pack alongside another
Superpowers distribution is unsupported because duplicate skill names make
selection ambiguous.

## Provenance

The upstream baseline is Superpowers v6.2.0. Provenance uses pinned Git blobs and
Git modes, requires verified source identity, and explicitly accounts
for every retained or excluded upstream skill asset. Working-tree bytes never
define upstream identity.
