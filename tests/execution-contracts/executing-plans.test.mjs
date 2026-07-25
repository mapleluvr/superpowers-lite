import assert from "node:assert/strict";
import { readRepoFile, wordCount } from "../helpers/skill-contract.mjs";

const skill = readRepoFile("skills/executing-plans/SKILL.md");

assert.match(skill, /\.superpowers\/work\/<run-id>\/manifest\.json/i,
  "inline execution must start from the dynamic run manifest");
assert.match(skill, /frontier execution[\s\S]{0,180}exactly one current frontier|exactly one current frontier[\s\S]{0,180}frontier execution/i,
  "inline frontier execution must load exactly one current frontier");
assert.match(skill, /currentFrontier[\s\S]{0,100}(?:null|none)[\s\S]{0,220}finalization[\s\S]{0,100}ready[\s\S]{0,220}(?:enter|resume|continue)[\s\S]{0,100}finalization/i,
  "a terminal-ready manifest must resume directly into finalization");
assert.match(skill, /currentFrontier[\s\S]{0,100}(?:null|none)[\s\S]{0,220}finalization[\s\S]{0,100}ready[\s\S]{0,220}(?:only then|otherwise)[\s\S]{0,100}(?:enter finalization|stop)/i,
  "other null-current-frontier states must fail closed");
assert.match(skill, /frontier\.json/i, "inline execution must consume the frontier index");
assert.match(skill, /run (?:current )?(?:declared )?work packages?[\s\S]{0,100}(?:declared )?order|(?:declared )?order[\s\S]{0,100}(?:current )?work packages?/i,
  "inline mode must run current work packages in order");
assert.match(skill, /sequentially.*one writer|one writer.*sequentially/is,
  "inline mode must execute packages sequentially in one writer");
assert.match(skill, /(?:run|execute).{0,80}L0.{0,120}before.{0,80}(?:package )?L1/is,
  "the current milestone must pass L0 before package L1");
assert.match(skill, /L0.{0,80}(?:fail|unavailable).{0,80}(?:stop|block)/is,
  "failed or unavailable L0 must stop inline execution");
assert.match(skill, /task cards?/i, "inline execution must use task cards");
assert.match(skill, /exact declared (?:package )?L1/i, "each package must run its declared L1");
assert.match(skill, /milestone (?:union )?L2/i,
  "inline mode must run one milestone union L2");
assert.match(skill, /exactly once after all current (?:work )?packages/i,
  "inline mode must run milestone L2 exactly once after all current packages");
assert.match(skill, /never between (?:work )?packages/i,
  "inline mode must not run L2 between packages");
assert.match(skill, /package-local checks passed/i);
assert.match(skill, /milestone affected closure passed/i);
assert.match(skill, /public (?:entry|Entrypoint)|controlled E2E/i,
  "milestone L2 must exercise a public entry or controlled E2E");
assert.match(skill, /hidden dependency[\s\S]{0,160}invalidates? the package map[\s\S]{0,160}rederive[\s\S]{0,100}milestone/i,
  "inline hidden dependencies must invalidate and rederive the milestone package map");
assert.match(skill, /local package defect[\s\S]{0,180}current milestone[\s\S]{0,180}correction work package/i,
  "inline local defects must stay in the current milestone as correction package work");
assert.match(skill, /(?:two core-contract candidate failures|two rejected candidates[\s\S]{0,120}core-contract)[\s\S]{0,220}package re-?decomposition/i,
  "two rejected core-contract candidates must force package re-decomposition");
assert.doesNotMatch(skill, /execution graph|topological wave|synthetic DAG|task brief|authority brief|duplicate progress ledger|\.superpowers\/sdd\/progress\.md/i,
  "inline execution must not consume legacy graph, brief, or ledger artifacts");
assert.match(skill, /No (?:work )?package or (?:intermediate )?milestone.*L3/i,
  "package and milestone execution must prohibit L3");
assert.match(skill, /finalization.*valid L3 evidence record|valid L3 evidence record.*finalization/is,
  "finishing must require finalization-owned L3 evidence");
assert.match(skill, /finishing-a-development-branch/i);
assert.ok(wordCount(skill) <= 350, "executing-plans must not exceed its baseline word count");

console.log("executing-plans execution contract checks passed");
