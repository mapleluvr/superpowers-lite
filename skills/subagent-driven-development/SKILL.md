---
name: subagent-driven-development
description: Use for Full-route work when a current dynamic milestone has isolated parallel packages
---

# Subagent-Driven Development

## Overview

Full is feature-level assurance across one approved Full feature run. Execute each milestone with cohesive packages, isolation, patch handoffs, verification, protected review, evidence, and mandatory final whole-change review. Packages are routine, protected, or parallel; tier never weakens Full assurance. Reuse same run manifest/root across packages, corrections, and later milestones; continuation never creates a new run.

## Route Gate

Use this skill only with approved durable authority and `.superpowers/work/<run-id>/manifest.json`; read it and verify authority, canonical state, history, risks, and finalization.

For frontier execution, exactly one current frontier is the milestone. Reuse the approved run manifest/root for later milestones; packages, corrections, and next milestones never create a new run. Load its records and task cards. When `currentFrontier` is null, require `finalization.status` to be `ready`, completed or superseded history, no blocked milestone or protected risk, and latest L2 bound to clean canonical state. If all pass, enter finalization. Otherwise a null current frontier is invalid: stop unless that finalization-ready state is proven. Never fabricate or reopen a milestone.

Parallel SDD requires at least two independently mergeable enabling work packages; they need not be independently user-visible. They require frozen consumed interfaces or a pinned contract, disjoint `owns` and exact `mutableResources`, independent package L1, no dependency path inside the same dispatched round, no split transaction, and critical-path benefit after coordination, worktree, patch-admission, and milestone-L2 cost. A dependency chain, shared mutable owner, unsplit invariant, or unclear benefit stays routine inline. Standard/Micro do not use SDD. Do not consume legacy plans, copied authority, or session history as execution authority.

Plan the current milestone as normally two to four packages in one to three rounds. Keep the same current milestone across package rounds; internal RED/GREEN never mints a new milestone or frontier.

## Pre-Flight

Before dispatch:

- confirm that a host-provided fresh-context reviewer or named non-author human reviewer is available for mandatory final Review; otherwise stop before L0 or fanout;
- verify run/milestone authority hashes, current `HEAD`, tree, and clean status;
- run L0 for the current milestone exactly as declared in its JSON record; record command, result, base, and milestone identity;
- failed or unavailable L0 means zero fanout: stop and rederive before dispatch;
- verify every task card, `owns` set, exact `mutableResources` identity, dependency, acceptance mapping, and declared package L1;
- defer settings, migrations, deploys, destructive cutovers, and other live effects.

Only after L0 passes, dispatch. Do not silently guess through a contradiction.

## Native Patch Milestone

For one current milestone, process planned rounds sequentially:

1. Freeze clean `MILESTONE_BASE` identity (commit, tree, empty status). A **single canonical integrator** owns the real checkout.
2. Before each round, freeze clean `ROUND_BASE`. Dispatch eligible packages concurrently, each in a host-provided isolated workspace; fail-fast scheduling is only an optimization.
3. Each implementer verifies manifest, milestone, `ROUND_BASE`, ownership, `mutableResources`, and passed L0; runs package L1 and self-review; then leaves owned changes for host-native patch capture. Temporary worker branches or workspaces may be destroyed after capture, so the handoff is a **patch**, not a branch merge.
4. Wait for every current-round worker and patch. A failed, blocked, missing, or unresolved worker stops the milestone; the round applies zero patches and recovery returns canonical to `MILESTONE_BASE`.
5. Before any patch from the current round is applied anywhere, preflight the complete round set: each patch is non-empty; changed paths are a subset of `owns`, including renames and deletions; write sets and exact `mutableResources` identities do not overlap; and `git apply --check` passes against unchanged `ROUND_BASE`. Any mismatch ultimately integrates zero milestone patches.
6. Complete bounded Review only for a named protected contract identity when required. Only impact-qualified Critical or Important findings block; unsupported severity labels become `defer` or `reject`. Routine packages have no independent Review.
7. Apply approved current-round patches in package order on canonical. After each apply, run its package L1, inspect the diff, and commit atomically. Conflict, path drift, resource collision, or contract mismatch triggers recovery, not ad-hoc surgery.
8. Continue the next round from new clean canonical state. After all rounds, run milestone union L2 once through the declared public entry or controlled E2E. Package L1 cannot prove milestone acceptance.
9. On a **post-apply L1 failure before commit**, reverse-apply only the current uncommitted patch, then revert every earlier current-milestone commit in reverse order without rewriting history.
10. On a **milestone union L2 failure after all milestone patches are committed**, do not reverse-apply any patch. Revert every current-milestone commit in reverse order without rewriting history.
11. For any recovery, stop on cleanup conflict; otherwise require clean status and the original `MILESTONE_BASE` tree before rederiving. Record commits and evidence only for a passing milestone.

