import assert from "node:assert/strict";
import { readRepoFile } from "../helpers/skill-contract.mjs";

const review = readRepoFile("skills/requesting-code-review/SKILL.md");
const reviewer = readRepoFile("skills/requesting-code-review/code-reviewer.md");
const sdd = readRepoFile("skills/subagent-driven-development/SKILL.md");
const protectedReviewer = readRepoFile("skills/subagent-driven-development/task-reviewer-prompt.md");
const planReviewer = readRepoFile("skills/writing-plans/plan-document-reviewer-prompt.md");
const specReviewer = readRepoFile("skills/brainstorming/spec-document-reviewer-prompt.md");
const forbiddenTerms = [
  [/execution[- ]plan/i, "execution plan"],
  [/routine package/i, "routine package"],
  [/evidence machinery|finalizer/i, "evidence machinery/finalizer"],
  [/readiness[ /]admission[ /]integration/i, "readiness/admission/integration bookkeeping"],
  [/frontier[ /-]package transition/i, "frontier/package transition"],
];
const prohibition = /(?:do not|never|must not)[\s\S]{0,260}(?:independent Review identity|new Review identity|independent Review)/i;

for (const [label, content] of [
  ["requesting-code-review", review],
  ["code-reviewer", reviewer],
  ["subagent-driven-development", sdd],
  ["protected reviewer", protectedReviewer],
]) {
  for (const [pattern, surface] of forbiddenTerms) {
    assert.match(content, pattern, `${label} must prohibit Review identity for ${surface}`);
  }
  assert.match(content, prohibition, `${label} must prohibit a new independent Review identity for those surfaces`);
}

assert.match(planReviewer, /not an independent Review identity|do not dispatch.*(?:plan|readiness).*Review/i,
  "the plan reviewer must not become a default independent Review identity");
assert.match(specReviewer, /not an independent Review identity|do not dispatch.*(?:authority|spec).*Review/i,
  "the spec reviewer must not become a default independent Review identity");

assert.match(review,
  /named Full protected contract identity|final whole[- ]change/i,
  "only protected-contract and final whole-change identities may remain independent Review gates");
assert.match(sdd, /named protected[- ]contract identity/i,
  "SDD must retain a named protected-contract identity");
assert.match(sdd, /final whole change/i,
  "SDD must retain a final whole-change identity");

console.log("Review identity prohibition contract checks passed");
