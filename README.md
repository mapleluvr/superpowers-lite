# Pi Superpowers Lite

A Pi-native, risk-proportional fork of Superpowers. It keeps the 14 upstream
skill names and the complete Full workflow while making smaller work use Micro
or Standard Inline by default.

The package is pinned to `obra/superpowers` v6.1.1. See [UPSTREAM.md](UPSTREAM.md)
for provenance, file classifications, and synchronization rules.

## Installation

Install this package instead of both `obra/superpowers` and
`pi-superpowers-support`. Do not load the old packages beside Lite: both expose
Superpowers bootstrap or compatibility tools and can conflict before startup
finishes.

Install the Git package:

```bash
pi install git:github.com/mapleluvr/pi-superpowers-lite
```

Pin a release tag or commit by appending `@<ref>`. For local development, pass
an absolute or relative checkout path to `pi install` instead. Keep
`pi-subagents` installed when Full workflows need independent execution or
review; it is an optional companion, not a runtime dependency of this package.
Reload Pi after changing package settings.

## Routes

- **Micro** is only for explicit, local, reversible mechanical work with no new
  behavior. It uses inspect, change, and focused verification without a spec,
  plan, worktree, subagent, or independent review.
- **Standard** handles clear local behavior and bug fixes inline. It records
  Intent, Constraints, Acceptance, and Risk in the conversation, uses
  proportional tests or TDD, and always verifies completion.
- **Full** is triggered by unresolved design, shared contracts, persistence,
  security or privacy, concurrency or distributed state, destructive work,
  coordination, or an explicit user request. It preserves approved durable
  authority and feature-level assurance while deriving user-visible milestones,
  cohesive work packages, isolated execution when beneficial, protected-contract
  review, final whole-change review, and branch completion.

A user may request a route. New risk can escalate a task, but the workflow never
silently downgrades after implementation starts. Verification is mandatory on
all routes.

## Full Workflow at a Glance

Full is feature-level assurance with proportional package execution:

```text
reuse or approve durable authority
  -> derive one user-visible milestone
  -> execute 2-4 cohesive packages over 1-3 sequential rounds
  -> run package L1 and one public-entry milestone L2
  -> derive the next milestone from the new canonical state
  -> run finalization-only L3 and final whole-change Review
```

Rounds may depend on earlier rounds; parallel packages inside one round must be
independent. Routine packages use self-review and L1/L2. Only a named protected
contract receives non-final Full Review. A stalled milestone has no automatic
Leave-Undo, discard, revert, rename, or budget extension. Existing runs switch
only at an explicit safe boundary through the [temporary migration guide](docs/superpowers/migrations/2026-07-25-temporary-full-milestone-workflow-migration.md).

## Durable Authority and Dynamic Frontiers

The [Full milestone-execution authority](docs/superpowers/work/full-milestone-execution/README.md)
refines the [progressive SDD workspace design](docs/superpowers/specs/2026-07-22-progressive-sdd-workspace-design.md):

```text
docs/superpowers/work/<feature>/   # intent, protected contracts, durable decisions
.superpowers/work/<run-id>/        # ignored manifest, current milestone, packages, evidence
```

Durable authority records observable intent, acceptance, hard constraints,
non-goals, protected invariants, and live-effect boundaries. Reuse sufficient
approved authority instead of restarting section-by-section approval. Explicit
brainstorming requests and unresolved product or architecture decisions still
use the approval gate.

Full is the feature assurance level; it does not force every internal package to
use Full ceremony. `writing-plans` traces one public path and initializes one
user-visible milestone in the existing `currentFrontier` compatibility container.
The milestone names its acceptance delta, public entrypoint, terminal controlled
E2E, planned round count of one to three, and two to four cohesive work packages.
It plans no later milestone and no feature-wide static DAG.

Choose the largest cohesive boundary that fits one controller round: a complete
data flow, transaction, or one to two tightly coupled state machines. Package
execution tiers are Standard for routine internals, Protected for a named public,
security, migration, persistence, or concurrency contract, and Parallel for
independently mergeable enabling work packages with stable interfaces, disjoint
writes and exact mutable resource identities, independent L1, and clear net
benefit. Enabling packages need not be independently user-visible.

Each package receives one task card with its round base, authority hashes,
acceptance ID, owned paths, exact resources, interfaces, passed L0, exact L1,
stop conditions, and handoff path. Internal RED/GREEN loops remain inside that
package; they do not create new frontiers. A local defect creates a correction
package or round inside the same milestone. A hidden dependency invalidates the
package map and requires an explicit milestone decision; it does not silently
widen a card.

