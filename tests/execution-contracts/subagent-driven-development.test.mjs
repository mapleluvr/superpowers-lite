import assert from "node:assert/strict";
import { readRepoFile, wordCount } from "../helpers/skill-contract.mjs";

const skill = readRepoFile("skills/subagent-driven-development/SKILL.md");
const implementer = readRepoFile("skills/subagent-driven-development/implementer-prompt.md");

assert.match(skill, /\.superpowers\/work\/<run-id>\/manifest\.json/i,
  "SDD must start from the dynamic run manifest");
assert.match(skill, /frontier execution[\s\S]{0,180}exactly one current frontier|exactly one current frontier[\s\S]{0,180}frontier execution/i,
  "SDD frontier execution must load exactly one current frontier from the manifest");
assert.match(skill, /currentFrontier[\s\S]{0,100}(?:null|none)[\s\S]{0,220}finalization[\s\S]{0,100}ready[\s\S]{0,220}(?:enter|resume|continue)[\s\S]{0,100}finalization/i,
  "a terminal-ready SDD manifest must resume directly into finalization");
assert.match(skill, /(?:null|none)[\s\S]{0,160}(?:stop|invalid|reject)[\s\S]{0,180}(?:unless|except)[\s\S]{0,120}finalization[\s\S]{0,80}ready|(?:unless|except)[\s\S]{0,120}finalization[\s\S]{0,80}ready[\s\S]{0,180}(?:null|none)[\s\S]{0,160}(?:stop|invalid|reject)/i,
  "other null-current-frontier SDD states must fail closed");
assert.match(skill, /milestone[\s\S]{0,80}JSON record|JSON record[\s\S]{0,80}milestone/i,
  "SDD must consume the milestone JSON record");
assert.match(skill, /task cards?/i, "SDD workers must receive task cards");
assert.doesNotMatch(skill, /(?:approved|implementation|executable) plan|task brief|authority brief|\.superpowers\/sdd\/progress\.md|duplicate progress ledger/i,
  "SDD must not consume plans, briefs, or a duplicate progress ledger");
assert.match(skill, /independently mergeable (?:enabling )?(?:work )?packages?/i,
  "parallel SDD must permit independently mergeable enabling packages");
assert.match(skill, /need not be independently (?:user[- ]visible|useful to the user)|not independently (?:user[- ]visible|useful)/i,
  "parallel packages need not each be standalone user outcomes");
assert.doesNotMatch(skill, /two or more independently useful outcomes/i,
  "parallel SDD must remove the micro-frontier predicate");
assert.match(skill, /single canonical integrator/i, "one integrator must own canonical writes");
assert.match(skill, /MILESTONE_BASE/i, "recovery must bind one clean milestone base");
assert.match(skill, /ROUND_BASE/i, "each round must bind one clean dispatch base");
assert.match(skill, /planned rounds sequentially/i, "dependent rounds must execute sequentially");
assert.match(skill, /no dependency path[\s\S]{0,120}(?:same|one|current)[- ](?:dispatched )?round|(?:same|one|current)[- ](?:dispatched )?round[\s\S]{0,120}no dependency path/i,
  "only packages inside one dispatched round must be dependency-independent");
assert.doesNotMatch(skill, /no same-current-milestone dependency path/i,
  "planned later rounds may depend on prior-round outputs");
assert.match(skill, /host-provided isolated workspace/i,
  "implementation workers must use host-provided isolation");
assert.doesNotMatch(skill, /worktree:\s*true|failFast|native Pi/i,
  "SDD must not depend on one host's dispatch schema");
assert.match(skill, /host-native patch capture[\s\S]{0,160}handoff is a \*\*patch\*\*/i,
  "isolated worker output must be treated as a patch handoff");

for (const preflight of [
  /non-empty.*patch|patch.*non-empty/i,
  /renames? and deletions?|renames?\/deletions?/i,
  /changed paths?.*(?:subset|within).*owns/is,
  /overlap/i,
  /git apply --check/i,
  /before (?:any )?patch.*appl/is,
]) {
  assert.match(skill, preflight, `frontier admission must include ${preflight}`);
}
assert.match(skill, /Before any patch[\s\S]{0,500}write sets[\s\S]{0,140}`mutableResources`[\s\S]{0,140}do not overlap/i,
  "complete-set preflight must check both path and mutable-resource overlap");
assert.match(skill, /failed|blocked|unresolved/i);
assert.match(skill, /integrates? zero|zero.*integrat/is,
  "a failed frontier must integrate zero patches");
