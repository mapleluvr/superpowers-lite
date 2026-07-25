# Milestone Execution Contract

## Contract Boundary

This contract is consumed by Full routing, brainstorming, workspace initialization, Inline execution, parallel SDD, Review, verification, and documentation. It changes execution decomposition, not product authority or final assurance.

## Assurance and Execution Tiers

`Full` is a feature-level assurance classification. It requires approved authority, protected invariants, finalization L3, final whole-change Review, and effect approval where applicable.

Every current-milestone work package uses one execution tier:

- **Routine inline:** cohesive low-risk implementation under one writer, TDD/self-review, and package L1; no independent package Review.
- **Protected contract:** a shared public, security, privacy, migration, persistence, concurrency, ordering, or irreversible boundary whose readiness must be stable before dependent consumers. It may use one bounded protected-contract Review unit.
- **Isolated parallel:** independently mergeable packages under frozen interfaces with disjoint ownership/resources, independent package L1, and net critical-path benefit. It uses native patch handoff and existing SDD admission/recovery.

The package tier does not change the feature's Full finalization obligations.

## Authority Sufficiency

Before opening design questions, the controller checks whether approved authority already supplies observable outcomes, acceptance IDs, constraints, protected contracts, and effect authorization. If sufficient, bind its commit/hashes and continue. If insufficient, ask only the unresolved product or protected-contract decisions, preferably in one consolidated packet, then amend and approve authority.

Existing authority is not re-approved merely because execution representation changes.

## Milestone Shape

One current runtime frontier acts as the milestone container and remains current across its package rounds. It records, in addition to existing identity, ownership, resource, and gate fields:

```text
acceptanceDelta
publicEntrypoint
terminalE2E
observableSuccess
consumedContracts
laterExclusions
plannedRoundCount
workPackages[].id
workPackages[].executionTier
workPackages[].round
workPackages[].taskCard
```

`plannedRoundCount` is an integer from one through three. Every `workPackages` entry binds one package ID, execution tier, round in that range, and task-card path. Each package appears once and every declared round contains at least one package.

A milestone is valid only when its terminal evidence can move an approved acceptance ID through a real public command, API, user workflow, or controlled effect. An internal capability may be a milestone only when it is itself a necessary shared protected contract with named consumers.

No later milestone is precomputed.

## Work-Package Decomposition

Trace the complete current-milestone path from public entry to result/effect before dispatch. Cluster work by co-change and semantic cohesion.

Keep behavior together when it shares an acceptance path, transaction, state transition, fixture, failure model, or modules likely to change together. Split when interfaces are stable, ownership/resources are separable, L1 is independent, and separation improves rollback clarity or critical path.

A package may span related production and test files. Its writer receives a wide but curated context packet containing milestone acceptance, the public flow, consumed contracts, adjacent interfaces/tests, ownership/resources, exact L1, exclusions, and stop conditions. It performs internal RED/GREEN loops without creating new frontiers.

Task cards remain the sole package-specific worker authority.

## Bounded Milestone Lookahead

Plan only the current milestone, normally as two to four packages and one to three rounds:

```text
Round 1: protected capability and independent enabling packages
Round 2: public integration and terminal controlled E2E
Round 3: one unavoidable remaining dependency layer when needed
```

The package-to-round mapping is complete before dispatch; dependencies may cross rounds but never exist inside a parallel dispatched group. These counts shape planning; this contract defines no Leave-Undo or automatic action when a milestone stalls. A stalled state requires an explicit process decision and cannot silently rename or extend itself.

## Parallel Predicate

Parallel execution requires all of:

- at least two independently mergeable packages;
- immutable or frozen consumed interfaces;
- no dependency path inside the dispatched group;
- disjoint writes and exact mutable-resource identities;
- independent package L1;
- no split transaction or recovery invariant;
- expected critical-path savings greater than worktree, coordination, patch-admission, and milestone-L2 cost.

A package need not be independently user-visible. Unclear independence or benefit remains Inline.

## Verification

- **L0:** proves current milestone identities, assumptions, package ownership/resources, interfaces, and executable gate availability before dispatch.
- **Package L1:** proves the cohesive package on its owned source state.
- **Milestone L2:** proves the integrated affected closure and invokes the declared public entry or controlled E2E.
- **Final L3:** proves the repository-wide finalization command set on a clean state.

A milestone cannot complete from package L1 alone. Evidence reuse requires exact identity and original scope.

## Review Units

Independent Review is limited to:

1. a named protected contract before dependent work when independent readiness judgment is material;
2. the mandatory final whole change.

Each identity has one initial pass, at most one consolidated correction, and one closure pass. Reviewer, Oracle, analyst, readiness, admission, migration, and adjudication calls consume that same identity-bound budget when they decide readiness or mandatory rework.

Routine packages and ordinary milestone integration use self-review, L1, and L2. A migration, package split, frontier slug, or correction does not create a new Review unit.

## Compatibility

The existing `manifest.json`, `currentFrontier`, `frontier.json`, and task-card paths remain compatible. Milestone fields are additive. Legacy runs migrate only through the temporary migration guide at a safe boundary; active runs keep their current workflow.

Existing patch admission, zero-partial-integration, recovery, finalization, L3 reuse, and live-effect rules remain unchanged.

## Explicit Exclusion

This contract does not implement Leave-Undo, automatic abandonment, automatic rollback after a round count, or a feature-wide static DAG.