Native parallel work uses isolated `worktree: true` workers and patch handoff.
Freeze one `MILESTONE_BASE` for recovery, then a clean `ROUND_BASE` before each
sequential round; packages inside that round may execute concurrently. Before
any round patch is applied, the controller preflights the complete round set.
A failed worker, ownership drift, resource collision, or failed check ultimately
integrates zero milestone patches. On post-apply L1 failure, recovery reverses
the current uncommitted patch and reverts prior milestone commits. On milestone
L2 failure after all patches are committed, recovery reverts those commits
without reverse-applying a patch, restoring the exact `MILESTONE_BASE` tree.

Verification stays fail-first: L0 proves dispatch prerequisites, package L1
proves one work package, milestone L2 proves the integrated affected closure and
runs the public entrypoint or controlled E2E, and finalization-only L3 runs the
repository-wide suite. Use exact scope labels:

- L1: `package-local checks passed`
- L2: `milestone affected closure passed`
- L3: `repository-wide suite passed`

A clean state-bound L3 record may be reused until code, commands, dependencies,
or the recorded environment changes. The earlier [fail-first execution design](docs/superpowers/specs/2026-07-19-fail-first-wave-execution-design.md)
remains the patch-admission and recovery foundation where the milestone authority
does not override it. Legacy specs and plans remain compatible inputs only at an
explicit safe-boundary restart; use the [temporary migration guide](docs/superpowers/migrations/2026-07-25-temporary-full-milestone-workflow-migration.md).
Existing runs are not migrated automatically. This workflow defines no automatic
Leave-Undo, discard, revert, or round-budget extension for a stalled milestone.

## Pi Runtime

The package registers one Pi extension and one skill tree. The extension:

- injects one compact compatible bootstrap per active context;
- re-enables injection after compaction without duplicating an existing marker;
- exposes `Skill({ skill })` using only Pi's resolved native skill list;
- exposes in-session `TodoWrite`, `/todos`, and `/todo-clear`;
- warns once when Pi resolves `using-superpowers` from another package root.

The package does not scan Git checkouts, npm packages, settings, or project
folders independently.

## Review Convergence

Reviews are bounded risk gates, not open-ended improvement loops. Standard may
review one named risk boundary when independent judgment is material. In Full,
routine packages have no independent Review: use self-review, package L1,
milestone L2, and final whole-change Review. A named protected contract may
receive one initial pass and one closure pass before dependent work begins.

A blocking finding must name an acceptance or protected boundary, show a
reproducible failure, identify material behavior, data, security, privacy, or
public-contract impact, and explain why it cannot wait for L2, L3, or final
Review. Test completeness, speculative vectors, wording, metadata, and style
suggestions are deferred unless that impact is demonstrated.

Closure Review is limited to the original findings, fix diff, adjacent regression
evidence, and controller dispositions. Any readiness, admission, acceptance,
mandatory-rework, or integration adjudication uses the same Review identity and
budget regardless of agent name. Migration, package splitting, correction,
renaming, or role changes cannot reset it. Full retains one final whole-change
initial Review, at most one consolidated correction round, and one closure pass.
The design contract is [review convergence](docs/superpowers/specs/2026-07-22-review-convergence-design.md).

## Verification

```bash
npm test
npm run typecheck
npm run upstream:check -- --source <upstream-checkout>
```

`npm test` covers structure and references, the pinned sync tool, extension
lifecycle and failure paths, route and skill contracts, Pi tool references, and
the behavioral report validator. Generated evaluation reports under
`evals/results/` are local evidence and are not committed.

## Upstream Synchronization

Synchronization is offline and requires an explicit checkout of the exact
pinned commit:

```bash
npm run upstream:check -- --source <upstream-checkout>
npm run upstream:sync -- --source <upstream-checkout>
```

`sync` updates only files classified `unchanged`. Changes to `lite-modified` or
`pi-adapted` files require manual reconciliation and manifest regeneration.

## Rollback

Remove Lite and, when needed, restore the official upstream package while
leaving unrelated packages and `pi-subagents` unchanged:

```bash
pi remove git:github.com/mapleluvr/pi-superpowers-lite
pi install https://github.com/obra/superpowers
```

Reload Pi and use `pi list` to confirm that only the intended Superpowers
package is active.

## License

MIT. See [LICENSE](LICENSE). Upstream attribution and the pinned source identity
are recorded in [UPSTREAM.md](UPSTREAM.md).
