# Transport Town upgrade handoff

**Read this first at work.** The upgrade branch is `codex/v6-upgrade-2026-11-08` in [Prim0-sudo/transport](https://github.com/Prim0-sudo/transport). Step 2 and step 3 functionality are ready for local review. Step 4 authoring sources, curriculum and art ledgers, literacy drafts and the exact audio inventory are included. The [progress report](docs/PROGRESS-REPORT-2026-11-09.md) describes what is playable and what still needs review. Landing work remains stopped by the user's instruction.

## Pull and preview

From an existing Transport checkout with a clean working tree, run:

```powershell
git fetch origin
git switch codex/v6-upgrade-2026-11-08
git pull --ff-only origin codex/v6-upgrade-2026-11-08
npm start
npm run preview:status
```

For a new checkout, run `git clone --branch codex/v6-upgrade-2026-11-08 https://github.com/Prim0-sudo/transport.git transport-town`, then run the npm commands inside `transport-town`. The app is at [localhost:4251](http://127.0.0.1:4251/). The preview serves `site/dist` directly with Node built-ins. There is no dependency install or build step. If port 4251 is occupied, identify the owning process before restarting the project's preview. Browser-local attempts belong to the browser profile and do not travel with Git. The earlier `/review/` and `/review/landing-assets/` pages are art and layout references.

## Continue in plan order

1. Read [AGENTS.md](AGENTS.md), [UPGRADE-PLAN.md](docs/UPGRADE-PLAN.md), [STANDARD-ACTIVITIES.md](docs/STANDARD-ACTIVITIES.md) and the relevant Plants blueprint/source before making changes. The Plants reference checkout was `../plants-weekly-game` at `355c45f`, branch `codex/targeted-repairs-2026-10-26` from [Prim0-sudo/plants](https://github.com/Prim0-sudo/plants). Open `docs/blueprint-v6.0/START-HERE.md` there. Our Town was `../our-town-game` at `e60a299` on `main` from [Prim0-sudo/our-town](https://github.com/Prim0-sudo/our-town). The preview can run with Transport alone.
2. The standard-activity review was pushed at `1faa393`. Review the screenshots in `docs/previews/standard-*.png`. New menu, header, category and safety-scenario artwork remains a review item. The 30 existing subjects are pinned to one bank. Landing scene and actors remain as integrated at `859d8af`, with animation verification incomplete. Follow the user's stop instruction for that area.
3. Step 4 review starts with the [126-concept curriculum plan](docs/content/CURRICULUM-REVIEW.md), [art decisions](docs/content/TEACHING-ART-DECISIONS.md), [literacy draft](content/literacy-plan.json) and [recorded audio inventory](docs/audio/RECORDED-AUDIO-INVENTORY.json). The 96 new concepts are draft. The live bank remains 30. Generated output is tracked so a work checkout can review it immediately. Regenerate only after changing the underlying sources.
4. Review the proposed art decisions against the existing 60-variant evidence. Prioritise useful, factual pictures and comparisons. Preserve existing originals and show changed/new assets before integrating them. Review the exact narration list and get a new cap before any paid generation. Port the shared resolver, players, gains, accepted cuts and local recordings before removing browser synthesis. Listening acceptance and teacher approval of lexical plans are separate checks.
5. Step 5 is [Transport Dispatch](docs/DISPATCH-DETAILED-PREVIEW.md), then the separate driving game inspired by Garden Patrol mouse, tap and arrow controls. Review the detailed layout and movement before final assets. Build the Journey and Safe Street are later options. Step 6 covers actual media, printables, literacy and release review.

```powershell
node scripts/prepare-curriculum-plan.mjs
node scripts/prepare-art-ledger.mjs
node scripts/inventory-recorded-audio.mjs
```

For different sibling checkout names, pass `node scripts/inventory-recorded-audio.mjs <PlantsPath> <OurTownPath>` with the appropriate paths. Run focused checks after the useful batch is committed and pushed, following the blueprint. The earlier [comparison audit](docs/PLANTS-COMPARISON-AUDIT-2026-11-08.md), [classroom evidence](docs/CLASSROOM-FOUNDATIONS.md), [initial inventory](docs/V6-UPGRADE-2026-11-08.md) and [legacy handoff](HANDOFF-LEGACY.md) retain historical context.

The Pages project is `transport` and the existing URL is [Transport Pages](https://transport-town-7b0.pages.dev/). Read [the naming notes](docs/HOSTING-AND-NAMING.md) before deployment work. Production release, Ludimi pins and shared service changes require separate authorization. The work branch is the handoff surface.
