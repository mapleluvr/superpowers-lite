import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  existsSync,
  lstatSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { canonicalLocalBytes } from "../scripts/canonical-local-bytes.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const expectedSkills = [
  "brainstorming",
  "dispatching-parallel-agents",
  "executing-plans",
  "finishing-a-development-branch",
  "receiving-code-review",
  "requesting-code-review",
  "subagent-driven-development",
  "systematic-debugging",
  "test-driven-development",
  "using-git-worktrees",
  "using-superpowers",
  "verification-before-completion",
  "writing-plans",
  "writing-skills",
];
const expectedPackageFiles = ["skills", "README.md", "LICENSE", "UPSTREAM.md", "upstream-manifest.json"];
const expectedUpstream = {
  repository: "https://github.com/obra/superpowers",
  tag: "v6.2.0",
  commit: "3dcbd5c4b48e02263fbf4a3c01e3fe4f81d584d9",
};

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
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
  return files.sort();
}

function parseFrontmatter(text, source) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/u);
  assert.ok(match, `${source} must start with YAML frontmatter`);
  const fields = {};
  for (const line of match[1].split(/\r?\n/u)) {
    const separator = line.indexOf(":");
    if (separator < 1) continue;
    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    fields[key] = value;
  }
  return fields;
}

function localMode(packageRoot, relativePath, fallback = "100644") {
  if (process.platform !== "win32") {
    const stat = lstatSync(path.join(packageRoot, relativePath));
    return stat.mode & 0o111 ? "100755" : "100644";
  }
  try {
    const output = execFileSync("git", ["-C", packageRoot, "ls-files", "--stage", "--", relativePath], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    const mode = output.trim().match(/^(\d{6})\s/u)?.[1];
    return mode || fallback;
  } catch {
    return fallback;
  }
}

function localMarkdownTargets(packageRoot, relativePath, text) {
  if (relativePath.endsWith("anthropic-best-practices.md")) return [];
  const withoutFences = text.replace(/```[\s\S]*?```/gu, "");
  return [...withoutFences.matchAll(/\[[^\]]*\]\(([^)]+)\)/gu)]
    .map((match) => match[1].trim())
    .filter((target) => target && !target.startsWith("#") && !/^[a-z][a-z0-9+.-]*:/iu.test(target))
    .map((target) => {
      let cleaned = target.replace(/^<|>$/gu, "").split("#", 1)[0];
      cleaned = cleaned.split(/\s+(?=["'])/u, 1)[0];
      return decodeURIComponent(cleaned);
    })
    .filter(Boolean)
    .map((target) => ({
      target,
      candidates: [
        path.resolve(path.dirname(path.join(packageRoot, relativePath)), target),
        path.resolve(packageRoot, target),
      ],
    }));
}

function runStructureForRoot(packageRoot, requiredSkills = expectedSkills) {
  const packageJson = JSON.parse(readFileSync(path.join(packageRoot, "package.json"), "utf8"));
  assert.equal(packageJson.name, "@mapleluvr/superpowers-lite");
  assert.equal(packageJson.version, "0.2.0");
  assert.deepEqual(packageJson.files, expectedPackageFiles);
  for (const forbiddenField of ["main", "pi", "scripts", "dependencies", "peerDependencies", "devDependencies"]) {
    assert.equal(packageJson[forbiddenField], undefined, `package must not declare ${forbiddenField}`);
  }
  assert.ok(packageJson.keywords.includes("agent-skills"));
  assert.ok(packageJson.keywords.includes("skill-pack"));
  assert.ok(!packageJson.keywords.some((keyword) => keyword.startsWith("pi-")));
  assert.equal(existsSync(path.join(packageRoot, ".pi")), false, "pure skill pack must not contain .pi resources");

  const lockPath = path.join(packageRoot, "package-lock.json");
  if (existsSync(lockPath)) {
    const lock = JSON.parse(readFileSync(lockPath, "utf8"));
    assert.deepEqual(Object.keys(lock.packages), [""], "lockfile must not contain dependencies");
  }

  const skillRoot = path.join(packageRoot, "skills");
  const actualSkills = readdirSync(skillRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  assert.deepEqual(actualSkills, [...requiredSkills].sort());

  const names = new Set();
  for (const skill of actualSkills) {
    const relativePath = `skills/${skill}/SKILL.md`;
    const text = readFileSync(path.join(packageRoot, relativePath), "utf8");
    const frontmatter = parseFrontmatter(text, relativePath);
    assert.equal(frontmatter.name, skill, `${relativePath} name must match its directory`);
    assert.match(frontmatter.name, /^[a-z0-9-]{1,64}$/u);
    assert.ok(frontmatter.description, `${relativePath} requires a description`);
    assert.ok(Buffer.byteLength(frontmatter.description, "utf8") <= 1024, `${relativePath} description exceeds 1024 bytes`);
    assert.ok(!names.has(frontmatter.name), `duplicate skill name: ${frontmatter.name}`);
    names.add(frontmatter.name);
  }

  const nestedSkillFiles = listFiles(skillRoot).filter((relativePath) => relativePath.endsWith("/SKILL.md"));
  assert.deepEqual(
    nestedSkillFiles.sort(),
    actualSkills.map((skill) => `${skill}/SKILL.md`).sort(),
    "nested or missing SKILL.md files change discovery semantics",
  );

  const manifest = JSON.parse(readFileSync(path.join(packageRoot, "upstream-manifest.json"), "utf8"));
  assert.equal(manifest.repository, expectedUpstream.repository);
  assert.equal(manifest.tag, expectedUpstream.tag);
  assert.equal(manifest.commit, expectedUpstream.commit);
  assert.ok(Array.isArray(manifest.excluded));
  assert.ok(Array.isArray(manifest.files));

  const excludedPaths = new Set();
  for (const exclusion of manifest.excluded) {
    assert.match(exclusion.path, /^skills\//u);
    assert.ok(exclusion.reason?.trim().length >= 8, `${exclusion.path} needs an exclusion reason`);
    assert.ok(!excludedPaths.has(exclusion.path), `duplicate exclusion: ${exclusion.path}`);
    excludedPaths.add(exclusion.path);
    assert.equal(existsSync(path.join(packageRoot, exclusion.path)), false, `excluded path is present: ${exclusion.path}`);
  }

  const manifestPaths = new Set();
  for (const entry of manifest.files) {
    assert.match(entry.path, /^skills\//u);
    assert.ok(!manifestPaths.has(entry.path), `duplicate manifest path: ${entry.path}`);
    assert.ok(!excludedPaths.has(entry.path), `retained and excluded path conflict: ${entry.path}`);
    manifestPaths.add(entry.path);
    assert.ok(["unchanged", "lite-modified"].includes(entry.status));
    assert.match(entry.upstreamHash, /^[0-9a-f]{64}$/u);
    assert.match(entry.localHash, /^[0-9a-f]{64}$/u);
    assert.ok(["100644", "100755"].includes(entry.upstreamMode));
    assert.ok(["100644", "100755"].includes(entry.localMode));

    const absolute = path.join(packageRoot, entry.path);
    assert.ok(existsSync(absolute), `manifest path missing locally: ${entry.path}`);
    assert.equal(sha256(canonicalLocalBytes(readFileSync(absolute), entry.path)), entry.localHash, `local hash mismatch: ${entry.path}`);
    assert.equal(localMode(packageRoot, entry.path, entry.localMode), entry.localMode, `local mode mismatch: ${entry.path}`);
    const same = entry.upstreamHash === entry.localHash && entry.upstreamMode === entry.localMode;
    assert.equal(entry.status === "unchanged", same, `status/hash-mode invariant failed: ${entry.path}`);
  }

  const runtimePaths = listFiles(skillRoot).map((relativePath) => `skills/${relativePath}`);
  assert.deepEqual([...manifestPaths].sort(), runtimePaths.sort(), "manifest must account for every retained skill asset");

  const forbiddenRuntime = /\bPi\b|\bTodoWrite\b|pi-subagents|native Pi|\.pi\/extensions|worktree:\s*true|\bfailFast\b|\bSkill\s*\(\s*\{/iu;
  for (const relativePath of runtimePaths) {
    const absolute = path.join(packageRoot, relativePath);
    const bytes = readFileSync(absolute);
    if (bytes.includes(0)) continue;
    const text = bytes.toString("utf8");
    assert.doesNotMatch(text, forbiddenRuntime, `${relativePath} contains a host-specific runtime dependency`);
    for (const link of localMarkdownTargets(packageRoot, relativePath, text)) {
      assert.ok(link.candidates.some(existsSync), `${relativePath} has a missing local link: ${link.target}`);
    }
  }
}

runStructureForRoot(root);

const fixtureRoot = mkdtempSync(path.join(os.tmpdir(), "superpowers-lite-structure-"));
try {
  mkdirSync(path.join(fixtureRoot, "skills", "sample"), { recursive: true });
  writeFileSync(path.join(fixtureRoot, "skills", "sample", "SKILL.md"), "---\nname: sample\ndescription: Use for sample work.\n---\n\nRead [guide](guide.md).\n");
  writeFileSync(path.join(fixtureRoot, "skills", "sample", "guide.md"), "# Guide\n");
  const packageJson = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
  writeFileSync(path.join(fixtureRoot, "package.json"), `${JSON.stringify(packageJson, null, 2)}\n`);
  const sampleFiles = ["skills/sample/SKILL.md", "skills/sample/guide.md"].map((relativePath) => {
    const hash = sha256(canonicalLocalBytes(readFileSync(path.join(fixtureRoot, relativePath)), relativePath));
    return {
      path: relativePath,
      upstreamHash: hash,
      upstreamMode: "100644",
      localHash: hash,
      localMode: "100644",
      status: "unchanged",
    };
  });
  writeFileSync(path.join(fixtureRoot, "upstream-manifest.json"), `${JSON.stringify({
    ...expectedUpstream,
    excluded: [],
    files: sampleFiles,
  }, null, 2)}\n`);

  runStructureForRoot(fixtureRoot, ["sample"]);

  const sampleSkillPath = path.join(fixtureRoot, "skills", "sample", "SKILL.md");
  const sampleSkill = readFileSync(sampleSkillPath, "utf8");
  writeFileSync(sampleSkillPath, sampleSkill.replaceAll("\n", "\r\n"));
  runStructureForRoot(fixtureRoot, ["sample"]);
  writeFileSync(sampleSkillPath, sampleSkill);

  packageJson.pi = { skills: ["./skills"] };
  writeFileSync(path.join(fixtureRoot, "package.json"), `${JSON.stringify(packageJson, null, 2)}\n`);
  assert.throws(() => runStructureForRoot(fixtureRoot, ["sample"]), /must not declare pi/u);
  delete packageJson.pi;
  writeFileSync(path.join(fixtureRoot, "package.json"), `${JSON.stringify(packageJson, null, 2)}\n`);

  const skillPath = path.join(fixtureRoot, "skills", "sample", "SKILL.md");
  const original = readFileSync(skillPath, "utf8");
  writeFileSync(skillPath, original.replace("guide.md", "missing.md"));
  const manifest = JSON.parse(readFileSync(path.join(fixtureRoot, "upstream-manifest.json"), "utf8"));
  manifest.files.find((entry) => entry.path.endsWith("SKILL.md")).localHash = sha256(canonicalLocalBytes(readFileSync(skillPath), "skills/sample/SKILL.md"));
  manifest.files.find((entry) => entry.path.endsWith("SKILL.md")).upstreamHash = "0".repeat(64);
  manifest.files.find((entry) => entry.path.endsWith("SKILL.md")).status = "lite-modified";
  writeFileSync(path.join(fixtureRoot, "upstream-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  assert.throws(() => runStructureForRoot(fixtureRoot, ["sample"]), /missing local link/u);
} finally {
  rmSync(fixtureRoot, { recursive: true, force: true });
}

console.log("skill-pack structure checks passed");
