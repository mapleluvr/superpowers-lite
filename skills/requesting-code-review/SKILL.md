---
name: requesting-code-review
description: Use when completing risk-gated work, closing reviewer findings, or entering a mandatory final Full review
---

# Requesting Code Review

Use independent Review as a bounded gate, not an open-ended improvement search.

**Core principle:** one declared identity, one impact-qualified finding list, one bounded closure.

## Route-Aware Review

- **Micro:** no independent review. Focused verification is still mandatory.
- **Standard:** no independent review. Use self-review and scoped verification. If a shared/public contract, broad blast radius, ambiguous acceptance, sensitive evidence, or explicit review request requires an independent gate, escalate the task to Full before dispatching it.
- **Full:** mandatory final whole-change Review; non-final Review only for a named protected contract identity unsafe for dependent work.

Routine packages have no independent Review; use self-review, package L1, milestone L2, and final Review.

An independent reviewer is either a host-provided fresh-context reviewer or a named human reviewer who did not author the change. Resolve that capability before Full execution. If neither is available, stop and report that Full cannot complete on the current host. Controller self-review cannot replace or consume the mandatory independent pass.

## Review Budget

Any agent deciding readiness, admission, acceptance, mandatory rework, or integration shares that identity's same bounded Review budget, whether named Reviewer, Oracle, analyst, or adjudicator. Calls in one packet form one pass; an outside adjudication consumes the next pass.

A Full identity is a named protected contract or final whole change. Migration, split, rename, correction, or role change must not reset its budget or create a new identity.

Every protected-contract or final whole-change identity permits:

1. **One initial review** against acceptance and protected boundaries.
2. **One consolidated correction** when blockers are accepted.
3. **One closure review** of initial findings, exact fix diff, and adjacent regressions.

Send one packet per pass. When multiple perspectives are required, combine them in one packet and synthesize one finding list; do not serialize spec, privacy, test-quality, or style gates.

After closure, record new non-Critical fix-unrelated findings as deferred final-Review risk. Reopen only for Critical regression, false disposition evidence, or explicit route escalation.

## Blocking-Finding Contract

A finding blocks only when it includes:

- `Critical` or `Important` severity;
- an `acceptanceId` or named protected boundary;
- a concrete failure scenario or reproducible evidence;
- affected observable behavior, data integrity, security/privacy property, public/shared contract, or irreversible effect;
- why it cannot be deferred to declared L2, L3, or final review;
- a bounded remediation target inside current ownership.

`Critical` means an exploitable security/privacy failure, data loss or corruption, duplicate irreversible effect, unrecoverable lifecycle state, or release-blocking public-contract failure.

`Important` means a material supported-scenario failure, explicit acceptance failure, or recovery/integrity defect that affects users or invalidates a required gate. Test completeness, speculative vectors, preferred refactors, wording, metadata polish, and documentation suggestions are non-blocking unless the reviewer proves that impact contract.

Reviewer labels are advisory. The controller owns disposition against the approved spec and records each finding as `fix`, `defer`, or `reject` with technical evidence. Deferring or rejecting an unsupported finding is not skipping verification.

## Re-Review Scope

A closure request supplies:

- initial finding IDs and controller dispositions;
- exact new diff or changed paths;
- focused evidence for every accepted fix;
- adjacent regression evidence, new evidence, and remaining risk.

The closure reviewer checks that scope only. It must not rediscover the whole task or add unrelated acceptance requirements. A new finding is admissible only when caused by the fix, Critical, or proof that an earlier disposition relied on false evidence.

## Review Packet

Record exact `BASE_SHA` and `HEAD_SHA`; final review uses the branch start, not a relative one-commit shortcut. Include:

- Review identity: named Full protected contract identity or final whole change;
- current task card when present;
- approved authority and authority acceptance IDs;
- protected boundaries and known risk;
- exact diff and evidence paths appropriate to the gate;
- pass number: `initial` or `closure`;
- controller disposition for closure findings;
- for closure, the frozen scope above.

Use [code-reviewer.md](code-reviewer.md) as the reviewer template.

## Acting on Feedback

1. Reproduce or inspect each proposed blocker.
2. Map it to the blocking-finding contract.
3. Record controller disposition as `fix`, `defer`, or `reject` before editing.
4. Make one consolidated correction for accepted blockers.
5. Run focused evidence, then the single closure review.

Critical findings block when confirmed. Only an impact-qualified Important finding may block; severity text alone never does.

## Workflow Integration

- **Subagent-Driven Development:** bounded review only at declared risk boundaries; one mandatory final whole-branch review.
- **Executing Plans:** same budget and frozen closure scope.
- **Standard:** self-review and scoped verification only; escalate to Full before requesting independent Review.

Never skip a required final review, ignore a confirmed Critical issue, let a reviewer silently expand acceptance, or start a third non-final review pass to chase non-Critical improvements.
