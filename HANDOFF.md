# Transport Town — current upgrade handoff

Latest user-authorized landing batch: actual Miniature World scenery/vehicle assets are now created and shown for approval, not implemented. Read artwork/landing/miniature-world-v1/README.md, manifest.json and REVIEW.md. Local actual-asset board: http://127.0.0.1:4251/review/landing-assets/. Four genuine aligned planes, separate bus/railcar (two views)/ferry/airplane/cloud. Current gate is asset approval before landing integration; earlier preview-only landing restrictions below are historical. Dispatch and the separate driving game's later gates remain unchanged. Follow AGENTS.md's mandatory blueprint/example-site consultation before every change. No production release.

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

## Latest review and upgrade order

Read docs/UPGRADE-PLAN.md for the current ordered plan and post-push lifecycle evidence. The supplied comparison ZIP and its three report/task/start documents are reference evidence; retain their dated snapshots without re-running the same audit. Five focused scheduler tests and bounded Chrome startup/Wheel-exit review passed after 112a006; real Teacher UI/scopes and physical-tab/OS checks remain open. Preview 4251 is restored/current for user inspection. No broader v6-completion claim follows.


Art direction selected: C · Miniature World. Current creative gate: review DISPATCH-DETAILED-PREVIEW.md and its illustrated/interactive preview; obtain detailed-layout/movement approval before final assets. No runtime art swap or new deployment. Keep the separate interactive driving game on the plan.


## Shared-shell correction

After user feedback, actual deployed Our Town and Plants launch/menu/applied-game frames were opened through their Pages URLs (currently redirecting to Ludimi). The prior separate dark/boxed Dispatch frame is superseded as a shell proposal. Local review: http://127.0.0.1:4251/review/. It uses a full-bleed Miniature World concept scene, shared Explore/header/menu/feature structure and a full-width cream Dispatch surface. Existing menu pictures are provisional layout references; final production assets and approval are still pending. site/dist runtime is unchanged; review source lives outside it. Read review/PROVENANCE.md.
