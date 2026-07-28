import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  chmodSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  realpathSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { canonicalLocalBytes } from "./canonical-local-bytes.mjs";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const defaultManifestPath = path.join(packageRoot, "upstream-manifest.json");
const VALID_STATUSES = new Set(["unchanged", "lite-modified"]);
const VALID_MODES = new Set(["100644", "100755"]);

export const PINNED_UPSTREAM = Object.freeze({
  repository: "https://github.com/obra/superpowers",
  tag: "v6.2.0",
  commit: "3dcbd5c4b48e02263fbf4a3c01e3fe4f81d584d9",
});

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

function normalizeRelative(value) {
  const normalized = value.replaceAll("\\", "/").replace(/^\.\//u, "");
  if (!normalized.startsWith("skills/") || normalized.includes("..") || path.isAbsolute(value)) {
    throw new Error(`invalid skill path: ${value}`);
  }
  return normalized;
}

function comparePath(left, right) {
  return left.localeCompare(right, "en");
}

function listFiles(directory, prefix = "") {
  if (!existsSync(directory)) return [];
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...listFiles(absolute, relative));
    else if (entry.isFile()) files.push(relative.replaceAll("\\", "/"));
  }
  return files.sort(comparePath);
}

function runGit(repositoryRoot, args, { encoding = "utf8", allowFailure = false } = {}) {
  try {
    return execFileSync("git", ["-C", repositoryRoot, ...args], {
      encoding,
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (error) {
    if (allowFailure) return null;
    const stderr = error?.stderr?.toString?.().trim();
    throw new Error(`git ${args.join(" ")} failed${stderr ? `: ${stderr}` : ""}`);
  }
}

function samePath(left, right) {
  const canonical = (value) => {
    try {
      return realpathSync.native(value);
    } catch {
      return path.resolve(value);
    }
  };
  const a = canonical(left);
  const b = canonical(right);
  return process.platform === "win32" ? a.toLowerCase() === b.toLowerCase() : a === b;
}

function normalizeRepositoryIdentity(value) {
  let raw = value.trim().replaceAll("\\", "/");
  const scp = raw.match(/^[^@]+@([^:]+):(.+)$/u);
  if (scp) raw = `${scp[1]}/${scp[2]}`;
  else {
    try {
      const url = new URL(raw);
      raw = `${url.hostname}/${url.pathname.replace(/^\//u, "")}`;
    } catch {
      raw = raw.replace(/^[a-z]+:\/\//iu, "");
    }
  }
  return raw.replace(/\.git\/?$/iu, "").replace(/\/$/u, "").toLowerCase();
}

function assertSourceIdentity(sourceDir, expectedUpstream) {
  if (!existsSync(sourceDir)) throw new Error(`source directory not found: ${sourceDir}`);

  const topLevel = runGit(sourceDir, ["rev-parse", "--show-toplevel"]).trim();
  if (!samePath(topLevel, sourceDir)) {
    throw new Error(`source must be the repository root: expected ${topLevel}, got ${sourceDir}`);
  }

  const head = runGit(sourceDir, ["rev-parse", "HEAD"]).trim();
  if (head !== expectedUpstream.commit) {
    throw new Error(`source HEAD mismatch: expected ${expectedUpstream.commit}, got ${head}`);
  }

  const taggedCommit = runGit(sourceDir, ["rev-parse", `refs/tags/${expectedUpstream.tag}^{commit}`]).trim();
  if (taggedCommit !== expectedUpstream.commit) {
    throw new Error(`source tag mismatch: ${expectedUpstream.tag} resolves to ${taggedCommit}`);
  }

  const origin = runGit(sourceDir, ["remote", "get-url", "origin"]).trim();
  if (normalizeRepositoryIdentity(origin) !== normalizeRepositoryIdentity(expectedUpstream.repository)) {
    throw new Error(`source repository mismatch: expected ${expectedUpstream.repository}, got ${origin}`);
  }

  const trackedStatus = runGit(sourceDir, ["status", "--porcelain", "--untracked-files=no"]).trim();
  if (trackedStatus) throw new Error(`source tracked worktree is dirty:\n${trackedStatus}`);
}

function sourcePaths(sourceDir, commit) {
  const output = runGit(sourceDir, ["ls-tree", "-r", "-z", "--name-only", commit, "--", "skills"]);
  return output.split("\0").filter(Boolean).map(normalizeRelative).sort(comparePath);
}

function sourceMode(sourceDir, commit, relativePath) {
  const output = runGit(sourceDir, ["ls-tree", commit, "--", relativePath]).trim();
  const mode = output.match(/^(\d{6})\s/u)?.[1];
  if (!VALID_MODES.has(mode)) throw new Error(`unsupported or missing upstream mode for ${relativePath}: ${mode ?? "none"}`);
  return mode;
}

function sourceBlob(sourceDir, commit, relativePath) {
  return runGit(sourceDir, ["show", `${commit}:${relativePath}`], { encoding: "buffer" });
}

function localMode(packageDir, relativePath, fallbackMode) {
  if (process.platform !== "win32") {
    const stat = lstatSync(path.join(packageDir, relativePath));
    return stat.mode & 0o111 ? "100755" : "100644";
  }

  const output = runGit(packageDir, ["ls-files", "--stage", "--", relativePath], { allowFailure: true });
  const indexedMode = output?.trim().match(/^(\d{6})\s/u)?.[1];
  if (VALID_MODES.has(indexedMode)) return indexedMode;
  return fallbackMode;
}

function readManifest(manifestPath) {
  if (!existsSync(manifestPath)) throw new Error(`manifest not found: ${manifestPath}`);
  return JSON.parse(readFileSync(manifestPath, "utf8"));
}

function validateManifest(manifest, expectedUpstream, { allowEmptyFiles = false } = {}) {
  for (const key of ["repository", "tag", "commit"]) {
    if (manifest?.[key] !== expectedUpstream[key]) {
      throw new Error(`manifest ${key} mismatch: expected ${expectedUpstream[key]}, got ${manifest?.[key]}`);
    }
  }
  if (!Array.isArray(manifest.excluded)) throw new Error("manifest excluded must be an array");
  if (!Array.isArray(manifest.files)) throw new Error("manifest files must be an array");
  if (!allowEmptyFiles && manifest.files.length === 0) throw new Error("manifest files must not be empty");

  const excluded = new Set();
  for (const item of manifest.excluded) {
    if (!item || typeof item !== "object") throw new Error("manifest exclusion must be an object");
    const relativePath = normalizeRelative(item.path);
    if (excluded.has(relativePath)) throw new Error(`duplicate manifest exclusion: ${relativePath}`);
    if (typeof item.reason !== "string" || item.reason.trim().length < 8) {
      throw new Error(`manifest exclusion requires a reason: ${relativePath}`);
    }
    excluded.add(relativePath);
  }

  const files = new Set();
  for (const entry of manifest.files) {
    if (!entry || typeof entry !== "object") throw new Error("manifest file entry must be an object");
    const relativePath = normalizeRelative(entry.path);
    if (files.has(relativePath) || excluded.has(relativePath)) {
      throw new Error(`duplicate or conflicting manifest path: ${relativePath}`);
    }
    files.add(relativePath);
    if (!VALID_STATUSES.has(entry.status)) throw new Error(`invalid status for ${relativePath}: ${entry.status}`);
    for (const hashField of ["upstreamHash", "localHash"]) {
      if (!/^[0-9a-f]{64}$/u.test(entry[hashField] ?? "")) {
        throw new Error(`invalid ${hashField} for ${relativePath}`);
      }
    }
    for (const modeField of ["upstreamMode", "localMode"]) {
      if (!VALID_MODES.has(entry[modeField])) throw new Error(`invalid ${modeField} for ${relativePath}`);
    }
    const same = entry.upstreamHash === entry.localHash && entry.upstreamMode === entry.localMode;
    if ((entry.status === "unchanged") !== same) {
      throw new Error(`status/hash-mode invariant failed for ${relativePath}`);
    }
  }

  return { excluded, files };
}

function inventorySummary({ sourceDir, packageDir, manifest, expectedUpstream }) {
  const source = sourcePaths(sourceDir, expectedUpstream.commit);
  const local = listFiles(path.join(packageDir, "skills")).map((item) => `skills/${item}`);
  const filePaths = new Set(manifest.files.map((entry) => normalizeRelative(entry.path)));
  const excludedPaths = new Set(manifest.excluded.map((entry) => normalizeRelative(entry.path)));
  const declared = new Set([...filePaths, ...excludedPaths]);
  const sourceSet = new Set(source);
  const localSet = new Set(local);

  return {
    source,
    local,
    undeclaredUpstream: source.filter((item) => !declared.has(item)),
    staleDeclarations: [...declared].filter((item) => !sourceSet.has(item)).sort(comparePath),
    undeclaredLocal: local.filter((item) => !filePaths.has(item)),
    missingLocal: [...filePaths].filter((item) => !localSet.has(item)).sort(comparePath),
    excludedPresentLocally: [...excludedPaths].filter((item) => localSet.has(item)).sort(comparePath),
  };
}

function fileSummary({ sourceDir, packageDir, manifest, expectedUpstream }) {
  const sourceDrift = [];
  const localDrift = [];
  for (const entry of manifest.files) {
    const relativePath = normalizeRelative(entry.path);
    const upstreamBytes = sourceBlob(sourceDir, expectedUpstream.commit, relativePath);
    const actualUpstreamHash = sha256(upstreamBytes);
    const actualUpstreamMode = sourceMode(sourceDir, expectedUpstream.commit, relativePath);
    if (actualUpstreamHash !== entry.upstreamHash || actualUpstreamMode !== entry.upstreamMode) {
      sourceDrift.push(relativePath);
    }

    const absolute = path.join(packageDir, relativePath);
    if (!existsSync(absolute)) continue;
    const actualLocalHash = sha256(canonicalLocalBytes(readFileSync(absolute), entry.path));
    const actualLocalMode = localMode(packageDir, relativePath, actualUpstreamMode);
    if (actualLocalHash !== entry.localHash || actualLocalMode !== entry.localMode) {
      localDrift.push(relativePath);
    }
  }
  return { sourceDrift, localDrift };
}

function summarize(options) {
  const inventory = inventorySummary(options);
  const files = fileSummary(options);
  return { ...inventory, ...files };
}

function summaryProblems(summary) {
  return [
    ["undeclared upstream paths", summary.undeclaredUpstream],
    ["stale manifest declarations", summary.staleDeclarations],
    ["undeclared local paths", summary.undeclaredLocal],
    ["missing local paths", summary.missingLocal],
    ["excluded paths present locally", summary.excludedPresentLocally],
    ["upstream blob/mode drift", summary.sourceDrift],
    ["local blob/mode drift", summary.localDrift],
  ].filter(([, values]) => values.length > 0);
}

function assertCleanSummary(summary, prefix = "upstream check failed") {
  const problems = summaryProblems(summary);
  if (problems.length === 0) return;
  const details = problems.map(([label, values]) => `${label}:\n  ${values.join("\n  ")}`).join("\n");
  throw new Error(`${prefix}\n${details}`);
}

function initialize({ sourceDir, packageDir, manifestPath, expectedUpstream }) {
  const seed = readManifest(manifestPath);
  validateManifest(seed, expectedUpstream, { allowEmptyFiles: true });
  const source = sourcePaths(sourceDir, expectedUpstream.commit);
  const local = listFiles(path.join(packageDir, "skills")).map((item) => `skills/${item}`);
  const excluded = new Set(seed.excluded.map((entry) => normalizeRelative(entry.path)));
  const sourceSet = new Set(source);
  const staleExclusions = [...excluded].filter((item) => !sourceSet.has(item));
  const excludedPresentLocally = local.filter((item) => excluded.has(item));
  if (staleExclusions.length || excludedPresentLocally.length) {
    throw new Error(
      `cannot initialize exclusions\nstale: ${staleExclusions.join(", ") || "none"}`
      + `\npresent locally: ${excludedPresentLocally.join(", ") || "none"}`,
    );
  }

  const expectedLocal = source.filter((item) => !excluded.has(item));
  const localSet = new Set(local);
  const expectedLocalSet = new Set(expectedLocal);
  const missing = expectedLocal.filter((item) => !localSet.has(item));
  const extra = local.filter((item) => !expectedLocalSet.has(item));
  if (missing.length || extra.length) {
    throw new Error(`cannot initialize local inventory\nmissing: ${missing.join(", ") || "none"}\nextra: ${extra.join(", ") || "none"}`);
  }

  const files = expectedLocal.map((relativePath) => {
    const upstreamBytes = sourceBlob(sourceDir, expectedUpstream.commit, relativePath);
    const upstreamMode = sourceMode(sourceDir, expectedUpstream.commit, relativePath);
    const localBytes = readFileSync(path.join(packageDir, relativePath));
    const record = {
      path: relativePath,
      upstreamHash: sha256(upstreamBytes),
      upstreamMode,
      localHash: sha256(canonicalLocalBytes(localBytes, relativePath)),
      localMode: localMode(packageDir, relativePath, upstreamMode),
    };
    return {
      ...record,
      status: record.upstreamHash === record.localHash && record.upstreamMode === record.localMode
        ? "unchanged"
        : "lite-modified",
    };
  });

  const manifest = {
    repository: expectedUpstream.repository,
    tag: expectedUpstream.tag,
    commit: expectedUpstream.commit,
    excluded: [...seed.excluded].sort((left, right) => comparePath(left.path, right.path)),
    files,
  };
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  return manifest;
}

export function runSync({
  mode,
  sourceDir,
  packageDir = packageRoot,
  manifestPath = defaultManifestPath,
  expectedUpstream = PINNED_UPSTREAM,
}) {
  if (!sourceDir) throw new Error("--source is required");
  if (!new Set(["init", "check", "sync"]).has(mode)) throw new Error(`unsupported mode: ${mode}`);

  const resolvedSource = path.resolve(sourceDir);
  const resolvedPackage = path.resolve(packageDir);
  const resolvedManifest = path.resolve(manifestPath);
  assertSourceIdentity(resolvedSource, expectedUpstream);

  if (mode === "init") {
    const manifest = initialize({
      sourceDir: resolvedSource,
      packageDir: resolvedPackage,
      manifestPath: resolvedManifest,
      expectedUpstream,
    });
    return { mode, initialized: manifest.files.length };
  }

  const manifest = readManifest(resolvedManifest);
  validateManifest(manifest, expectedUpstream);
  const options = {
    sourceDir: resolvedSource,
    packageDir: resolvedPackage,
    manifest,
    expectedUpstream,
  };
  const before = summarize(options);

  if (mode === "check") {
    assertCleanSummary(before);
    return { mode, checked: manifest.files.length, summary: before };
  }

  const nonLocalProblems = {
    ...before,
    localDrift: [],
    missingLocal: before.missingLocal.filter((relativePath) => {
      const entry = manifest.files.find((item) => item.path === relativePath);
      return entry?.status !== "unchanged";
    }),
  };
  assertCleanSummary(nonLocalProblems, "sync refused because protected or upstream state drifted");

  const synced = [];
  for (const entry of manifest.files) {
    if (entry.status !== "unchanged") {
      if (before.localDrift.includes(entry.path) || before.missingLocal.includes(entry.path)) {
        throw new Error(`sync refused to overwrite lite-modified file: ${entry.path}`);
      }
      continue;
    }
    if (!before.localDrift.includes(entry.path) && !before.missingLocal.includes(entry.path)) continue;

    const absolute = path.join(resolvedPackage, entry.path);
    mkdirSync(path.dirname(absolute), { recursive: true });
    writeFileSync(absolute, sourceBlob(resolvedSource, expectedUpstream.commit, entry.path));
    chmodSync(absolute, entry.upstreamMode === "100755" ? 0o755 : 0o644);
    synced.push(entry.path);
  }

  const after = summarize(options);
  assertCleanSummary(after, "sync completed but verification still fails");
  return { mode, synced, summary: after };
}

function parseCli(argv) {
  const [mode, ...rest] = argv;
  let sourceDir;
  for (let index = 0; index < rest.length; index += 1) {
    const argument = rest[index];
    if (argument === "--source") {
      sourceDir = rest[index + 1];
      index += 1;
      continue;
    }
    throw new Error(`unknown argument: ${argument}`);
  }
  return { mode, sourceDir };
}

function runCli() {
  try {
    const { mode, sourceDir } = parseCli(process.argv.slice(2));
    const result = runSync({ mode, sourceDir });
    if (mode === "init") console.log(`manifest initialized: ${result.initialized} retained files`);
    if (mode === "check") console.log(`upstream and local snapshot verified: ${result.checked} files`);
    if (mode === "sync") console.log(`synchronized ${result.synced.length} unchanged files`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : "";
if (invokedPath === path.resolve(fileURLToPath(import.meta.url))) runCli();
