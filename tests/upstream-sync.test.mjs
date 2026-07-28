import assert from "node:assert/strict";
import { spawnSync, execFileSync } from "node:child_process";
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { BINARY_EXTENSIONS, canonicalLocalBytes } from "../scripts/canonical-local-bytes.mjs";
import { runSync } from "../scripts/upstream-sync.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const scriptPath = path.join(root, "scripts", "upstream-sync.mjs");
const fixtureRoot = mkdtempSync(path.join(os.tmpdir(), "superpowers-lite-sync-"));
const sourceDir = path.join(fixtureRoot, "source");
const packageDir = path.join(fixtureRoot, "package");
const manifestPath = path.join(packageDir, "upstream-manifest.json");
const repository = "https://github.com/example/superpowers";
const tag = "v-test";

const invalidUtf8A = Buffer.from([0xff, 0x0d, 0x0a, 0x41]);
const invalidUtf8B = Buffer.from([0xff, 0x0a, 0x41]);
assert.deepEqual(canonicalLocalBytes(invalidUtf8A, "skills/sample.bin"), invalidUtf8A,
  "invalid UTF-8 must retain exact bytes instead of applying text normalization");
assert.notDeepEqual(canonicalLocalBytes(invalidUtf8A, "skills/sample.bin"), canonicalLocalBytes(invalidUtf8B, "skills/sample.bin"),
  "a CR byte in NUL-free invalid UTF-8 must remain provenance-significant");
const explicitBinary = Buffer.from([0x41, 0x0d, 0x0a, 0x42]);
assert.deepEqual(canonicalLocalBytes(explicitBinary, "skills/sample.png"), explicitBinary,
  "explicit binary extensions must preserve CRLF bytes");
assert.deepEqual(canonicalLocalBytes(Buffer.from("A\r\nB\n"), "skills/sample.md"), Buffer.from("A\nB\n"),
  "text checkout CRLF must normalize without UTF-8 decoding");
const attributes = readFileSync(path.join(root, ".gitattributes"), "utf8");
const attributeLines = attributes.split(/\r?\n/u);
for (const extension of BINARY_EXTENSIONS) {
  assert.ok(
    attributeLines.includes(`*${extension} binary`) || attributeLines.includes(`*${extension} -text`),
    `${extension} must stay binary in .gitattributes`,
  );
}

