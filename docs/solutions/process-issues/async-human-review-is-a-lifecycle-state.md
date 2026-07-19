---
title: Asynchronous human review is a lifecycle state, not a blocker
date: 2026-07-19
category: docs/solutions/process-issues
module: Agent Kanban lifecycle
problem_type: workflow_state_error
component: task-management
severity: high
applies_when:
  - "Completed agent work awaits human review, approval, or a decision"
  - "A work queue must continue while review packets accumulate asynchronously"
tags:
  - ready-for-review
  - human-review
  - lifecycle
  - blockers
  - queue-semantics
---

# Asynchronous human review is a lifecycle state, not a blocker

## Context

A board without an explicit review state forces completed agent work into the wrong lifecycle bucket. In the
recorded failure, a finished draft awaiting owner review moved to Blocked, acquired an improvised review label,
and required the owner to filter the dependency queue to find it. That preserved the artifact but corrupted the
meaning of Blocked: nothing else had to finish before the review could happen.

The same ambiguity can corrupt Next. A completed packet left in Next competes with runnable work, even though
the agent has nothing left to execute. Leaving it In Progress is worse: the asynchronous human response consumes
the single execution slot and stalls autonomous queue walking.

## Guidance

Model the three human-facing cases separately:

1. **Completed work awaiting review** enters Ready for Review with its artifact, concise context, exact requested
   decision, evidence, compatibility risks, and residuals. Multiple review cards may coexist asynchronously.
2. **A concrete human action that has not started** remains a Human required card in Next. It enters In Progress
   only when no Agent runnable work remains and the action becomes the active handoff.
3. **A real task dependency** uses Blocked only when a separate concrete task must finish first and that blocker
   is linked.

After review, approval moves a complete task to Done. Approval that unlocks more implementation, or requested
changes, returns the card to Next as Agent runnable. A newly discovered non-review dependency moves the card to
Blocked only after the concrete blocker is linked.

The operational contract lives in `SKILL.md`; board creation and repair use
`docs/ready-for-review-migration.md`. The pressure cases in `tests/forward-eval-scenarios.md` guard the critical
transitions, and `tests/ready-for-review-lifecycle.test.mjs` checks that the contract remains present across the
skill, README, methodology, migration guide, version, and release notes.

## Why This Matters

List membership is the durable status signal a memory-less agent trusts on resumption. If review, runnable work,
and dependency blocking share a list, the next agent must reconstruct intent from labels and prose, and queue
automation cannot select work safely. A first-class Ready for Review state makes the status mechanically
decidable while preserving the one-card In Progress invariant.

The key distinction is whether execution is complete, not whether a human is involved. Human involvement can
mean asynchronous review, active execution, or dependency ownership; those cases have different queue effects
and therefore require different lifecycle states.

## When to Apply

- A completed PR packet, design, deployment plan, or release candidate awaits an exact approval.
- Review latency should not stop the agent from promoting the next runnable card.
- Existing Human required cards are mixed across Next and Blocked without a consistent semantic boundary.
- A workflow proposes a generic "waiting on human" label instead of a verifiable state transition.

## Related

- `SKILL.md` — canonical Ready for Review eligibility and after-review transitions.
- `docs/ready-for-review-migration.md` — setup and existing-board classification procedure.
- `tests/forward-eval-scenarios.md` — completed-review, requested-changes, and non-review-dependency pressure cases.
- `CHANGELOG.md` — compatibility impact for the `1.1.0-rc.1` release candidate.
