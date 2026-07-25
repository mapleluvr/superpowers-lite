---
name: writing-plans
description: Use for Full-route work after durable authority is approved and before implementation begins
---

# Initializing a Milestone Execution Workspace

## Overview

Turn approved durable authority into one user-visible current milestone. The current runtime frontier is the milestone container: inspect current code and the complete public path first, then write derived runtime state, not a second durable specification. Do not promise or precompute later milestones, waves, frontiers, or a static feature graph.

**Announce at start:** "I'm using writing-plans to initialize the current execution milestone."

Create a Git-ignored workspace at `.superpowers/work/<run-id>/`. Do not write or commit a static implementation plan.

## Inputs and L0

Read the authority index, `intent.md`, and only relevant protected contracts. Bind their approved commit and hashes. Inspect current code and tests, confirm the clean base, and record available CI status plus exact focused results as a **selective baseline**. `unknown` is an honest CI value.

If authority is unapproved, inconsistent, or changed from the bound hash, stop. Derived execution state must not override or change durable authority. A product or protected-contract change returns for amendment; task decomposition does not amend authority.

### Legacy Safe-Boundary Bootstrap

An approved legacy spec or plan may initialize one new run only at an explicit safe boundary. Active legacy runs remain unchanged and are not migrated. Verify approval, clean restart state, and no in-flight effect; then bind the legacy path, approved commit, and hash identity to one run manifest as read-only authority input. Never copy, rename, or bulk-migrate it into new durable authority or task cards. If the run is active or the boundary is uncertain, stop and continue under the legacy workflow.

## Workspace

```text
.superpowers/work/<run-id>/
  manifest.json
  frontiers/
    F001-<slug>/
      frontier.md
      frontier.json
      tasks/
        T001.md
      handoffs/
      evidence/
        l0/
        l1/
        l2/
  finalization/
    evidence/
    reviews/
```

`manifest.json` is the sole runtime entry point. Record run/authority/base identity, exactly one current frontier, historical completed/blocked/superseded frontiers, canonical state, protected risks, and finalization status. Do not create a duplicate progress file.

## Select the Current Milestone

Trace the complete current-milestone path from the public entry point to its terminal observable result before decomposition. Choose the largest cohesive boundary that one writer can implement, self-review, and prove with package L1. Normally cluster two to four work packages in one to three execution rounds. These are package rounds inside the one current frontier, not new milestones: no later milestone is precomputed, and internal RED/GREEN iterations occur without creating another frontier.

The compatible current runtime frontier remains the milestone container. In addition to existing identity, ownership, resource, and gate fields, it records `acceptanceDelta`, `publicEntrypoint`, `terminalE2E`, `observableSuccess`, `consumedContracts`, `laterExclusions`, `workPackages`, and `plannedRoundCount`.

`frontier.md` answers:

1. Why now?
2. Which acceptance delta, public entrypoint, terminal E2E, and observable success close?
3. Which protected contracts are consumed and which later exclusions remain?
4. What assumptions must L0 disprove?
5. Inline or Parallel, and why?
6. What ends or invalidates this milestone?

`frontier.json` records base/authority identity, mode, task cards, ownership and mutable resources, exact L0/L1/L2, acceptance mappings, the milestone fields above, status, and invalidation reason. It contains no later milestone.

## Cohesive Work Packages

Cluster by co-change and semantic cohesion. Keep behavior together when it shares an acceptance path, transaction, state transition, fixture, failure model, or modules likely to change together. Split only when interfaces are stable, ownership/resources are separable, package L1 is independent, and separation improves rollback clarity or the critical path.

A package may span related production source and test files. Its task card remains the sole package-specific worker authority and records the milestone acceptance/public flow, consumed contracts, adjacent interfaces/tests, owned paths and mutable resources, exact L1, exclusions, and stop conditions. Internal RED/GREEN iterations belong inside that package without a new frontier.

## Decide Inline or Parallel

Parallel requires current evidence of:

- two or more independently mergeable packages, including enabling work that is not independently user-visible;
- frozen or stable interfaces or a completed contract spine, with no dependency path in the dispatched group;
- disjoint writes/paths and mutable resources, with no split transaction or recovery invariant;
- independent focused L1 checks;
- material critical path reduction after coordination cost, worktree cost, patch-admission cost, and milestone-L2 cost.

Record a qualitative decision and rationale, never a numeric score. When independence or benefit is unclear, choose Inline. Do not manufacture a DAG.

## Task Card

The task card is the sole package-specific worker instruction. It records:

```text
Observable outcome
Frozen base
Authority and contract hashes
Owned paths
Actual mutable resources
Consumes and produces
Controller-passed L0
Exact L1
Stop conditions
Handoff path
```

Do not copy the full authority or historical corrections. A hidden dependency returns `NEEDS_CONTEXT`; it does not widen ownership.

Before dispatch, verify references/hashes, one owner per mandatory path, no parallel path/resource overlap, focused L1 for each package, and a real public entry point or controller-owned terminal E2E probe for each acceptance delta. Worker self-report is not this proof.

## Evidence and Finalization Boundary

Default to one structured record for each milestone L0, package L1, milestone L2, and final L3 gate. L2 proves the integrated affected closure through the declared public entry point or controlled E2E. Raw output is optional unless diagnostic or contractually required. No package or milestone runs repository-wide L3; L3 remains finalization-only.

## Self-Review

Check authority identity, exactly one current frontier as a milestone container, all milestone fields, no predicted later milestone or static graph, complete package ownership/resource mapping, honest parallel independence and net benefit, exact focused commands, no placeholders, and finalization-only L3. Task decomposition does not amend authority. Fix derived-state defects inline; return authority defects to the user.

## Handoff

Offer SDD for a genuinely profitable independent Parallel package set or `executing-plans` for Inline. Both consume the same manifest, milestone frontier, task card, and evidence scopes. After completion the controller inspects the new canonical state and derives the next milestone.
