import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const temporaryDirectory = mkdtempSync(path.join(os.tmpdir(), "superpowers-lite-package-"));
const npmShim = process.platform === "win32"
  ? execFileSync("where.exe", ["npm.cmd"], { encoding: "utf8" }).split(/\r?\n/u).find(Boolean)
  : null;
const npmCli = npmShim
  ? path.join(path.dirname(npmShim), "node_modules", "npm", "bin", "npm-cli.js")
  : null;

function runNpm(args) {
  const command = npmCli ? process.execPath : "npm";
  const commandArgs = npmCli ? [npmCli, ...args] : args;
  return execFileSync(command, commandArgs, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
}

try {
  const packed = JSON.parse(runNpm([
    "pack",
    root,
    "--pack-destination",
    temporaryDirectory,
    "--json",
    "--ignore-scripts",
  ]))[0];
  assert.equal(packed.name, "@mapleluvr/superpowers-lite");
  assert.equal(packed.version, "0.2.0");
  assert.equal(packed.entryCount, 47);

  const allowed = /^(?:LICENSE|README\.md|UPSTREAM\.md|package\.json|upstream-manifest\.json|skills\/)/u;
  for (const entry of packed.files) {
    assert.match(entry.path, allowed, `unexpected published path: ${entry.path}`);
  }
  for (const forbidden of ["scripts/", "tests/", "evals/", "docs/", ".pi/"]) {
    assert.ok(!packed.files.some((entry) => entry.path.startsWith(forbidden)), `${forbidden} must not ship`);
  }

  execFileSync("tar", ["-xzf", packed.filename, "-C", "."], { cwd: temporaryDirectory, stdio: "pipe" });
  const packageRoot = path.join(temporaryDirectory, "package");
  const packageJson = JSON.parse(readFileSync(path.join(packageRoot, "package.json"), "utf8"));
  for (const forbiddenField of ["main", "pi", "scripts", "dependencies", "peerDependencies", "devDependencies"]) {
    assert.equal(packageJson[forbiddenField], undefined, `published package must not expose ${forbiddenField}`);
  }

  const skillNames = readdirSync(path.join(packageRoot, "skills"), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  assert.equal(skillNames.length, 14);
  for (const skillName of skillNames) {
    const text = readFileSync(path.join(packageRoot, "skills", skillName, "SKILL.md"), "utf8");
    const frontmatter = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/u)?.[1] ?? "";
    assert.match(frontmatter, new RegExp(`(?:^|\\n)name:\\s*${skillName}(?:\\r?$|\\n)`, "u"));
    assert.match(frontmatter, /(?:^|\n)description:\s*\S/u);
  }

  const visual = readFileSync(path.join(packageRoot, "skills", "brainstorming", "visual-companion.md"), "utf8");
  const tracing = readFileSync(path.join(packageRoot, "skills", "systematic-debugging", "root-cause-tracing.md"), "utf8");
  const writing = readFileSync(path.join(packageRoot, "skills", "writing-skills", "SKILL.md"), "utf8");
  assert.doesNotMatch(visual, /^[ \t`]*scripts\/(?:start|stop)-server\.sh/mu,
    "shell helpers must be invoked through bash because Windows-built tarballs may not retain executable mode");
  assert.doesNotMatch(tracing, /^\.\/find-polluter\.sh/mu);
  assert.doesNotMatch(writing, /^\.\/render-graphs\.js/mu);

  console.log(`published artifact checks passed (${packed.entryCount} files, ${skillNames.length} skills)`);
} finally {
  rmSync(temporaryDirectory, { recursive: true, force: true });
}
