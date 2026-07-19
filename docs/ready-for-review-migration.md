# Ready for Review board setup and migration

Use this guide when creating an Agent Kanban board or upgrading a board whose
human-review handoffs currently sit in Next or Blocked.

## Canonical lifecycle

Create lists in this order:

1. Backlog
2. Next
3. Blocked
4. In Progress
5. Ready for Review
6. Done

Ready for Review is asynchronous: it may contain multiple completed review
packets while In Progress still contains exactly one active execution card.

## Review-card contract

A card is eligible for Ready for Review only after agent implementation,
verification, and required CE Compound closure are complete. The card includes:

- the actual review artifact as a link or attachment;
- concise context sufficient to judge it;
- the exact requested decision or authorized public action;
- validation evidence, migration or compatibility risks, and known residuals.

Prefer an attachment when the substrate exposes a reviewed portable attachment
action. Use a durable link as the fallback. Do not depend on debugger-only or
unreviewed attachment behavior.

## Migrating an existing board

1. Create Ready for Review between In Progress and Done.
2. Inspect every Human required card in Next.
   - Move it to Ready for Review when it represents review, approval, or a
     decision over completed agent work and its packet meets the contract.
   - Leave it in Next when it represents a concrete non-review human action
     that has not started. It remains part of the executor/priority queue.
3. Inspect every Human required card in Blocked.
   - Move completed review packets to Ready for Review; waiting for review is
     not a task dependency.
   - Keep a card in Blocked only when a separate concrete non-review task must
     finish first and the blocker is linked.
4. For incomplete review packets, return the underlying work to Next as Agent
   runnable. Add checklist items for the missing artifact, evidence, context,
   risks, or exact requested decision.
5. Preserve priority labels. Review order may use priority for human attention,
   but it does not compete for the single In Progress execution slot.
6. Verify the final board model: exactly one In Progress card, no completed
   review packet in Next or Blocked, and every Ready for Review card contains
   its artifact and decision request.

## After review

- Approved and complete: move to Done after confirming closure evidence is
  still current.
- Approved with remaining agent work: update context and return to Next as
  Agent runnable; normal queue selection decides when it resumes.
- Changes requested: capture the requested changes as checklist items, return
  to Next as Agent runnable, and prepare a revised review packet.
- New dependency discovered: move to Blocked only after linking the concrete
  non-review blocker.

For externally visible publication, approval binds the reviewed packet. A
material change to base, head, target, title, body, artifact, or public action
requires a revised packet and renewed approval.
