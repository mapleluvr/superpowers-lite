import assert from "node:assert/strict";
import { readRepoFile } from "../helpers/skill-contract.mjs";

const manifest = JSON.parse(readRepoFile("upstream-manifest.json"));
const pkg = JSON.parse(readRepoFile("package.json"));
const readme = readRepoFile("README.md");
const upstream = readRepoFile("UPSTREAM.md");
const sourceTestRunner = readRepoFile("scripts/test.mjs");

const expectedModified = [
  "skills/brainstorming/scripts/server.cjs",
  "skills/brainstorming/scripts/start-server.sh",
  "skills/brainstorming/scripts/stop-server.sh",
  "skills/brainstorming/SKILL.md",
  "skills/brainstorming/spec-document-reviewer-prompt.md",
  "skills/brainstorming/visual-companion.md",
  "skills/dispatching-parallel-agents/SKILL.md",
  "skills/executing-plans/SKILL.md",
  "skills/finishing-a-development-branch/SKILL.md",
  "skills/requesting-code-review/code-reviewer.md",
  "skills/requesting-code-review/SKILL.md",
  "skills/subagent-driven-development/implementer-prompt.md",
  "skills/subagent-driven-development/SKILL.md",
  "skills/subagent-driven-development/task-reviewer-prompt.md",
  "skills/systematic-debugging/find-polluter.sh",
  "skills/systematic-debugging/root-cause-tracing.md",
  "skills/systematic-debugging/SKILL.md",
  "skills/test-driven-development/SKILL.md",
  "skills/using-git-worktrees/SKILL.md",
  "skills/using-superpowers/SKILL.md",
  "skills/verification-before-completion/SKILL.md",
  "skills/writing-plans/plan-document-reviewer-prompt.md",
  "skills/writing-plans/SKILL.md",
  "skills/writing-skills/render-graphs.js",
  "skills/writing-skills/SKILL.md",
].sort();

const modified = manifest.files.filter((entry) => entry.status === "lite-modified");
assert.deepEqual(modified.map((entry) => entry.path).sort(), expectedModified,
  "every intentional workflow adaptation must be registered as lite-modified");
for (const entry of modified) {
  assert.notEqual(entry.localHash, entry.upstreamHash, `${entry.path} must retain substantive Lite drift`);
  assert.match(entry.localHash, /^[0-9a-f]{64}$/u);
  assert.match(entry.upstreamHash, /^[0-9a-f]{64}$/u);
}
assert.equal(manifest.files.filter((entry) => entry.status === "unchanged").length, 17);
assert.equal(manifest.excluded.length, 8);
assert.equal(manifest.tag, "v6.2.0");
assert.equal(manifest.commit, "3dcbd5c4b48e02263fbf4a3c01e3fe4f81d584d9");

assert.deepEqual(pkg.files, ["skills", "README.md", "LICENSE", "UPSTREAM.md", "upstream-manifest.json"]);
assert.equal(pkg.scripts, undefined, "published package must not expose source-only commands");
for (const developmentPath of ["tests", "scripts", "evals", "docs", ".pi"]) {
  assert.ok(!pkg.files.includes(developmentPath), `${developmentPath} must not ship in the runtime pack`);
}
const aggregate = "tests/execution-contracts/run-all.mjs";
assert.equal(sourceTestRunner.split(aggregate).length - 1, 1,
  "source test runner must register the execution aggregate exactly once");

assert.match(readme, /host-neutral/i);
assert.match(readme, /It is not an extension or runtime adapter/i);
assert.match(readme, /Micro[\s\S]{0,220}Standard[\s\S]{0,220}Full/i);
assert.match(readme, /on-demand router/i);
assert.match(readme, /not injected into every session/i);
assert.match(readme, /same 14 skill names/i);
assert.doesNotMatch(readme, /worktree:\s*true|TodoWrite|pi-subagents|\.pi\/extensions/i);

assert.match(upstream, /Superpowers `v6\.2\.0`|Tag: `v6\.2\.0`/i);
assert.match(upstream, /Git blobs at the pinned commit/i);
assert.match(upstream, /origin.*tag.*HEAD.*clean tracked tree|source `HEAD`[\s\S]{0,400}pinned tag[\s\S]{0,400}`origin`/is);
assert.match(upstream, /never from a checkout's[\s\S]{0,80}working files/i);

console.log("execution manifest registration checks passed");