No work package or intermediate milestone runs repository-wide L3.

## Protected Review and Implementer Dispatch

Independent Review only names a protected contract before dependent consumers or the final whole change; each identity has initial, correction, and closure. Never create an independent Review identity for an execution plan, routine package, evidence machinery/finalizer, readiness/admission/integration bookkeeping, or ordinary frontier/package transition; use controller self-review, Package checks, and Milestone closure. Migration, split, rename, role change, or correction cannot reset or create identity.

A package may be routine inline, protected contract, or isolated parallel. Routine packages use TDD, self-review, Package (L1), and Milestone (L2).

Pass artifact paths, not full authority/session history. Each task card names base, `owns`, `mutableResources`, controller-passed L0, milestone acceptance/public flow, package L1, interfaces, and report path. Implementers must not run L2, package/repository-wide, migration, deployment, settings, or live effects; report package-local evidence and concerns.

Treat statuses explicitly: `SOURCE_READY`, `DONE_WITH_CONCERNS`, `NEEDS_CONTEXT`, or `BLOCKED`. Only `SOURCE_READY` with a complete report and patch may enter complete-set preflight. Never turn a failed dispatch into implied approval.

## Dynamic Recovery and Evidence

A hidden dependency invalidates the package map; rederive the current milestone from canonical state. A local package defect stays in the same current milestone as a correction work package/round, not a new frontier. An invalid boundary preserves forensic history and rederives from clean base. Two rejected core-contract candidates force package re-decomposition or a contract/probe package linked to the blocked public path.

Use one structured record per gate by default. Human-facing labels are Baseline (L0), Package (L1), Milestone (L2), and Final (L3); retain `l0`/`l1`/`l2`/`l3` paths and `L0`/`L1`/`L2`/`L3` keys as compatibility aliases.

```text
evidence/l0/record.json
evidence/l1/<package-id>.json
evidence/l2/record.json
finalization/evidence/l3.json
```

Each record binds command/result, scope claim, `HEAD`/tree/status, authority, relevant non-secret fingerprints, attempts, and optional raw-output hash/path. Save raw only for diagnosis, contractual inspection, or cross-session evidence. Do not create duplicate log, JSON, status, or manifest files.

## Finalization and L3

Enter finalization only after all current milestones, milestone L2 checks, cleanup, and evidence records pass with no unresolved findings. Repository-wide L3 remains finalization-only.

Run the exact declared L3 commands fail-first. On success, write a reusable evidence record bound to clean HEAD, tree, and status before and after every command; exact commands and passing results; relevant tool/runtime versions; and relevant non-secret external hashes or identities, never secret values.

Then dispatch one mandatory final whole-change review from the recorded branch start through `HEAD`, including authority, manifest/milestones, commits, full diff, L1/L2/L3 evidence, known risk, and deferred live effects. The final gate has one initial pass, at most one consolidated correction round, and one closure re-review. The closure scope is accepted findings, fix diff, and regression evidence; unrelated non-Critical findings become deferred final-review risks. A confirmed Critical regression or false evidence may reopen the gate.

Run focused L1/L2 for accepted fixes. A source, test, build, dependency, command, base, or relevant environment change is **material invalidation**: rerun L3 once at the new clean state, then perform bounded closure review with the new diff, remaining risk, and new evidence. Read-only review alone does not invalidate L3.

Live effects occur only after passing L3 and final approval. Run post-effect smoke evidence, then invoke `finishing-a-development-branch`, which may reuse the exact matching L3 record.

## Red Flags

Never run parallel writers on overlapping paths, admit only part of a failed milestone, merge a native temporary branch, call L1/L2 repository-wide completion, run early L3, skip required review, use `HEAD~1` as the whole-branch base, store secrets in evidence, or execute live effects before the final gates.
