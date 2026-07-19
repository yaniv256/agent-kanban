# Changelog

## 1.1.0-rc.1 — 2026-07-19

### Added

- First-class Ready for Review lifecycle for completed agent work awaiting a
  human review, approval, or decision.
- Review-packet contract requiring the artifact, decision context, exact
  requested decision, validation evidence, risks, and residuals.
- Existing-board setup and migration guidance for Human required cards in Next
  and Blocked.
- Pressure scenarios and a deterministic contract test for review approval,
  requested changes, and non-review dependencies.

### Changed

- Next remains runnable upcoming work; completed human-review handoffs no longer
  occupy its executor queue.
- Blocked remains reserved for concrete task dependencies, not pending review.
- Ready for Review may contain multiple cards without consuming the one-card In
  Progress execution slot.

### Compatibility

- Existing boards must add the new list and classify current Human required
  cards with `docs/ready-for-review-migration.md`.
- Substrates without a reviewed portable attachment action use a durable review
  artifact link as the supported fallback.
