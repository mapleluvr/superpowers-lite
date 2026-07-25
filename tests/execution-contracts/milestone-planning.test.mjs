import assert from "node:assert/strict";
import { readRepoFile } from "../helpers/skill-contract.mjs";

const routing = readRepoFile("skills/using-superpowers/SKILL.md");
const brainstorming = readRepoFile("skills/brainstorming/SKILL.md");
const planning = readRepoFile("skills/writing-plans/SKILL.md");
const planReviewer = readRepoFile("skills/writing-plans/plan-document-reviewer-prompt.md");
const specReviewer = readRepoFile("skills/brainstorming/spec-document-reviewer-prompt.md");
const producerText = [routing, brainstorming, planning, planReviewer, specReviewer].join("\n---\n");

assert.match(routing, /Full.*feature[- ]level assurance|feature[- ]level assurance.*Full/is,
  "Full must be the feature assurance level rather than every internal package's process tier");
assert.match(routing, /(?:routine inline|Standard package)[\s\S]{0,180}protected[\s\S]{0,180}(?:isolated )?parallel/i,
  "Full must permit proportional internal package execution tiers");
assert.match(routing, /(?:package|internal work)[\s\S]{0,180}(?:does not|must not)[\s\S]{0,120}(?:weaken|remove)[\s\S]{0,160}(?:L3|final whole-change Review)/i,
  "lower package ceremony must preserve feature-level final assurance");

assert.match(brainstorming, /authority sufficien|sufficient authority/i,
  "brainstorming must test authority sufficiency before asking design questions");
assert.match(brainstorming, /(?:sufficient|already approved)[\s\S]{0,220}(?:reuse|bind)[\s\S]{0,220}(?:writing-plans|execution)/i,
  "sufficient approved authority must enter execution without repeated approval");
assert.match(brainstorming, /(?:unresolved|missing)[\s\S]{0,180}(?:consolidated|single)[\s\S]{0,100}decision packet/i,
  "real unresolved decisions should be gathered into one decision packet when possible");
assert.doesNotMatch(brainstorming, /This applies to EVERY project regardless of perceived simplicity/i,
  "Full must not force repeated design approval when authority is already sufficient");
assert.doesNotMatch(brainstorming, /obtain section-by-section user approval/i,
  "section-by-section approval must not be the universal Full entry path");

for (const field of [
  "acceptanceDelta",
  "publicEntrypoint",
  "terminalE2E",
  "observableSuccess",
  "consumedContracts",
  "laterExclusions",
  "workPackages",
  "plannedRoundCount",
]) {
  assert.match(planning, new RegExp(field, "i"), `current milestone must record ${field}`);
}
assert.match(planning, /current (?:runtime )?frontier.*milestone container|milestone container.*current (?:runtime )?frontier/is,
  "the compatible current frontier must act as one milestone container");
assert.match(planning, /trace[\s\S]{0,180}(?:public entry|publicEntrypoint)[\s\S]{0,240}(?:observable result|terminal)/i,
  "planning must inspect the complete public path before decomposition");
assert.match(planning, /largest cohesive boundary/i,
  "planning must optimize for a large cohesive package rather than the smallest unit");
assert.match(planning, /(?:two to four|2[-–]4)[\s\S]{0,100}(?:work )?packages/i,
  "a milestone should normally contain a small package set");
assert.match(planning, /(?:one to three|1[-–]3)[\s\S]{0,100}(?:execution )?rounds/i,
  "planning must use bounded milestone-local lookahead");
assert.match(planning, /package[\s\S]{0,160}(?:related|multiple)[\s\S]{0,160}(?:source|production)[\s\S]{0,120}test/i,
  "one cohesive package may span related production and test files");
assert.match(planning, /internal RED\/GREEN|RED\/GREEN iterations?[\s\S]{0,120}(?:without|do not)[\s\S]{0,120}(?:new|another)[\s\S]{0,80}frontier/i,
  "internal TDD iterations must not become controller frontiers");
assert.match(planning, /no later milestone|do not (?:predict|precompute)[\s\S]{0,120}later milestone/i,
  "bounded lookahead must not restore a feature-wide static DAG");
assert.doesNotMatch(planning, /Choose the smallest boundary/i,
  "planning must not optimize for the smallest independently verifiable boundary");

for (const reviewer of [planReviewer, specReviewer]) {
  assert.match(reviewer, /authority sufficien|acceptanceDelta|publicEntrypoint|cohesive work package/i,
    "producer reviewers must understand the milestone contract rather than demand micro-frontiers");
}

assert.doesNotMatch(producerText, /Leave[-– ]Undo|budget_exhausted|automatic(?:ally)? (?:abandon|rollback)/i,
  "the active Full workflow must not introduce Leave-Undo behavior");

console.log("milestone planning contract checks passed");
