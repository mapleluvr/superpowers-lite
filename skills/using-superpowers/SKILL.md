---
name: using-superpowers
description: Use before substantive implementation or whenever a task needs classification as Micro, Standard, or Full so only the necessary workflow skills are loaded.
---

# Using Superpowers

## Loading Contract

Superpowers Lite is an on-demand skill pack. It does not inject this router or register tools. Classify before implementation, then load required skills through the host's native skill mechanism. Never assume that a tool named `Skill` exists.

Operational skills remain independently discoverable. Routes apply per task. Scoped workers follow the route and contract supplied by their controller.

## Router Rules

1. Inspect enough context to classify risk without starting implementation.
2. State the selected route and the concrete reason.
3. Load only the skills required by that route before acting.
4. Escalate immediately when new risk crosses a boundary. Never silently downgrade.

| Route | Typical work | Default process |
|---|---|---|
| **Micro** | Mechanical, local, non-behavioral | Inspect, change, focused validation |
| **Standard** | Bounded behavior or bug fix | Work in place, TDD when behavioral, self-review, scoped verification |
| **Full** | Cross-cutting, ambiguous, sensitive, concurrent, migratory, or externally consequential | Durable authority, milestones, isolation, bounded review, L0-L3 evidence |

## Micro

Use for comments, spelling, formatting, pure renames, or deterministic configuration changes with no behavior, interface, security, data, concurrency, deployment, or migration effect.

Use inspect -> change -> focused verification. Do not create a spec, plan, worktree, worker, or independent review. Any bug fix, condition, behavior, interface change, or uncertainty is at least Standard.

## Standard

Use for a local feature or reproducible bug with clear acceptance, bounded ownership, and no Full trigger.

Work in the current session and workspace. Do not create a persisted spec or plan, worktree, isolated worker, or independent review. Use TDD for behavior changes and bug fixes; otherwise use artifact-appropriate validation. Self-review, then verify the affected closure.

If isolation, worker dispatch, independent review, durable authority, or broader coordination becomes necessary, stop and escalate to Full before using it.

## Full

Full is feature-level assurance. Internal packages may be routine inline, protected contract, or isolated parallel; none weakens the route's final gates.

Use Full when any applies:

- The user explicitly requests Full.
- Product or architecture decisions are unresolved.
- Public/shared interfaces, security/privacy, persisted data, migrations, concurrency, distributed state, deployment, or irreversible effects change.
- The change is cross-cutting or has broad blast radius.
- Independent work, isolated workers, or protected-contract review is required.
- Acceptance, ownership, or verification boundaries remain uncertain.

Full uses, as applicable: `brainstorming`, `writing-plans`, `using-git-worktrees`, `executing-plans` or `subagent-driven-development`, `requesting-code-review`, `verification-before-completion`, and `finishing-a-development-branch`.

Missing isolation or worker capability falls back to one canonical inline writer; Full evidence and review never weaken. Independent final review has no self-review fallback: use a host-provided fresh-context reviewer or a named non-author human. If neither is available, Full is blocked before execution.

## Overrides

Explicit user instructions override route defaults, but not safety. Destructive or live effects still require clear authorization and fresh evidence. Always report the scope actually verified.
