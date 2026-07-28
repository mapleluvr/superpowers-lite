import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const commands = [
  [process.execPath, ["tests/structure.test.mjs"]],
  [process.execPath, ["tests/upstream-sync.test.mjs"]],
  [process.execPath, ["tests/skill-contracts.test.mjs"]],
  [process.execPath, ["tests/skill-pack-contract.test.mjs"]],
  [process.execPath, ["tests/package-artifact.test.mjs"]],
  [process.execPath, ["tests/validate-eval-report.test.mjs"]],
  [process.execPath, ["tests/validate-execution-eval-report.test.mjs"]],
  [process.execPath, ["tests/execution-contracts/run-all.mjs"]],
  ["bash", ["tests/systematic-debugging/test-find-polluter.sh"]],
];

for (const [command, args] of commands) {
  const result = spawnSync(command, args, { cwd: root, stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

console.log("source verification suite passed");
