# Transport Town — current upgrade handoff

8 November 2026. Upgrade in progress; no new production release or classroom acceptance.

Repo: https://github.com/Prim0-sudo/transport
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

First batch implemented and pushed as 1a09ad4, with focused corrections ed8c3f7. Post-push parsing, focused model assertions, bounded Chrome spelling/Flip/accessibility/menu review, simulated phone size and preview reuse/recovery passed. Exact evidence/limits are in the audit. No new art, concept production, paid speech or deployment.

Current Pages project identifier: transport. Existing public URL: https://transport-town-7b0.pages.dev/. Existing Ludimi route: https://ludimi.org/transport/. Naming registry/report confirm the rename preserves hostnames/deployments; use transport for future authorized Wrangler operations, never infer transport.pages.dev. Preserve Git connection, paused deployment settings and shared Ludimi Workers. No new release is authorized. Exact current live runtime/deployment identity remains unverified in this checkout. Ludimi pinned source at baseline is untouched; do not update website pins, main, legacy Sites, Pages or account settings without release authorization. Plants remains completed and its port 4250 unchanged.

Next: lifecycle/Teacher/curriculum foundations and the outstanding v6 work. Transport Dispatch (concept 1) is selected first. User likes the other two ideas for later and additionally requests an interactive driving game with mouse/tap and arrow control like Garden Patrol. Detailed layout/movement and asset approvals are still required. See docs/APPLIED-CONCEPTS-2026-11-08.md. New artwork/applied game follows three concepts -> selection -> detailed preview approval -> assets shown/approved -> implementation. Songs and the shared Phonics/Word Families expansion remain on the series backlog.

## Current continuation

Refreshed blueprint/naming read from Plants 355c45f. User-requested Plants fetch/pull completed: clean existing branch already current; source preview 4250 reused, no Plants runtime edit or deployment. Local and live Plants viewed as reference (launch/menu, Patrol/control structure, Teacher, Media/book/films and spelling composition), not a reopened acceptance audit.

Second functional batch: active-time delayed work with independent named holds, hidden-tab animation/speech/effects hold, navigation/round cleanup and mute stopping active effects. Existing CSS art/choreography preserved; this is controller repair, not a new animation concept. Shared GSAP/MotionPath production and approved recorded audio migration remain pending. No tests before its commit/push checkpoint.
