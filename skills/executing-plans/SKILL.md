---
name: executing-plans
description: Use when approved Full work must execute a milestone inline
---

# Executing Plans

The approved Full feature run continues by reusing its manifest across continuation packages, corrections, and milestones; never create a new run. Require independent final-review capability before execution; otherwise stop.

## Load Manifest

Read `.superpowers/work/<run-id>/manifest.json`; verify authority, identity, history, risks, and finalization.

Exactly one current frontier is the milestone. Load its milestone JSON record, task cards, L0, package L1, milestone union L2, public entrypoint, controlled E2E, and deferred effects.

When `currentFrontier` is null, require `finalization.status` to be `ready`, all history completed or superseded, no blocked milestone or protected risk, and latest L2 bound to clean canonical state. Only then enter finalization; otherwise stop. Never fabricate or reopen a milestone.

## Execute Inline

Run current work packages in declared order, one writer, sequentially:

1. Obey task-card ownership and mutable resources.
2. Run L0 before package L1; failed or unavailable L0 stops for rederivation.
3. Keep internal TDD RED/GREEN inside the package, implement, run its exact declared package L1, inspect, and commit atomically.
4. Record only `package-local checks passed`; package L1 or internal GREEN cannot complete or prove the milestone. Stop on drift, hidden dependency, or invalid contract.

Run terminal milestone union L2 exactly once after all current packages, never between packages. It must exercise public entry or controlled E2E; report only `milestone affected closure passed` from clean state.

A missing command requires redesign, a harness, or final-integration deferral, never an early repository-wide suite. No package or intermediate milestone runs L3.

## Recovery

A hidden dependency invalidates the package map; stop and rederive this same current milestone. A local package defect stays in the same current milestone as a correction work package/round, never a new frontier. Two core-contract candidate failures force package re-decomposition or a contract/probe work package directly linked to the blocked public path.

## Finalization

From a finalization-ready manifest, require a valid L3 evidence record, mandatory whole-change Review, and material-invalidation handling before live effects. Then invoke `finishing-a-development-branch`.

Stop for stale identity, blockers, evidence, collisions, or approval. Never widen scope.
