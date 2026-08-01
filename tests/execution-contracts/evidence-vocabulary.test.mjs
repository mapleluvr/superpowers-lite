import assert from "node:assert/strict";
import { readRepoFile } from "../helpers/skill-contract.mjs";

const router = readRepoFile("skills/using-superpowers/SKILL.md");
const planning = readRepoFile("skills/writing-plans/SKILL.md");
const sdd = readRepoFile("skills/subagent-driven-development/SKILL.md");
const verification = readRepoFile("skills/verification-before-completion/SKILL.md");
const worktrees = readRepoFile("skills/using-git-worktrees/SKILL.md");
const readme = readRepoFile("README.md");
const activeText = [router, planning, sdd, verification, worktrees, readme].join("\n---\n");

for (const label of ["Baseline", "Package", "Milestone", "Final"]) {
  assert.match(verification, new RegExp(`${label}\\s*\\(L[0-3]\\)`, "i"),
    `verification must define the human-facing ${label} label`);
}

assert.match(verification, /human-facing labels are canonical/i,
  "verification must identify the human-facing vocabulary");
assert.match(verification, /legacy L0-L3[\s\S]{0,120}compatibility aliases/i,
  "verification must explain the legacy mapping");
assert.match(activeText,
  /Baseline\s*\(L0\)[\s\S]{0,240}Package\s*\(L1\)[\s\S]{0,240}Milestone\s*\(L2\)[\s\S]{0,240}Final\s*\(L3\)/i,
  "active workflow surfaces must publish the complete evidence vocabulary");

assert.match(sdd, /evidence\/l0\/record\.json[\s\S]{0,220}evidence\/l1\/|compatib[\s\S]{0,220}l0/i,
  "SDD must retain legacy l0/l1 paths as compatibility aliases");
assert.match(sdd, /evidence\/l2\/record\.json[\s\S]{0,220}finalization\/evidence\/l3\.json/i,
  "SDD must retain legacy l2/l3 paths as compatibility aliases");
assert.match(planning, /Baseline\s*\(L0\)[\s\S]{0,180}(?:Package\s*\(L1\)|evidence\/l0)/i,
  "planning must bind the labels to the existing evidence fields");
assert.match(readme, /Baseline\s*\(L0\)[\s\S]{0,180}Package\s*\(L1\)[\s\S]{0,180}Milestone\s*\(L2\)[\s\S]{0,180}Final\s*\(L3\)/i,
  "README must document the compatibility vocabulary");
assert.doesNotMatch(verification, /^\|\s*L[0-3]\s*\|/imu,
  "verification must not present bare L0-L3 as the human-facing tier names");

console.log("evidence vocabulary contract checks passed");
