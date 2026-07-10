---
name: simplicity-first
description: Mandatory pre-planning filter. Research the simplest viable approaches, simplify repeatedly, and only then prepare implementation instructions.
---
# Simplicity First
Build the smallest system that safely proves the business result.

Before coding: define the result and non-goals without technology; research manual, simplest existing-tool, and automated alternatives; run four passes—remove scope, combine components, remove dependencies, test operational simplicity; score the plan at least 16/20.

Default MVP budget: one repository, one application, one database, zero or one worker, zero or one queue, one deployment target, one provider per function.

Stop and simplify if a second repo/database/queue/deployment appears, more than one worker is proposed without measured load, automation precedes a working manual flow, or local launch requires more than five containers.

Create `SIMPLICITY_REVIEW.md` before PRDs, architecture, schemas, file trees, deployment plans or Codex instructions. It must document business result, non-goals, researched approaches, simplification passes, final workflow, kept/postponed/rejected components, score, risks, manual fallback and evidence required before adding complexity.
