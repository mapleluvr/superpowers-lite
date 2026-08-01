import assert from "node:assert/strict";
import { readRepoFile } from "../helpers/skill-contract.mjs";

const router = readRepoFile("skills/using-superpowers/SKILL.md");
const brainstorming = readRepoFile("skills/brainstorming/SKILL.md");
const planning = readRepoFile("skills/writing-plans/SKILL.md");
const inline = readRepoFile("skills/executing-plans/SKILL.md");
const sdd = readRepoFile("skills/subagent-driven-development/SKILL.md");
const readme = readRepoFile("README.md");

assert.match(router,
  /approved Full feature run[\s\S]{0,520}(?:reuse(?:s| the)? (?:same )?run root and manifest[\s\S]{0,520}(?:later milestones|next milestone)|later milestones[\s\S]{0,520}reuse(?:s| the)? (?:same )?run root and manifest)/i,
  "the router must carry one approved Full feature run across milestones");
assert.match(router,
  /(?:Do not|never) create a new run root for internal continuation work/i,
  "the router must prohibit per-package and per-milestone run roots");
for (const [label, content] of [
  ["using-superpowers", router],
  ["brainstorming", brainstorming],
  ["writing-plans", planning],
]) {
  for (const [boundary, pattern] of [
    ["distinct feature", /(?:distinct|new) feature/i],
    ["distinct authority", /(?:distinct|new)(?: feature or)? authority/i],
    ["explicit safe-boundary restart", /explicit safe-boundary restart/i],
  ]) {
    assert.match(content, pattern, `${label} must retain the ${boundary} new-run boundary`);
  }
}
assert.doesNotMatch(router, /Routes apply per task\./i,
  "the old unqualified per-task route rule must not reopen feature assurance");

for (const [label, content] of [
  ["brainstorming", brainstorming],
  ["writing-plans", planning],
  ["executing-plans", inline],
  ["subagent-driven-development", sdd],
]) {
  assert.match(content,
    /(?:active|approved) Full feature run[\s\S]{0,300}(?:reuse|continue)[\s\S]{0,180}(?:same run|existing run manifest|same manifest|new run)/i,
    `${label} must consume the existing feature run instead of reopening it`);
  assert.match(content,
    /(?:package|correction|next|later milestone)[\s\S]{0,180}(?:must not|do not|never)[\s\S]{0,120}(?:create|mint|initialize) a new run/i,
    `${label} must prohibit a new run for internal continuation work`);
}

assert.match(readme,
  /same (?:approved )?Full feature run[\s\S]{0,260}(?:packages|corrections|milestones)[\s\S]{0,180}(?:same run root|same manifest)/i,
  "README must publish feature-run continuity");

console.log("feature-run continuity contract checks passed");
