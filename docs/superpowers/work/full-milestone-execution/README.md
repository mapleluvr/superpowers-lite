# Full Milestone Execution

**Status:** Approved
**Approved:** 2026-07-25

This authority refactors the internal execution granularity of the Full route. Full remains the feature-level assurance boundary, while implementation advances through user-visible milestones and cohesive work packages.

## Authority

- [Intent](intent.md)
- [Milestone execution contract](contracts/milestone-execution.md)
- [Temporary migration guide](../../migrations/2026-07-25-temporary-full-milestone-workflow-migration.md)

## Scope

This authority supersedes Full guidance that optimizes for the smallest independently verifiable frontier, requires independently user-useful outcomes for every parallel package, or treats a renamed frontier as a new Review budget.

It preserves durable authority, L0-L3 verification, patch admission and recovery, protected-contract Review, final whole-change Review, and live-effect approval.

## Runtime Status

Execution progress belongs only in the ignored `.superpowers/work/<run-id>/` manifest and current milestone. This index does not track tasks, evidence, or completion state.
