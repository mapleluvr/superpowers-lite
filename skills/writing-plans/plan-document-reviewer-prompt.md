# Current Milestone Review Prompt

Routine milestone derivation uses controller self-review. This prompt is not an independent Review identity: do not dispatch execution-plan or readiness Review for routine work. Use an independent reviewer only when a named protected-contract readiness decision already has Review budget; the call counts as a Review pass.

```text
Review [RUN_MANIFEST] and its current frontier milestone container read-only against [AUTHORITY_DIR]. Do not plan later work.

Block only when:
- the authority commit/hash is missing, stale, or unapproved;
- manifest does not identify exactly one current frontier;
- the milestone omits `acceptanceDelta`, `publicEntrypoint`, `terminalE2E`, `observableSuccess`, consumed contracts, later exclusions, cohesive `workPackages`, or `plannedRoundCount`;
- a package lacks a unique ID, execution tier, in-range round, or task-card mapping, or a declared round is empty;
- current ownership or mutable resources overlap;
- a mandatory acceptance/path lacks an owner, real entry point, or focused command;
- Parallel lacks demonstrated independence or net benefit;
- a later milestone is predicted or a static DAG predicts later tasks/waves/frontiers;
- derived state changes durable authority;
- L2 is fake affected closure or L3 appears before finalization;
- a hidden dependency, placeholder, or invalidation is ignored.

Output:
## Milestone Review
**Status:** Approved | Issues Found
**Issues:** [acceptance ID/task, defect, execution consequence]
**Recommendations:** [non-blocking only]
```
