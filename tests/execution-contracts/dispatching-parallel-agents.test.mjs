import assert from "node:assert/strict";
import { readRepoFile, wordCount } from "../helpers/skill-contract.mjs";

const skill = readRepoFile("skills/dispatching-parallel-agents/SKILL.md");

assert.match(skill, /investigation and implementation|investigations? or implementation/i,
  "parallel dispatch must cover both investigations and implementation units");
assert.match(skill, /\.superpowers\/work\/<run-id>\/manifest\.json/i,
  "implementation dispatch must start from the manifest");
assert.match(skill, /current frontier/i, "dispatch must consume the current frontier");
assert.match(skill, /task cards?/i, "implementation workers must receive task cards");
assert.match(skill, /independently mergeable (?:enabling )?(?:work )?packages?/i,
  "parallel dispatch must permit independently mergeable enabling packages");
assert.match(skill, /need not be independently (?:user[- ]visible|useful to the user)|not independently (?:user[- ]visible|useful)/i,
  "parallel packages need not each be standalone user outcomes");
assert.doesNotMatch(skill, /two or more independently useful outcomes/i,
  "parallel dispatch must remove the micro-frontier predicate");
assert.match(skill, /net benefit/i,
  "parallel dispatch must require coordination cost to be worth it");
assert.match(skill, /Inline fallback|fallback to Inline|choose Inline/i,
  "unclear parallel benefit must fall back to Inline");
for (const predicate of [
  /immutable inputs|pinned contract/i,
  /disjoint (?:write|owns)/i,
  /no dependency path.*(?:same|one|current)[- ](?:dispatched )?round|(?:same|one|current)[- ](?:dispatched )?round.*no dependency path|no dependency path.*dispatched group/i,
  /isolated mutable resources/i,
]) {
  assert.match(skill, predicate, `independence predicate must include ${predicate}`);
}
assert.match(skill, /investigation.*read-only/is, "investigation fanout must remain read-only");
assert.match(skill, /investigation.*(?:omit|without).*worktree/is,
  "read-only investigations may omit worktrees");
assert.match(skill, /implementation.*worktree:\s*true/is,
  "implementation fanout must use isolated native worktrees");
assert.match(skill, /patch handoff/i, "implementation workers must return patches");
assert.match(skill, /subagent-driven-development/i,
  "implementation admission must delegate to SDD rather than duplicate it");
assert.match(skill, /failed.*(?:package set|milestone frontier).*(?:integrates? zero|zero.*integrat)/is,
  "a failed implementation package set must integrate zero patches");
assert.match(skill, /overlap.*sequential|sequential.*overlap/is,
  "overlapping ownership must stay sequential");
assert.match(skill, /milestone (?:union )?L2|L2.*successful integration/is,
  "successful integration must use milestone affected-closure L2");
assert.doesNotMatch(skill, /run (?:the )?full (?:test )?suite/i,
  "parallel dispatch must not prescribe an intermediate full suite");
assert.doesNotMatch(skill, /execution graph|task brief|authority brief|scripts\/task-brief|scripts\/review-package|duplicate progress ledger/i,
  "parallel dispatch must not depend on legacy graph, brief, helper, or ledger artifacts");
assert.match(skill, /one (?:agent|domain) per (?:independent )?(?:problem )?domain/i,
  "each agent must keep one focused domain");
assert.ok(wordCount(skill) <= 950, "parallel-dispatch skill must not exceed its baseline word count");

console.log("dispatching-parallel-agents execution contract checks passed");
