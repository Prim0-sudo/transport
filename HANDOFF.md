# Transport Town — current upgrade handoff

8 November 2026. Upgrade in progress; no new production release or classroom acceptance.

Repo: https://github.com/Prim0-sudo/transport-town
Branch: codex/v6-upgrade-2026-11-08
Standalone checkout: E:/Projects/Codex/transport-town
Baseline: 379a55b. Current checkpoint is the commit containing this handoff; consult git log.

Read docs/V6-UPGRADE-2026-11-08.md for inventory, evidence limits and ordered remaining work. HANDOFF-LEGACY.md preserves prior instructions/provenance; current user/v6 directions supersede conflicts. The complete static runtime remains site/dist; preserve suitable originals and topic identity.

## Start/reuse local preview

    git fetch origin
    git switch codex/v6-upgrade-2026-11-08
    git pull --ff-only
    npm start
    npm run preview:status

Preview: http://127.0.0.1:4251/. Node built-ins only; no npm install/build needed. Hidden supervisor reuses the correct workspace server, recovers a failed child and refuses another service's port. Logs/state are ignored under .preview. Source edits are served fresh; CSS refreshes in place, JS/HTML/image changes reload after debounce. No evidence/docs watcher. No app-state persistence claim.

First batch: existing spelling/Flip fairness and input fixes plus preview tooling. No new art, concept production, paid speech or deployment. Verification runs only after commit/push; results belong in the audit record after that checkpoint.

Hosting current production settings/live identity remain unverified. Ludimi pinned source at baseline is untouched; do not update website pins, main, legacy Sites, Pages or account settings without release authorization. Plants remains completed and its port 4250 unchanged.

Next: post-push focused verification, then lifecycle/Teacher/curriculum foundations and the outstanding v6 work. New artwork/applied game follows three concepts -> selection -> detailed preview approval -> assets shown/approved -> implementation. Songs and the shared Phonics/Word Families expansion remain on the series backlog.
