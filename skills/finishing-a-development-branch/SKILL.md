---
name: finishing-a-development-branch
description: Use when implementation is complete on any route and the current branch or workspace needs an explicit decision to merge, open a pull request, remain in place, or handle a separately requested discard.
---

# Finishing a Development Branch

## Overview

**Core principle:** Verify route-appropriate evidence -> detect environment -> present safe options -> execute the user's choice -> clean up only owned workspaces.

## Step 1: Verify Completion Evidence

Use the route declared for the current task. If no route was declared, classify the completed change with `using-superpowers` before continuing.

- **Micro:** require fresh focused validation that directly demonstrates the mechanical result.
- **Standard:** require fresh scoped verification of the affected closure, including the regression test for a bug fix or behavior change.
- **Full:** locate the finalization L3 evidence record. It is reusable only when it passed and still matches exact `HEAD` and tree identity, recorded clean/dirty state and current status, exact L3 commands and passing results, tool/runtime versions, and relevant non-secret external config hashes or environment fingerprints.

Micro and Standard do not invent an L3 record, frontier, or persisted plan. Bind their evidence to the current changed paths and repository state. If required evidence is missing or failed, run it now; stop before offering integration options when it cannot pass.

For Full, never record secret values. Re-read current state instead of trusting record metadata. Pure read-only review does not invalidate matching evidence. Run the exact finalization L3 command set and write a fresh record when evidence is missing or failed, or any bound field changed. A material source, test, build, dependency, or environment repair first needs the current milestone's focused L1/L2, a commit, and a new clean state; then run replacement L3.

## Step 2: Detect Environment

Capture workspace identity before any later directory change:

```bash
GIT_DIR=$(cd "$(git rev-parse --git-dir)" 2>/dev/null && pwd -P)
GIT_COMMON=$(cd "$(git rev-parse --git-common-dir)" 2>/dev/null && pwd -P)
WORKTREE_PATH=$(git rev-parse --show-toplevel)
FEATURE_BRANCH=$(git symbolic-ref --short -q HEAD || true)
```

| State | Menu | Cleanup |
|---|---|---|
| Normal repository | Standard 3 options | None |
| Named-branch worktree | Standard 3 options | Provenance-based |
| Detached-HEAD workspace | Reduced 2 options | Host-owned; preserve |

## Step 3: Determine Base Branch

Use approved authority, the conversation, branch upstream, or fork-point evidence. If the base remains uncertain, ask the user to confirm the best-supported candidate before merging or discarding a named branch.

## Step 4: Present Options

For a normal repository or named-branch worktree, present exactly:

```text
Implementation complete. What would you like to do?

1. Merge back to <base-branch> locally
2. Push and create a Pull Request
3. Keep the branch as-is (I'll handle it later)

Which option?
```

For detached HEAD, present exactly:

```text
Implementation complete. You're on a detached HEAD (externally managed workspace).

1. Push as new branch and create a Pull Request
2. Keep as-is (I'll handle it later)

Which option?
```

Discard is never a menu option. It exists only in response to an explicit user request. Wait for the integration decision.

## Step 5: Execute Choice

### Option 1: Merge Locally

```bash
MAIN_ROOT=$(git -C "$(git rev-parse --git-common-dir)/.." rev-parse --show-toplevel)
cd "$MAIN_ROOT"
git checkout <base-branch>
git pull
git merge "$FEATURE_BRANCH"
```

The merge invalidates pre-merge evidence. On the merged target, rerun the same route's completion evidence: focused validation for Micro, affected-closure verification for Standard, or the exact finalization L3 command set for Full. If merged-target evidence fails, stop with the feature branch and any worktree intact. Only after it passes, perform Step 6 and delete the feature branch with `git branch -d "$FEATURE_BRANCH"`.

### Option 2: Push and Create a Pull Request

```bash
git push -u origin "$FEATURE_BRANCH"
# Detached HEAD: git push origin HEAD:refs/heads/<new-branch>
```

Create the pull or merge request against the confirmed base using the forge's available mechanism and repository template. Report its URL. Preserve the worktree for review feedback.

### Option 3: Keep As-Is

Report the branch and full workspace path. Preserve both.

### Explicit Discard Request

Only after the user explicitly asks to discard, show the branch or detached commit, commits, and workspace that will be permanently deleted, then require the exact confirmation `discard`.

For a normal repository (`GIT_DIR == GIT_COMMON`), the feature branch is currently checked out. After confirmation, switch away before deletion:

```bash
git checkout <base-branch>
git branch -D "$FEATURE_BRANCH"
```

For a named-branch worktree, change to the main repository root, perform Step 6 to remove the captured feature worktree, then run `git branch -D "$FEATURE_BRANCH"`.

For a host-owned or detached workspace, there may be no named branch and the package does not own cleanup. After confirmation, use a host-provided workspace-disposal mechanism when one exists; otherwise stop and leave the workspace intact rather than guessing.

## Step 6: Cleanup Workspace

Run only after a successful local merge or confirmed discard. Use `GIT_DIR`, `GIT_COMMON`, and `WORKTREE_PATH` captured in Step 2.

- If `GIT_DIR == GIT_COMMON`, there is no worktree to remove.
- If `WORKTREE_PATH` is under repository-local `.worktrees/` or `worktrees/`, remove exactly that owned worktree from outside it, then run `git worktree prune`.
- Otherwise the host owns the workspace. Leave it in place or use a host-provided workspace-exit mechanism.

Never recompute `WORKTREE_PATH` after changing to the main repository.

## Red Flags

Never proceed with stale or failed route evidence, merge into an unconfirmed base, offer discard as a routine option, delete without exact confirmation, delete the currently checked-out branch, force-push without explicit authorization, remove a worktree from inside itself, or clean up a host-owned workspace. Options 2 and 3 always preserve the worktree.
