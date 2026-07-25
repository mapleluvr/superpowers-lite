---
name: subagent-driven-development
description: Use for Full-route work when a current dynamic milestone has isolated parallel packages
---

# Subagent-Driven Development

## Overview

Full is feature-level assurance. Execute one current Full milestone with cohesive work packages, isolated implementers where justified, native patch handoffs, a single canonical integrator, scoped verification, protected-contract review, compact evidence, and a mandatory final whole-change review. A package may be routine inline, protected contract, or isolated parallel; its tier never weakens Full assurance.

## Route Gate

Use this skill only with approved durable authority and `.superpowers/work/<run-id>/manifest.json`. Read the manifest first and verify authority, canonical state, history, protected risks, and finalization state.

For frontier execution, exactly one current frontier is the current milestone. Load its milestone records and task cards. When `currentFrontier` is null, require `finalization.status` to be `ready`, all history completed or superseded, no blocked milestone or protected risk, and the latest L2 bound to clean canonical state. If all pass, enter finalization. A null current frontier is invalid: stop unless that finalization-ready state is proven. Never fabricate or reopen a milestone.

Parallel SDD requires at least two independently mergeable enabling work packages; they need not be independently user-visible. They require frozen consumed interfaces or a pinned contract, disjoint `owns` and exact `mutableResources`, independent package L1, no dependency path inside the same dispatched round, no split transaction, and critical-path benefit after coordination, worktree, patch-admission, and milestone-L2 cost. A dependency chain, shared mutable owner, unsplit invariant, or unclear benefit stays routine inline. Standard and Micro do not use SDD. Do not consume legacy plans, copied authority, or session history as execution authority.

Plan the current milestone as normally two to four packages in one to three rounds. Keep the same current milestone across package rounds; internal RED/GREEN never mints a new milestone or frontier.

## Pre-Flight

Before dispatch:

- verify run/milestone authority hashes, current `HEAD`, tree, and clean status;
- run L0 for the current milestone exactly as declared in its JSON record; record command, result, base, and milestone identity;
- failed or unavailable L0 means zero fanout: stop and rederive before dispatch;
- verify every task card, `owns` set, exact `mutableResources` identity, dependency, acceptance mapping, and declared package L1;
- defer settings, migrations, deploys, destructive cutovers, and other live effects.

Only after L0 passes, dispatch. Do not silently guess through a contradiction.

## Native Patch Milestone

For one current milestone, process planned rounds sequentially:

1. Freeze clean `MILESTONE_BASE` identity (commit, tree, empty status). A **single canonical integrator** owns the real checkout.
2. Before each round, freeze clean `ROUND_BASE`. Dispatch eligible isolated packages in the current round in one native parallel group with `worktree: true`; `failFast` is only an optimization.
3. Each implementer verifies manifest, milestone, `ROUND_BASE`, ownership, `mutableResources`, and passed L0; runs package L1 and self-review; then leaves owned changes for native patch capture. Native Pi destroys its temporary branch/worktree after capture; the native handoff is a **patch**, not a branch merge.
4. Wait for every current-round worker and patch. A failed, blocked, missing, or unresolved worker stops the milestone; the round applies zero patches and recovery returns canonical to `MILESTONE_BASE`.
5. Before any patch from the current round is applied anywhere, preflight the complete round set: each patch is non-empty; changed paths are a subset of `owns`, including renames and deletions; write sets and exact `mutableResources` identities do not overlap; and `git apply --check` passes against unchanged `ROUND_BASE`. Any mismatch ultimately integrates zero milestone patches.
6. Complete bounded Review only for a named protected-contract identity when required. Only impact-qualified Critical or Important findings block; unsupported severity labels become `defer` or `reject`. Routine packages have no independent Review.
7. Apply approved current-round patches in package order on canonical. After each apply, run its package L1, inspect the diff, and commit atomically. Conflict, path drift, resource collision, or contract mismatch triggers recovery, not ad-hoc surgery.
8. Continue the next round from new clean canonical state. After all rounds, run milestone union L2 once through the declared public entry or controlled E2E. Package L1 cannot prove milestone acceptance.
9. On a **post-apply L1 failure before commit**, reverse-apply only the current uncommitted patch, then revert every earlier current-milestone commit in reverse order without rewriting history.
10. On a **milestone union L2 failure after all milestone patches are committed**, do not reverse-apply any patch. Revert every current-milestone commit in reverse order without rewriting history.
11. For any recovery, stop on cleanup conflict; otherwise require clean status and the original `MILESTONE_BASE` tree before rederiving. Record commits and evidence only for a passing milestone.

