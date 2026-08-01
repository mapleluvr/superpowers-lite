---
name: brainstorming
description: "Use this skill for Full-route work, substantive design decisions, or explicit brainstorming requests. Explores user intent, requirements, and design before implementation."
---

# Brainstorming Ideas Into Durable Authority

Use this skill for Full-route work, unresolved product or architecture choices, or an explicit brainstorming request. For Full execution, check authority sufficiency before opening design questions. When already approved authority is sufficient, reuse and bind it, then invoke writing-plans without reapproval. When an approved Full feature run already has an active manifest, bind and reuse the same run for the next milestone; a package, correction, or later milestone must not initialize a new run root. A new run is only for a distinct feature or authority, or an explicit safe-boundary restart. An explicit brainstorming request still explores the requested subject rather than silently taking that fast path. When decisions are unresolved or authority is missing, collect them in one consolidated decision packet where possible.

Understand the current project and resolve only missing product or protected-contract decisions. The output is minimal durable authority: what must be true and what must not change. Runtime task decomposition belongs to writing-plans and SDD.

<HARD-GATE>
Do NOT invoke an implementation skill, write code, scaffold, or take implementation action while product, architecture, or protected-contract decisions remain unresolved. When existing authority is sufficient, bind it and invoke writing-plans without repeated design approval.
</HARD-GATE>

## Checklist

1. **Check context and authority sufficiency** - inspect files, docs, recent commits, and approved authority for observable outcomes, acceptance IDs, constraints, protected contracts, and effect authorization.
2. **Ask only unresolved questions** - establish missing purpose, constraints, or observable success and consolidate related decisions into one decision packet when possible.
3. **Compare viable approaches when needed** - explain trade-offs and recommend one for a remaining decision.
4. **Present new or amended design** - scale detail to risk and obtain approval for the newly resolved authority.
5. **Write or amend durable authority** - use `docs/superpowers/work/<feature>/`.
6. **Self-review** - remove placeholders, ambiguity, contradictions, and implementation leakage.
7. **Commit authority** - commit only newly approved durable documents.
8. **User reviews written authority** - after an amendment, apply requested corrections and reconfirm; do not reapprove sufficient existing authority.
9. **Transition** - invoke writing-plans to initialize the current ignored workspace/frontier.

**The terminal state is invoking writing-plans.** Do not invoke another implementation skill first.

## Collaborative Design

- Start from current code and existing conventions.
- Decompose a request into separate durable objectives only when the outcomes can stand independently. Do not predict implementation tasks.
- Prefer one multiple-choice question when it makes the decision easier; otherwise ask one open question.
- Cover architecture, data flow, error behavior, and verification only to the depth needed to make product or protected-boundary decisions.
- Keep one transactional invariant together.
- Improve existing structure only where it serves the requested outcome.

## Durable Authority Shape

```text
docs/superpowers/work/<feature>/
  README.md
  intent.md
  contracts/       # only when needed
  decisions/       # only when needed
```

`README.md` indexes authority status, intent, contracts, decisions, and any superseding authority. It does not track execution progress.

`intent.md` contains:

- intent and user-observable outcome;
- acceptance entries with a stable ID or stable identifier;
- hard constraints;
- non-goals;
- protected invariants;
- authorization boundaries for live or destructive effects.

Durable intent must exclude task lists, DAGs, waves, speculative implementation paths, model/reviewer allocation, evidence filenames, and predicted parallel boundaries. Exact paths belong only when the path itself is a user-granted closed scope or protected boundary.

Create a contract only when a public/shared API, security boundary, migration, data format, or concurrency/ordering invariant must remain stable for consumers. State observable semantics, compatibility, and invalidation; do not prescribe ordinary implementation.

Create a decision record only when multiple reasonable choices exist, the choice constrains future work, and final code will not preserve the reason.

## Contract and Effect Safety

A protected contract may receive one risk-triggered independent review before consumers begin. Routine durable authority uses self-review plus user approval, not automatic reviewer fan-out.

Use additive or versioned compatibility when old consumers remain active. Live cutover, destructive removal, migration execution, or deployment waits for finalization evidence and approval.

## Self-Review

Check:

1. every acceptance entry is observable and has a stable identifier;
2. constraints, non-goals, protected invariants, and effect authorization are consistent;
3. a separate contract exists only where consumer stability requires it;
4. no implementation task, path guess, DAG, wave, model allocation, or evidence layout leaked into authority;
5. no TODO, TBD, contradiction, or ambiguous requirement remains.

Fix document defects inline. If the product decision is unresolved, return to the user rather than filling the gap with implementation detail.

After writing or amending authority, ask the user to review it. On approval invoke writing-plans, which initializes `.superpowers/work/<run-id>/` and only its current frontier. When authority was already sufficient, bind it and transition directly without another approval gate.

## Visual Companion

Offer the visual companion only when the next decision is genuinely clearer as a mockup, layout, comparison, or architecture diagram. Make the offer in its own message and wait. After acceptance, still use it only for visual questions; use text for requirements and conceptual trade-offs. For detailed operation read `skills/brainstorming/visual-companion.md`.
