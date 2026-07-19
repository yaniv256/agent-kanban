import assert from "node:assert/strict";
import fs from "node:fs";

const read = (path) => fs.readFileSync(new URL(path, import.meta.url), "utf8");

const skill = read("../SKILL.md");
const readme = read("../README.md");
const methodology = read("../references/methodology.md");
const scenarios = read("./forward-eval-scenarios.md");
const migration = read("../docs/ready-for-review-migration.md");
const changelog = read("../CHANGELOG.md");
const version = read("../VERSION").trim();

for (const document of [skill, readme, methodology]) {
  assert.match(document, /Ready for Review/);
  assert.match(document, /review artifact/i);
  assert.match(document, /exact (requested )?decision/i);
}

assert.match(skill, /only human review, approval, or a decision remains/i);
assert.match(skill, /Human-review handoffs belong in Ready for\s+Review/i);
assert.match(skill, /multiple cards.*Ready for Review.*one.*In Progress/is);
assert.match(skill, /approval.*remaining work.*Next/is);
assert.match(skill, /approval.*completes.*Done/is);
assert.match(skill, /attachment.*preferred.*link.*fallback/is);
assert.match(skill, /Blocked.*non-review.*dependencies/is);
assert.match(skill, /Next.*runnable upcoming work/is);

assert.match(migration, /Backlog.*Next.*Blocked.*In Progress.*Ready for Review.*Done/is);
assert.match(migration, /Human required.*Next/is);
assert.match(migration, /Human required.*Blocked/is);
assert.match(migration, /link or attachment/i);

assert.match(scenarios, /completed review packet/i);
assert.match(scenarios, /requested changes/i);
assert.match(scenarios, /non-review dependency/i);

assert.match(version, /^\d+\.\d+\.\d+-rc\.\d+$/);
assert.match(changelog, new RegExp(version.replaceAll(".", "\\.")));
assert.match(changelog, /Ready for Review/);

console.log("Ready for Review lifecycle contract is present.");
