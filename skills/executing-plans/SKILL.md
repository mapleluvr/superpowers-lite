---
name: executing-plans
description: Use when approved Full work must execute the current dynamic milestone inline in this session
---

# Executing Plans

Execute Full inline. Use `subagent-driven-development` for profitable parallel packages.

## Load Manifest

Read `.superpowers/work/<run-id>/manifest.json`; verify authority, canonical identity, history, risks, and finalization.

Exactly one current frontier is the milestone. Load its Markdown and JSON records, task cards, L0/package L1/milestone union L2, public entrypoint, terminal controlled E2E, and deferred effects.

When `currentFrontier` is null, require `finalization.status` to be `ready`, all history completed or superseded, no blocked milestone or protected risk, and latest L2 bound to clean canonical state. Only then enter finalization; otherwise stop. Never fabricate or reopen a milestone.

## Execute Inline

Run current work packages in declared order, sequentially in one writer:

1. Obey task-card ownership and mutable resources.
2. Run L0 before any package L1; failed or unavailable L0 stops for rederivation.
3. Keep internal TDD RED/GREEN inside the cohesive package, implement, run its exact declared package L1, inspect, and commit atomically.
4. Record only `package-local checks passed`; package L1 or internal GREEN cannot complete or prove the milestone. Stop on drift, hidden dependency, or invalid contract.

Run the terminal milestone union L2 exactly once after all current work packages, never between work packages. It must exercise the declared public entry or controlled E2E; report only `milestone affected closure passed` from clean state.

A missing focused command requires redesign, a focused harness, or final-integration deferral, never an early repository-wide suite. No work package or intermediate milestone runs L3.

## Recovery

A hidden dependency invalidates the package map; stop and rederive this milestone. A local package defect stays in the current milestone as a correction work package/round, never a new frontier. Two core-contract candidate failures force package re-decomposition or a contract/probe work package directly linked to the blocked public path.

## Finalization

From a proven finalization-ready manifest, run or reuse a valid L3 evidence record, mandatory final whole-change review, and material-invalidation handling before live effects. Then invoke `finishing-a-development-branch`.

Stop for stale identity, blockers, unavailable evidence, ownership collision, or decisions requiring approval. Never widen scope to continue.
