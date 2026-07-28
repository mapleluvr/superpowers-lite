import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function read(relativePath) {
  return readFileSync(path.join(root, relativePath), "utf8");
}

function listFiles(directory) {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...listFiles(absolute));
    else if (entry.isFile()) files.push(absolute);
  }
  return files;
}

const packageJson = JSON.parse(read("package.json"));
const readme = read("README.md");
const router = read("skills/using-superpowers/SKILL.md");
const sdd = read("skills/subagent-driven-development/SKILL.md");
const executing = read("skills/executing-plans/SKILL.md");
const dispatching = read("skills/dispatching-parallel-agents/SKILL.md");
const review = read("skills/requesting-code-review/SKILL.md");
const writingSkills = read("skills/writing-skills/SKILL.md");
const visualCompanion = read("skills/brainstorming/visual-companion.md");
const visualServer = read("skills/brainstorming/scripts/server.cjs");
const visualLauncher = read("skills/brainstorming/scripts/start-server.sh");

assert.equal(packageJson.name, "@mapleluvr/superpowers-lite");
assert.deepEqual(packageJson.files, ["skills", "README.md", "LICENSE", "UPSTREAM.md", "upstream-manifest.json"]);
for (const field of ["main", "pi", "scripts", "dependencies", "peerDependencies", "devDependencies"]) {
  assert.equal(packageJson[field], undefined, `pure skill pack must omit ${field}`);
}
assert.equal(existsSync(path.join(root, ".pi")), false);
assert.equal(existsSync(path.join(root, "tsconfig.json")), false);
assert.equal(existsSync(path.join(root, "tests", "extension.test.mjs")), false);

for (const removedPath of [
  "skills/using-superpowers/references/pi-tools.md",
  "skills/using-superpowers/references/codex-tools.md",
  "skills/using-superpowers/references/antigravity-tools.md",
  "skills/subagent-driven-development/scripts/review-package",
  "skills/subagent-driven-development/scripts/sdd-workspace",
  "skills/subagent-driven-development/scripts/task-brief",
  "skills/test-driven-development/testing-anti-patterns.md",
]) {
  assert.equal(existsSync(path.join(root, removedPath)), false, `${removedPath} must stay removed`);
}
assert.equal(existsSync(path.join(root, "skills/test-driven-development/writing-good-tests.md")), true);

const forbiddenRuntime = /\bPi\b|\bTodoWrite\b|pi-subagents|native Pi|package-provided\s+`?(?:Skill|TodoWrite)|worktree:\s*true|\bfailFast\b|\bSkill\s*\(\s*\{/iu;
for (const file of listFiles(path.join(root, "skills"))) {
  const content = readFileSync(file);
  if (content.includes(0)) continue;
  assert.doesNotMatch(content.toString("utf8"), forbiddenRuntime, `${path.relative(root, file)} contains host-specific runtime syntax`);
}

assert.match(router, /on-demand skill pack/i);
assert.match(router, /does not inject this router or register tools/i);
assert.match(router, /host's native skill mechanism/i);
assert.match(router, /Never assume that a tool named `Skill` exists/i);
assert.match(router, /Operational skills remain independently discoverable/i);
assert.match(router, /Standard[\s\S]{0,500}Do not create[\s\S]{0,180}(?:isolated worker|independent review)/i);
assert.match(router, /(?:worker dispatch|independent review)[\s\S]{0,180}escalate to Full/i);
assert.match(router, /Independent final review has no self-review fallback/i);
assert.match(router, /neither is available[\s\S]{0,120}Full is blocked/i);
assert.match(router, /Missing isolation or worker capability[\s\S]{0,100}one canonical inline writer/i);

assert.match(sdd, /host-provided isolated workspace/i);
assert.match(sdd, /host-native patch capture/i);
assert.match(sdd, /fresh-context reviewer or named non-author human reviewer[\s\S]{0,120}stop before L0 or fanout/i);
assert.doesNotMatch(sdd, /native Pi|worktree:\s*true|failFast/i);
assert.match(executing, /independent final-review capability before execution[\s\S]{0,60}otherwise stop/i);
assert.match(dispatching, /host-provided isolated workspaces/i);
assert.match(dispatching, /Fail-fast scheduling/i);

assert.match(review, /fresh-context reviewer or a named human reviewer[\s\S]{0,180}If neither is available[\s\S]{0,100}Full cannot complete/i);
assert.match(review, /Controller self-review cannot replace/i);
assert.match(review, /Standard:[\s\S]{0,140}no independent review/i);
assert.match(review, /escalate the task to Full before dispatching/i);
assert.doesNotMatch(review, /Standard Review identity|Standard-risk/i);
assert.doesNotMatch(writingSkills, /using-superpowers\/references|codex-tools\.md|gemini-tools\.md/i);
assert.match(visualCompanion, /Launching the server[\s\S]{0,300}host-specific/i);
assert.doesNotMatch(`${visualCompanion}\n${visualServer}\n${visualLauncher}`, /Claude Code|Codex|Gemini CLI|Copilot CLI|CODEX_CI|\.codex-plugin|obra\/superpowers|primeradiant/i);
assert.match(visualServer, /Superpowers Lite v/);

assert.match(readme, /host-neutral/i);
assert.match(readme, /not an extension or runtime adapter/i);
assert.match(readme, /registers no tools,\s*commands, hooks/i);
assert.match(readme, /not injected into every session/i);
assert.match(readme, /git clone https:\/\/github\.com\/mapleluvr\/superpowers-lite\.git/i);
assert.match(readme, /No\s+`npm install`, build step, Pi extension, or host adapter is required/i);

const sourceTestRunner = read("scripts/test.mjs");
for (const registeredTest of [
  "tests/skill-pack-contract.test.mjs",
  "tests/package-artifact.test.mjs",
  "tests/execution-contracts/run-all.mjs",
]) {
  assert.equal(sourceTestRunner.split(registeredTest).length - 1, 1, `${registeredTest} must be registered exactly once`);
}
assert.doesNotMatch(sourceTestRunner, /extension\.test|pi-reference-contract|typecheck/i);

console.log("host-neutral skill-pack contract checks passed");
