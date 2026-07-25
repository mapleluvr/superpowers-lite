import assert from "node:assert/strict";
import { readRepoFile } from "../helpers/skill-contract.mjs";

const sdd = readRepoFile("skills/subagent-driven-development/SKILL.md");
const implementer = readRepoFile("skills/subagent-driven-development/implementer-prompt.md");
const inline = readRepoFile("skills/executing-plans/SKILL.md");
const dispatch = readRepoFile("skills/dispatching-parallel-agents/SKILL.md");
const executionText = [sdd, implementer, inline, dispatch].join("\n---\n");

for (const artifact of [
  /\.superpowers\/work\/<run-id>\/manifest\.json/i,
  /milestone[\s\S]{0,80}JSON record|JSON record[\s\S]{0,80}milestone/i,
  /tasks\/T\d+\.md|task cards?/i,
]) {
  assert.match(executionText, artifact, `execution consumers must reference ${artifact}`);
}

assert.match(sdd, /one structured record per gate/i,
  "SDD must default to compact structured gate evidence");
assert.match(sdd, /evidence\/l0\/record\.json[\s\S]{0,240}evidence\/l1\/<package-id>\.json[\s\S]{0,240}evidence\/l2\/record\.json/is,
  "SDD must name compact L0/package-L1/milestone-L2 evidence records");
assert.match(sdd, /finalization\/evidence\/l3\.json/i,
  "SDD must name finalization L3 evidence");
assert.match(sdd, /Do not create[\s\S]{0,180}duplicate.*(?:log|JSON|status|manifest)/i,
  "SDD must prohibit duplicate evidence ledgers");
assert.match(sdd, /hidden dependency[\s\S]{0,160}invalidates? the package map[\s\S]{0,180}rederive[\s\S]{0,120}current milestone/i,
  "hidden dependencies must invalidate and rederive the current milestone package map");
assert.match(sdd, /local package defect[\s\S]{0,220}same current milestone[\s\S]{0,180}correction work package/i,
  "local defects must stay in the current milestone as correction package work");
assert.match(sdd, /two rejected core-contract candidates[\s\S]{0,220}package re-?decomposition/i,
  "repeated core-contract failure must re-decompose packages before another attempt");
assert.match(inline, /current work packages?[\s\S]{0,160}(?:declared )?order/i,
  "Inline must run only the current milestone packages in order");
assert.match(inline, /milestone (?:union )?L2[\s\S]{0,160}exactly once after all current (?:work )?packages/is,
  "Inline must run one terminal milestone L2");
assert.match(dispatch, /net benefit[\s\S]{0,180}(?:Inline fallback|fallback to Inline|choose Inline)/is,
  "Parallel dispatch must fall back to Inline when net benefit is unclear");

assert.doesNotMatch(executionText, /\[BRIEF_FILE\]|task brief|authority brief|scripts\/task-brief|scripts\/review-package|\.superpowers\/sdd\/progress\.md|duplicate progress ledger/i,
  "execution consumers must not reference legacy brief helpers or duplicate ledgers");
assert.doesNotMatch(sdd, /fix wave|final-review ledger/i,
  "SDD finalization must use identity-bound correction and manifest risk rather than old wave/ledger artifacts");
assert.match([sdd, inline, dispatch].join("\n"), /public (?:entry|Entrypoint)|controlled E2E/i,
  "milestone execution must terminate in public-entry or controlled E2E evidence");

console.log("progressive execution consumer contract checks passed");