assert.match(skill, /(?:run|execute).{0,80}L0.{0,120}current milestone/is,
  "controller must run the current milestone L0");
assert.match(skill, /only after L0 passes.{0,100}dispatch/is,
  "dispatch must be gated on passing L0");
assert.match(skill, /(?:failed|unavailable).{0,40}L0.{0,100}(?:zero|no) fanout|(?:zero|no) fanout.{0,100}(?:failed|unavailable).{0,40}L0/is,
  "failed or unavailable L0 must stop fanout");
assert.match(skill, /post-apply L1 failure[\s\S]{0,300}reverse-(?:apply|appl)[\s\S]{0,300}revert every earlier current-milestone commit/i,
  "post-apply L1 recovery must reverse the uncommitted patch before reverting earlier milestone commits");
assert.match(skill, /milestone union L2 failure[\s\S]{0,300}do not reverse-apply[\s\S]{0,300}revert every current-milestone commit/i,
  "post-commit milestone L2 recovery must revert committed milestone changes without reverse-applying a patch");
assert.match(skill, /MILESTONE_BASE.{0,80}tree|tree.{0,80}MILESTONE_BASE/is,
  "failed-milestone recovery must prove the original milestone tree");
assert.match(skill, /without rewriting history|do not rewrite history/i,
  "recovery must use non-destructive history");
assert.match(skill, /milestone (?:union )?L2/i,
  "successful package integration must run milestone affected-closure L2");
assert.match(skill, /repository-wide L3.*finalization|finalization.*repository-wide L3/is,
  "repository-wide L3 must be finalization-only");

for (const evidence of [
  /clean HEAD/i,
  /exact.*commands?/i,
  /tool\/runtime versions?|tool.*runtime.*versions?/i,
  /non-secret external.*hash|external.*non-secret.*hash/is,
  /material invalidation/i,
  /final whole-(?:branch|change) review/i,
  /live effects?.*(?:after|behind).*L3/is,
]) {
  assert.match(skill, evidence, `finalization must include ${evidence}`);
}

assert.match(skill, /hidden dependency[\s\S]{0,160}invalidates? the package map[\s\S]{0,180}rederive[\s\S]{0,120}current milestone/i,
  "hidden dependencies must invalidate and rederive the current milestone package map");
assert.match(skill, /local package defect[\s\S]{0,220}same current milestone[\s\S]{0,180}correction work package/i,
  "local implementation defects must stay in the current milestone as correction package work");
assert.match(skill, /two rejected core-contract candidates[\s\S]{0,220}package re-?decomposition/i,
  "two rejected core-contract candidates must force package re-decomposition");
assert.match(skill, /one structured record per gate/i,
  "gate evidence must default to one structured record");

assert.match(implementer, /task card:\s*\[TASK_CARD_FILE\]/i,
  "implementers must read one task card");
assert.doesNotMatch(implementer, /\[BRIEF_FILE\]|task brief|authority brief|scripts\/task-brief|scripts\/review-package/i,
  "implementer prompt must not reference legacy brief helpers");
assert.match(implementer, /run manifest/i, "implementers must bind the run manifest identity");
assert.match(implementer, /milestone JSON record/i,
  "implementers must bind the milestone record identity");
assert.match(implementer, /mutableResources/i,
  "implementers must verify assigned mutable resources");
assert.match(implementer, /passed L0 evidence|L0 evidence.*passed/i,
  "implementers must require controller-provided passing L0 evidence");
assert.match(implementer, /L0 evidence.{0,120}(?:missing|mismatched).{0,180}(?:BLOCKED|NEEDS_CONTEXT)|(?:missing|mismatched).{0,120}L0 evidence.{0,180}(?:BLOCKED|NEEDS_CONTEXT)/is,
  "missing or mismatched L0 evidence must block implementation");
assert.match(implementer, /exact declared (?:package )?L1/i,
  "implementers must run only the declared package-local command");
assert.match(implementer, /must not run.*(?:package-wide|repository-wide)/is,
  "implementers must not run repository-wide suites");
assert.match(implementer, /package-local checks passed/i,
  "implementer claims must be package-scope-qualified");
assert.doesNotMatch(implementer, /full suite once before committing/i,
  "legacy per-task full-suite guidance must be removed");

assert.ok(wordCount(skill) <= 1358, "SDD skill must not exceed its baseline word count");
assert.ok(wordCount(implementer) <= 832, "implementer prompt must not exceed its baseline word count");

console.log("subagent-driven-development execution contract checks passed");
