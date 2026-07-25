import assert from "node:assert/strict";
import { readRepoFile } from "../helpers/skill-contract.mjs";

const sdd = readRepoFile("skills/subagent-driven-development/SKILL.md");
const implementer = readRepoFile("skills/subagent-driven-development/implementer-prompt.md");
const inline = readRepoFile("skills/executing-plans/SKILL.md");
const dispatch = readRepoFile("skills/dispatching-parallel-agents/SKILL.md");
const tdd = readRepoFile("skills/test-driven-development/SKILL.md");
const worktrees = readRepoFile("skills/using-git-worktrees/SKILL.md");
const executionText = [sdd, implementer, inline, dispatch, tdd, worktrees].join("\n---\n");

for (const [label, content] of [["SDD", sdd], ["Inline", inline]]) {
  assert.match(content, /current (?:runtime )?frontier.*milestone|milestone.*current (?:runtime )?frontier/is,
    `${label} must execute one current milestone rather than treating each package as a frontier`);
  assert.match(content, /work packages?/i, `${label} must consume cohesive work packages`);
  assert.match(content, /package L1/i, `${label} must distinguish package-local evidence`);
  assert.match(content, /milestone (?:union )?L2/i, `${label} must own one integrated milestone L2`);
  assert.match(content, /public (?:entry|Entrypoint)|controlled E2E/i,
    `${label} milestone L2 must exercise the public entry or controlled E2E`);
  assert.match(content, /(?:package L1|internal GREEN)[\s\S]{0,200}(?:cannot|must not|does not)[\s\S]{0,160}(?:complete|prove)[\s\S]{0,80}milestone/i,
    `${label} must prohibit internal evidence from claiming milestone completion`);
  assert.match(content, /local (?:package )?defect[\s\S]{0,220}(?:stays|remains)[\s\S]{0,100}(?:same|current)[\s\S]{0,80}milestone/i,
    `${label} must keep local corrections inside the current milestone`);
  assert.match(content, /correction (?:work )?package|package correction round/i,
    `${label} must represent a local correction as milestone-local package work`);
  assert.doesNotMatch(content, /local defect[^\n]{0,160}creates a correction frontier/i,
    `${label} must not mint a new frontier for a local defect`);
  assert.doesNotMatch(content, /contract\/probe milestone/i,
    `${label} must keep a prerequisite probe as a package linked to the blocked public path`);
}

assert.match(sdd, /Full.*feature[- ]level assurance|feature[- ]level assurance.*Full/is,
  "SDD must preserve Full assurance while varying internal execution tier");
assert.match(sdd, /routine inline[\s\S]{0,180}protected contract[\s\S]{0,180}(?:isolated )?parallel/i,
  "SDD must classify work-package execution tiers");
assert.match(sdd, /current milestone[\s\S]{0,220}(?:one to three|1[-–]3)[\s\S]{0,100}rounds/i,
  "SDD must execute the bounded current-milestone rounds");
assert.match(sdd, /same (?:current )?milestone[\s\S]{0,180}(?:across|through)[\s\S]{0,120}(?:package )?rounds/i,
  "package rounds must not mint new milestones or frontiers");
assert.match(sdd, /process[\s\S]{0,80}planned rounds sequentially/i,
  "SDD must process dependent rounds sequentially");
assert.match(sdd, /MILESTONE_BASE[\s\S]{0,240}ROUND_BASE/i,
  "SDD must separate milestone recovery identity from each round dispatch base");
assert.match(sdd, /current round[\s\S]{0,180}native parallel group|native parallel group[\s\S]{0,180}current round/i,
  "SDD must parallelize packages within one eligible round rather than across dependencies");

for (const content of [sdd, dispatch]) {
  assert.match(content, /independently mergeable (?:enabling )?(?:work )?packages?/i,
    "parallel work may include independently mergeable enabling packages");
  assert.match(content, /need not be independently (?:user[- ]visible|useful to the user)|not independently (?:user[- ]visible|useful)/i,
    "parallel packages need not each be standalone user features");
  assert.match(content, /no dependency path[\s\S]{0,120}(?:same|one|current)[- ](?:dispatched )?round|(?:same|one|current)[- ](?:dispatched )?round[\s\S]{0,120}no dependency path|no dependency path[\s\S]{0,120}dispatched group/i,
    "parallel independence must be scoped to one dispatched round or group");
  assert.doesNotMatch(content, /no same-current-milestone dependency path|no same-frontier dependency path/i,
    "cross-round dependencies must not be mistaken for same-group parallel dependencies");
  assert.doesNotMatch(content, /two or more independently useful outcomes/i,
    "the old independently-useful-outcome predicate must be removed");
}

for (const predicate of [
  /frozen.*(?:consumed )?interfaces?|pinned contract/i,
  /disjoint.*(?:owns|writes).*(?:mutable resources|mutableResources)|(?:mutable resources|mutableResources).*disjoint/is,
  /independent package L1/i,
  /no (?:split|unsplit) transaction|transaction.*(?:must not|never).*split/i,
  /critical[- ]path.*(?:benefit|saving)/i,
]) {
  assert.match([sdd, dispatch].join("\n"), predicate, `parallel package admission must retain ${predicate}`);
}

assert.match(implementer, /milestone acceptance|acceptanceDelta/i,
  "the implementer context must include milestone acceptance");
assert.match(implementer, /public (?:flow|entry)|publicEntrypoint/i,
  "the implementer must understand its adjacent public flow");
assert.match(implementer, /adjacent interfaces?\/tests?|adjacent interfaces?[\s\S]{0,80}tests?/i,
  "the implementer must receive wide but curated adjacent context");
assert.match(implementer, /cohesive work package/i,
  "one writer should own a cohesive package rather than one micro-step");

assert.match(tdd, /internal RED[-/ ]GREEN[\s\S]{0,160}(?:work package|package)/i,
  "TDD iterations should occur inside the cohesive package");
assert.match(tdd, /(?:do not|must not)[\s\S]{0,120}(?:create|open)[\s\S]{0,100}(?:frontier|controller round)[\s\S]{0,120}(?:test|assertion|RED)/i,
  "each RED or assertion must not create a controller frontier");
assert.match(worktrees, /current milestone|work package/i,
  "worktree setup and selective baseline must consume milestone/package authority");

assert.doesNotMatch(executionText, /Leave[-– ]Undo|budget_exhausted|automatic(?:ally)? (?:abandon|rollback)/i,
  "execution must not introduce Leave-Undo behavior");

console.log("milestone execution contract checks passed");
