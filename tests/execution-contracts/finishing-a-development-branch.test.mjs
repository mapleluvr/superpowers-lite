import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { readRepoFile, wordCount } from "../helpers/skill-contract.mjs";

const skill = readRepoFile("skills/finishing-a-development-branch/SKILL.md");

assert.match(skill, /Use the route declared[\s\S]{0,180}classify.*using-superpowers/i,
  "branch finishing must establish a route even when independently discovered");
assert.match(skill, /Micro:[\s\S]{0,120}fresh focused validation/i);
assert.match(skill, /Standard:[\s\S]{0,140}fresh scoped verification[\s\S]{0,100}affected closure/i);
assert.match(skill, /Full:[\s\S]{0,160}L3 evidence record/i);
assert.match(skill, /Micro and Standard do not invent an L3 record, frontier, or persisted plan/i);

for (const field of [
  /HEAD/i,
  /clean.*dirty|dirty.*clean/is,
  /exact.*command/i,
  /tool.*runtime.*version|runtime.*tool.*version/is,
  /external config.*hash|environment fingerprint/is,
]) {
  assert.match(skill, field, `Full L3 reuse must bind ${field}`);
}
assert.match(skill, /Never record secret values/i);
assert.match(skill, /read-only review does not invalidate/i);
assert.match(skill, /material source, test, build, dependency, or environment repair[\s\S]{0,220}focused L1\/L2[\s\S]{0,160}new clean state[\s\S]{0,100}replacement L3/i,
  "material Full repairs must pass focused L1/L2 before replacement L3");
assert.match(skill, /current milestone/i);
assert.doesNotMatch(skill, /plan-declared|approved plan/i,
  "branch finishing must not depend on a static plan");
assert.match(skill, /merged target[\s\S]{0,220}same route's completion evidence[\s\S]{0,220}Micro[\s\S]{0,120}Standard[\s\S]{0,120}Full/i,
  "local merge must rerun route-appropriate evidence on the merged state");
assert.doesNotMatch(skill, /npm test\s*\/\s*cargo test|pytest\s*\/\s*go test/i,
  "finishing must not prescribe a duplicate generic suite");

for (const option of [
  /1\. Merge back to <base-branch> locally/,
  /2\. Push and create a Pull Request/,
  /3\. Keep the branch as-is/,
]) {
  assert.match(skill, option, `branch menu must preserve ${option}`);
}
assert.doesNotMatch(skill, /^4\. Discard this work$/m, "discard must not be a routine menu option");
assert.match(skill, /Discard is never a menu option/i);
assert.match(skill, /explicit user request/i);
assert.match(skill, /exact confirmation `discard`/i);
assert.match(skill, /WORKTREE_PATH=.*show-toplevel[\s\S]{0,160}FEATURE_BRANCH=.*symbolic-ref/i,
  "branch and worktree identity must be captured before changing directory");
assert.match(skill, /Never recompute `WORKTREE_PATH` after changing/i);

const discardSection = skill.split("### Explicit Discard Request", 2)[1].split("## Step 6", 1)[0];
assert.match(discardSection, /normal repository[\s\S]{0,220}git checkout <base-branch>[\s\S]{0,100}git branch -D/i,
  "normal-checkout discard must switch away before deleting the feature branch");
assert.match(discardSection, /named-branch worktree[\s\S]{0,180}Step 6[\s\S]{0,160}git branch -D/i,
  "worktree discard must remove the worktree before deleting its branch");
assert.match(discardSection, /host-owned or detached workspace[\s\S]{0,240}leave the workspace intact/i,
  "host-owned discard must not guess at cleanup");
assert.ok(wordCount(skill) <= 1100, "finishing skill must remain concise");

const fixture = mkdtempSync(path.join(os.tmpdir(), "superpowers-lite-discard-"));
const gitEnvironment = {
  ...process.env,
  GIT_AUTHOR_NAME: "Superpowers Lite Tests",
  GIT_AUTHOR_EMAIL: "tests@example.invalid",
  GIT_COMMITTER_NAME: "Superpowers Lite Tests",
  GIT_COMMITTER_EMAIL: "tests@example.invalid",
};
const git = (...args) => execFileSync("git", ["-C", fixture, ...args], {
  encoding: "utf8",
  env: gitEnvironment,
  stdio: ["ignore", "pipe", "pipe"],
}).trim();

try {
  git("init", "-q", "-b", "main");
  writeFileSync(path.join(fixture, "fixture.txt"), "base\n");
  git("add", "fixture.txt");
  git("commit", "-qm", "base");
  git("checkout", "-qb", "feature");
  writeFileSync(path.join(fixture, "fixture.txt"), "feature\n");
  git("commit", "-qam", "feature");

  git("checkout", "-q", "main");
  git("branch", "-D", "feature");
  assert.equal(git("branch", "--list", "feature"), "",
    "the documented normal-checkout order must make branch deletion executable");
} finally {
  rmSync(fixture, { recursive: true, force: true });
}

console.log("finishing-a-development-branch execution contract checks passed");