function git(directory, ...args) {
  return execFileSync("git", ["-C", directory, ...args], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function write(relativeRoot, relativePath, content) {
  const absolute = path.join(relativeRoot, relativePath);
  mkdirSync(path.dirname(absolute), { recursive: true });
  writeFileSync(absolute, content);
}

function initializeGit(directory) {
  mkdirSync(directory, { recursive: true });
  git(directory, "init", "-q");
  git(directory, "config", "core.autocrlf", "false");
  git(directory, "config", "user.name", "Superpowers Lite Tests");
  git(directory, "config", "user.email", "tests@example.invalid");
}

function seedManifest(expectedUpstream) {
  writeFileSync(manifestPath, `${JSON.stringify({
    ...expectedUpstream,
    excluded: [{
      path: "skills/using-superpowers/references/host-tools.md",
      reason: "Host-specific tool mappings are outside the skill-pack boundary.",
    }],
    files: [],
  }, null, 2)}\n`);
}

try {
  initializeGit(sourceDir);
  write(sourceDir, ".gitattributes", "* text=auto eol=lf\n");
  write(sourceDir, "skills/alpha/SKILL.md", "---\nname: alpha\ndescription: Alpha.\n---\n\n# Alpha\n");
  write(sourceDir, "skills/beta/SKILL.md", "---\nname: beta\ndescription: Beta.\n---\n\n# Beta\n");
  write(sourceDir, "skills/bin/tool.sh", "#!/usr/bin/env bash\necho tool\n");
  write(sourceDir, "skills/using-superpowers/references/host-tools.md", "# Host mapping\n");
  git(sourceDir, "add", ".");
  git(sourceDir, "update-index", "--chmod=+x", "skills/bin/tool.sh");
  git(sourceDir, "commit", "-qm", "fixture source");
  git(sourceDir, "tag", tag);
  git(sourceDir, "remote", "add", "origin", repository);
  const commit = git(sourceDir, "rev-parse", "HEAD");
  const expectedUpstream = { repository, tag, commit };

  initializeGit(packageDir);
  write(packageDir, ".gitattributes", "* text=auto eol=lf\n");
  for (const relativePath of [
    "skills/alpha/SKILL.md",
    "skills/beta/SKILL.md",
    "skills/bin/tool.sh",
  ]) {
    write(packageDir, relativePath, readFileSync(path.join(sourceDir, relativePath)));
  }
  git(packageDir, "add", ".");
  git(packageDir, "update-index", "--chmod=+x", "skills/bin/tool.sh");
  git(packageDir, "commit", "-qm", "fixture package");
  seedManifest(expectedUpstream);

  const initialized = runSync({
    mode: "init",
    sourceDir,
    packageDir,
    manifestPath,
    expectedUpstream,
  });
  assert.equal(initialized.initialized, 3);
  let manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  assert.deepEqual(manifest.files.map((entry) => entry.status), ["unchanged", "unchanged", "unchanged"]);
  assert.equal(manifest.files.find((entry) => entry.path.endsWith("tool.sh")).upstreamMode, "100755");
  assert.equal(manifest.files.find((entry) => entry.path.endsWith("tool.sh")).localMode, "100755");
  assert.equal(runSync({ mode: "check", sourceDir, packageDir, manifestPath, expectedUpstream }).checked, 3);

  const alphaPath = path.join(packageDir, "skills", "alpha", "SKILL.md");
  writeFileSync(alphaPath, readFileSync(alphaPath, "utf8").replaceAll("\n", "\r\n"));
  assert.equal(
    runSync({ mode: "check", sourceDir, packageDir, manifestPath, expectedUpstream }).checked,
    3,
    "checkout newline conversion must not create provenance drift",
  );
  assert.deepEqual(
    runSync({ mode: "sync", sourceDir, packageDir, manifestPath, expectedUpstream }).synced,
    [],
    "sync need not rewrite a semantically identical newline conversion",
  );

  rmSync(alphaPath);
  assert.deepEqual(
    runSync({ mode: "sync", sourceDir, packageDir, manifestPath, expectedUpstream }).synced,
    ["skills/alpha/SKILL.md"],
    "sync restores a missing unchanged file",
  );

  const betaPath = path.join(packageDir, "skills", "beta", "SKILL.md");
  writeFileSync(betaPath, `${readFileSync(betaPath, "utf8")}\nLite adaptation.\n`);
  runSync({ mode: "init", sourceDir, packageDir, manifestPath, expectedUpstream });
  manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  assert.equal(manifest.files.find((entry) => entry.path.endsWith("beta/SKILL.md")).status, "lite-modified");
  assert.equal(runSync({ mode: "check", sourceDir, packageDir, manifestPath, expectedUpstream }).checked, 3);

  writeFileSync(betaPath, `${readFileSync(betaPath, "utf8")}tampered\n`);
  assert.throws(
    () => runSync({ mode: "sync", sourceDir, packageDir, manifestPath, expectedUpstream }),
    /refused to overwrite lite-modified file.*beta/u,
  );
  writeFileSync(betaPath, readFileSync(betaPath, "utf8").replace("tampered\n", ""));

  writeFileSync(path.join(sourceDir, "skills", "alpha", "SKILL.md"), "dirty source\n");
  assert.throws(
    () => runSync({ mode: "check", sourceDir, packageDir, manifestPath, expectedUpstream }),
    /source tracked worktree is dirty/u,
    "dirty source bytes must never be copied or blessed",
  );
  git(sourceDir, "restore", "skills/alpha/SKILL.md");

  write(sourceDir, "untracked-note.txt", "ignored by provenance\n");
  assert.equal(runSync({ mode: "check", sourceDir, packageDir, manifestPath, expectedUpstream }).checked, 3);
  rmSync(path.join(sourceDir, "untracked-note.txt"));

  git(sourceDir, "remote", "set-url", "origin", "https://github.com/example/not-superpowers");
  assert.throws(
    () => runSync({ mode: "check", sourceDir, packageDir, manifestPath, expectedUpstream }),
    /source repository mismatch/u,
  );
  git(sourceDir, "remote", "set-url", "origin", repository);

  git(sourceDir, "commit", "--allow-empty", "-qm", "wrong head");
  assert.throws(
    () => runSync({ mode: "check", sourceDir, packageDir, manifestPath, expectedUpstream }),
    /source HEAD mismatch/u,
  );
  git(sourceDir, "reset", "--hard", "-q", commit);

  const wrongMetadata = JSON.parse(readFileSync(manifestPath, "utf8"));
  wrongMetadata.tag = "v-wrong";
  writeFileSync(manifestPath, `${JSON.stringify(wrongMetadata, null, 2)}\n`);
  assert.throws(
    () => runSync({ mode: "check", sourceDir, packageDir, manifestPath, expectedUpstream }),
    /manifest tag mismatch/u,
  );
  wrongMetadata.tag = tag;
  writeFileSync(manifestPath, `${JSON.stringify(wrongMetadata, null, 2)}\n`);

  const missingExclusion = JSON.parse(readFileSync(manifestPath, "utf8"));
  missingExclusion.excluded = [];
  writeFileSync(manifestPath, `${JSON.stringify(missingExclusion, null, 2)}\n`);
  assert.throws(
    () => runSync({ mode: "check", sourceDir, packageDir, manifestPath, expectedUpstream }),
    /undeclared upstream paths[\s\S]*host-tools/u,
  );
  writeFileSync(manifestPath, `${JSON.stringify(wrongMetadata, null, 2)}\n`);

  write(packageDir, "skills/local-only.md", "not declared\n");
  assert.throws(
    () => runSync({ mode: "check", sourceDir, packageDir, manifestPath, expectedUpstream }),
    /undeclared local paths[\s\S]*local-only/u,
  );
  rmSync(path.join(packageDir, "skills", "local-only.md"));

  const cli = spawnSync(process.execPath, [
    scriptPath,
    "check",
    "--source",
    sourceDir,
    "--expected-commit",
    "0".repeat(40),
  ], { encoding: "utf8" });
  assert.notEqual(cli.status, 0);
  assert.match(`${cli.stdout}\n${cli.stderr}`, /unknown argument: --expected-commit/u);
} finally {
  rmSync(fixtureRoot, { recursive: true, force: true });
}

console.log("upstream sync provenance checks passed");
