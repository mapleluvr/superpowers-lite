import assert from "node:assert/strict";
import { readRepoFile } from "../helpers/skill-contract.mjs";

const review = readRepoFile("skills/requesting-code-review/SKILL.md");
const reviewer = readRepoFile("skills/requesting-code-review/code-reviewer.md");
const protectedReviewer = readRepoFile("skills/subagent-driven-development/task-reviewer-prompt.md");
const verification = readRepoFile("skills/verification-before-completion/SKILL.md");
const reviewText = [review, reviewer, protectedReviewer].join("\n---\n");

for (const content of [review, reviewer, protectedReviewer]) {
  assert.match(content, /protected contract (?:ID|identity)|named protected contract/i,
    "non-final Review must bind one named protected-contract identity");
  assert.match(content, /final whole[- ]change/i,
    "the final whole change must remain a Review identity");
  assert.match(content, /routine (?:(?:Full|work) )?packages?[\s\S]{0,180}no independent Review|no independent Review[\s\S]{0,180}routine (?:(?:Full|work) )?packages?/i,
    "routine packages must not receive independent Review");
  assert.match(content, /(?:migration|package split|frontier (?:slug|rename)|correction|role renam)[\s\S]{0,260}(?:does not|must not|cannot)[\s\S]{0,120}(?:reset|create)[\s\S]{0,100}(?:Review )?(?:budget|unit|identity)/i,
    "representation changes must not mint a new Review budget");
}

assert.match(review, /one initial review[\s\S]{0,180}one consolidated correction[\s\S]{0,180}one closure review/i,
  "each protected/final Review identity must remain bounded");
assert.match(review, /Standard:[\s\S]{0,140}no independent review/i,
  "Standard must remain self-review only");
assert.match(review, /Standard:[\s\S]{0,320}escalate the task to Full/i,
  "work needing independent Review must route to Full before dispatch");
assert.doesNotMatch(reviewText, /Standard Review identity|Standard-risk|named Standard risk boundary/i,
  "review templates must not recreate a Standard independent-review path");
assert.match(reviewer, /Review identity:\s*\[named Full protected contract identity\s*\|\s*final whole change\]/i,
  "the shared reviewer packet must accept only Full protected/final identities");
assert.doesNotMatch(reviewText, /review-unit type: protected contract, frontier boundary/i,
  "ordinary frontier boundaries must not be independent Review identities");
assert.doesNotMatch(reviewText, /Routine frontiers have no independent task Review/i,
  "Review policy should describe routine packages rather than perpetuate micro-frontiers");

assert.match(verification, /L1[\s\S]{0,120}package-local checks passed/i,
  "L1 claims must use package scope");
assert.match(verification, /L2[\s\S]{0,180}(?:milestone )?(?:integrated )?affected closure passed/i,
  "L2 must claim only integrated milestone affected closure");
assert.match(verification, /L2[\s\S]{0,220}(?:public entry|publicEntrypoint|controlled E2E)/i,
  "milestone L2 must record the public-entry or controlled E2E result");
assert.match(verification, /(?:package L1|internal GREEN)[\s\S]{0,220}(?:cannot|must not|does not)[\s\S]{0,160}(?:milestone|acceptance)/i,
  "package evidence must not substitute for acceptance progress");
assert.match(verification, /L3[\s\S]{0,180}repository-wide.*passed/i,
  "finalization-only repository evidence must remain L3");

assert.doesNotMatch([reviewText, verification].join("\n"), /Leave[-– ]Undo|budget_exhausted|automatic(?:ally)? (?:abandon|rollback)/i,
  "review and evidence contracts must not introduce Leave-Undo behavior");

console.log("milestone review contract checks passed");
