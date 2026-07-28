# Upstream Provenance

Superpowers Lite is derived from
[`obra/superpowers`](https://github.com/obra/superpowers).

## Pinned Snapshot

- Repository: `https://github.com/obra/superpowers`
- Tag: `v6.2.0`
- Commit: `3dcbd5c4b48e02263fbf4a3c01e3fe4f81d584d9`

Only the upstream `skills/` tree is in scope. Host extensions, plugin adapters,
marketplace metadata, and upstream test harnesses are not part of this skill
pack.

## Manifest

[`upstream-manifest.json`](upstream-manifest.json) is the machine-readable source
of truth. Every retained runtime file records:

- its repository-relative path;
- upstream Git blob SHA-256 and Git mode;
- local SHA-256 and Git mode;
- whether it is `unchanged` or `lite-modified`.

`excluded` lists upstream skill assets intentionally omitted from the pack. The
union of retained and excluded paths must equal the pinned upstream `skills/`
tree, so a newly added or silently omitted upstream file blocks verification.

Hashes are computed from Git blobs at the pinned commit, never from a checkout's
newline-normalized working files. Local hashes normalize CRLF to LF only for
valid UTF-8 text and do so at the byte level; explicit binary extensions,
invalid UTF-8, and NUL-containing data retain exact bytes. Local modes are
tracked separately.

## Source Authentication

All provenance commands require a local upstream clone supplied with `--source`.
The tool verifies:

1. source `HEAD` equals the pinned commit;
2. the pinned tag resolves to that commit;
3. `origin` identifies the pinned repository;
4. tracked source files are clean;
5. every retained blob hash and mode matches the manifest;
6. retained and excluded paths account for the complete upstream skill tree.

Untracked source files are ignored because no content is read from the working
tree. Dirty tracked content is rejected. Sync reads canonical blobs with Git, so
it cannot bless uncommitted source changes.

## Source-Checkout Commands

These maintenance commands are source-only. The published skill pack intentionally
omits `scripts/` and does not expose npm lifecycle or maintenance commands.

```bash
node scripts/upstream-sync.mjs check --source /path/to/superpowers
node scripts/upstream-sync.mjs sync --source /path/to/superpowers
node scripts/upstream-sync.mjs init --source /path/to/superpowers
```

- `check` is read-only and reports source, inventory, local hash, and mode drift.
- `sync` restores only `unchanged` files from pinned Git blobs. It never
  overwrites `lite-modified` files or changes the manifest.
- `init` rebuilds file records after a deliberate local reconciliation. Existing
  exclusions remain explicit; undeclared upstream additions or local files
  cause the command to stop.

No command fetches from the network, moves a tag, changes the pin, or edits an
exclusion. Updating the baseline requires a reviewed change to the pinned
metadata and exclusion list before `init` is run.

## Reconciliation Checklist

1. Clone or fetch upstream separately and verify the intended signed/released tag.
2. Update the pinned repository, tag, and commit in code, documentation, and the
   manifest.
3. Review every changed, added, and deleted upstream skill asset.
4. Copy accepted unchanged assets and reconcile every `lite-modified` workflow.
5. Update the explicit exclusion list with reasons in the reviewing change.
6. Run `node scripts/upstream-sync.mjs init --source /path/to/superpowers`, inspect the complete manifest diff, then run `node scripts/test.mjs`.
7. Run fresh-context behavioral evaluation for changed routing or execution
   semantics before release.
