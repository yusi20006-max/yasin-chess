# YasinChess — Agent Execution State

> Durable, tool-independent checkpoint for resuming work after an agent, model, shell, or device session stops.
>
> This file is a recovery index, not the source of truth. Reconcile it with GitHub and the actual checkout before making changes.

## Verified project state

- Repository: `yusi20006-max/yasin-chess`
- Default branch: `main`
- Last verified main SHA: `fa615a710c65279c2972fb62d14fe1ad3e75657d`
- Latest verified main CI: [run 38022062995 — success](https://github.com/yusi20006-max/yasin-chess/actions/runs/38022062995)
- Last reconciliation date: 2026-10-10 (UTC)
- Open pull request at reconciliation: [#424 — durable agent execution checkpoint](https://github.com/yusi20006-max/yasin-chess/pull/424)
- Open issue at reconciliation: [#366 — physical-phone PWA verification](https://github.com/yusi20006-max/yasin-chess/issues/366)
- Completed immediately before this checkpoint: [#422](https://github.com/yusi20006-max/yasin-chess/issues/422) closed after [PR #423](https://github.com/yusi20006-max/yasin-chess/pull/423) merged; merge commit is `fa615a710c65279c2972fb62d14fe1ad3e75657d`.
- Local working-tree/Termux state: **not observable through GitHub API; must be inspected in the actual checkout before local commands or edits.**
- Kanban: issue [yusi20006-max/kanban#159](https://github.com/yusi20006-max/kanban/issues/159) is closed, but its recorded provisioning runs used process-local in-memory PGlite and a `dev-user` owner. Do not treat that as proof of a durable, authenticated live board. Follow-up execution/runtime work remains open in Kanban issues [#181](https://github.com/yusi20006-max/kanban/issues/181) and [#206](https://github.com/yusi20006-max/kanban/issues/206), with [#217](https://github.com/yusi20006-max/kanban/issues/217) / [PR #218](https://github.com/yusi20006-max/kanban/pull/218) tracking a separate checkpoint.

## Current sequence

1. Finish and merge PR #424 only after the updated checkpoint diff and its fresh required checks are verified.
2. Immediately run the recovery experiment in an isolated test branch/worktree: checkpoint mid-task, stop the first agent/session, start a fresh session, and prove it resumes from GitHub state without duplicate edits, loss of changes, or destructive cleanup. Record exact evidence and outcome.
3. Work on issue #366: verify the exact immutable tag `v0.3.0` at `ac283c851a9b3c6635a320faebfab455dcb075e4`; build and publish only `dist/` as a temporary artifact; download to Termux, verify checksum, and test the artifact on the physical Android phone. Do not move the tag, alter product source/dependencies or Android workflows, or commit generated Termux files.
4. Reconcile Kanban provisioning and persistence. Confirm authenticated ownership and durable storage, exact board columns/cards/references, audit events, idempotency, and an end-to-end workflow. The old process-local PGlite output is not production persistence evidence.
5. Treat the independent cloud runner as a separate infrastructure project: persistent checkpoints/artifacts/logs, secure credentials, bounded retries and concurrency, quota/network interruption recovery, and merge gates. GitHub Actions runners are ephemeral; do not confuse an Actions job with a durable agent host.

## Resume protocol

At every new session, follow this order:

1. Confirm repository URL and inspect `git status --short --branch`, current branch, HEAD, local commits, tracked/untracked changes, and upstream divergence. Never reset, clean, overwrite, or switch away from unknown work.
2. Fetch/read the current remote `main` SHA and compare it with this file. GitHub is authoritative for remote Issues, PRs, commits, checks, and merge state; the actual checkout is authoritative for local working-tree state.
3. List open Issues and PRs, check dependencies and CI, and verify whether the previously active work already exists or was merged. Avoid duplicate branches, PRs, and changes.
4. Select one issue and one isolated branch/worktree. Do not let multiple agents edit the same issue/branch concurrently.
5. Update this file at meaningful milestones and before stopping, including the exact next action and evidence URLs.
6. If a value cannot be verified, say `unknown` and record how to verify it. Never substitute a guess.

## Active-work checkpoint template

Copy and complete this block when starting a specific issue:

- Issue/title:
- Acceptance criteria:
- Dependencies:
- Branch/worktree:
- PR:
- Last completed step:
- Files changed:
- Commits:
- Targeted tests and results:
- Full tests, lint, type-check and build:
- CI status/run URL:
- Known failures/blockers:
- Exact next action:
- Risks or human decisions:
- Local working-tree state (observed in actual checkout):

## Definition of done

An issue is not complete because code was merely edited or a local test passed. Verify all applicable items:

- [ ] Acceptance criteria met with evidence recorded.
- [ ] Relevant regression tests added or updated.
- [ ] Targeted tests and full test suite pass.
- [ ] Required lint, type-check, build and CI checks pass.
- [ ] Diff reviewed; no unrelated files or secrets.
- [ ] PR explains problem, implementation, tests and acceptance criteria.
- [ ] Merge commit and resulting `main` SHA verified remotely.
- [ ] Issue state matches the actual result.
- [ ] This checkpoint updated with the next exact action.

Never force a merge with failing required checks or weaken tests to manufacture a green result. Diagnose failures or record a precise blocker.

## Safe-stop and recovery rules

- Preserve all unknown local changes; do not use destructive Git commands as a shortcut.
- Do not force-push, rewrite shared history, or merge without required checks.
- Never place tokens, API keys, cookies, private user data, or secrets in this file, commits, PRs, or logs.
- Record quota/rate-limit/network/permission blockers and the next safe action.
- Keep checkpoints concise and factual; never commit databases, caches, generated build output, or unrelated files.
- If no safe next action is possible, stop and report the blocker instead of guessing.

## Execution log

Append one entry per meaningful checkpoint, using UTC timestamps and links to evidence.

| Date (UTC) | Issue / PR | Milestone | Evidence / result | Exact next action |
|---|---|---|---|---|
| 2026-10-09 | PR #424 | Initial template committed | `0b888e8820791c3214a252614c727bf2e9e4b04f`; all five recorded workflows passed on that original commit | Reconcile with live GitHub state and latest main |
| 2026-10-10 | PR #423 / Issue #422 | Merged and verified | Main `fa615a710c65279c2972fb62d14fe1ad3e75657d`; post-merge CI run 38022062995 succeeded | Complete and merge this checkpoint PR, then run the isolated recovery experiment |