No work package or intermediate milestone runs repository-wide L3.

## Protected Review and Implementer Dispatch

Independent Review is limited to a named protected contract before dependent consumers and the final whole change; each identity has one initial pass, one consolidated correction, and one closure pass. Migration, package split, frontier rename, role rename, or correction cannot reset or create a Review budget. Routine packages use TDD, self-review, package L1, and milestone L2.

Pass artifact paths, not full authority or session history. A task card names the frozen base, owned paths, exact `mutableResources` identities, controller-passed L0 evidence and milestone identity, milestone acceptance/public flow, exact declared package L1, consumed/produced interfaces, and report path. The implementer must not run L2, package-wide, repository-wide, migration, deployment, settings, or other live effects. It reports only package-local evidence and concerns.

Treat statuses explicitly: `SOURCE_READY`, `DONE_WITH_CONCERNS`, `NEEDS_CONTEXT`, or `BLOCKED`. Only `SOURCE_READY` with a complete report and patch may enter complete-set preflight. Never turn a failed dispatch into implied approval.

## Dynamic Recovery and Evidence

A hidden dependency invalidates the package map, integrates zero patches, and rederives the current milestone from canonical state. A local package defect with a valid milestone boundary stays in the same current milestone as a correction work package or package correction round; it does not create a new frontier. An invalid foundational boundary preserves patch forensic history and rederives from a clean base. Two rejected core-contract candidates force package re-decomposition or a contract/probe work package linked directly to the blocked public path.

Use one structured record per gate by default:

```text
evidence/l0/record.json
evidence/l1/<package-id>.json
evidence/l2/record.json
finalization/evidence/l3.json
```

Each record binds command/result, scope-qualified claim, `HEAD`/tree/status, authority identity, relevant non-secret fingerprints, attempts, and optional raw-output hash/path. Save raw output only for diagnosis, contractual inspection, or cross-session independent evidence. Do not create duplicate log, JSON, status, or manifest files for one command.

## Finalization and L3

Enter finalization only after all current milestones, milestone L2 checks, cleanup, and evidence records pass with no unresolved findings. Repository-wide L3 remains finalization-only.

Run the exact declared L3 commands fail-first. On success, write a reusable evidence record bound to clean HEAD, tree, and status before and after every command; exact commands and passing results; relevant tool/runtime versions; and relevant non-secret external hashes or identities, never secret values.

Then dispatch one mandatory final whole-change review from the recorded branch start through `HEAD`, including authority, manifest/milestones, commits, full diff, L1/L2/L3 evidence, known risk, and deferred live effects. The final gate has one initial pass, at most one consolidated correction round, and one closure re-review. The closure scope is accepted findings, fix diff, and regression evidence; unrelated non-Critical findings become deferred final-review risks. A confirmed Critical regression or false evidence may reopen the gate.

Run focused L1/L2 for accepted fixes. A source, test, build, dependency, command, base, or relevant environment change is **material invalidation**: rerun L3 once at the new clean state, then perform bounded closure review with the new diff, remaining risk, and new evidence. Read-only review alone does not invalidate L3.

Live effects occur only after passing L3 and final approval. Run post-effect smoke evidence, then invoke `finishing-a-development-branch`, which may reuse the exact matching L3 record.

## Red Flags

Never run parallel writers on overlapping paths, admit only part of a failed milestone, merge a native temporary branch, call L1/L2 repository-wide completion, run early L3, skip required review, use `HEAD~1` as the whole-branch base, store secrets in evidence, or execute live effects before the final gates.
