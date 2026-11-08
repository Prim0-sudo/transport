# Transport Town compared with Plants — upgrade audit and implementation handoff

8 November 2026. Prepared for the user to hand to the Transport Town implementation chat.

## Decision

Transport needs a full visual overhaul and a substantial curriculum/product upgrade to meet the accepted Plants/v6 standard. The current app is a useful functional starting point: preserve its recent repairs, suitable source assets and Transport identity. Reworking colours and margins alone will not close the gap.

The biggest weaknesses are small teaching pictures inside oversized panels, an inconsistent two-style vehicle bank, emoji-led interface artwork, only 30 vocabulary concepts, five missing/incomplete standard capabilities, no Teacher curriculum system, no local narration bank, no real media/printables and no substantive applied game yet.

The user has already selected **Transport Dispatch first**, likes **Build the Journey** and **Safe Street** for later, and separately wants an **interactive driving game controlled by mouse/tap and arrow keys**, inspired by Garden Patrol. Preserve those decisions. Do not restart the applied-concept vote or substitute passive dispatch movement for driving.

## Evidence and limits

- Current Transport branch: `codex/v6-upgrade-2026-11-08`; repo: https://github.com/Prim0-sudo/transport; source checkpoint at final review: **112a006**, clean and tracking the same remote checkpoint.
- Actual runtime source is `site/dist/`, despite the directory name. It now includes `lifecycle.js`; no framework rewrite or build migration is necessary to perform this upgrade.
- Stable visual review used an isolated archive of pushed **8b1f70d** because the other chat was editing the live preview during inspection. These screenshots document the unchanged visual baseline, not acceptance of the later lifecycle patch.
- Reviewed launch, menu, Learn, Sort, Identify, Safety, spelling, Flip setup and Wheel, including its selected-word state. Reviewed all **60 vehicle image variants** in full-page galleries and compared Plants launch/menu/large teaching-image presentation. A **390 × 844 CSS-pixel iframe** supplied phone-layout evidence; this is not a physical-device test.
- At **112a006**, a fresh visit to port 4251 successfully opened the menu. A temporary `TransportLifecycle` startup error seen during the other chat's partial edit is resolved; do not log it as a current release blocker.
- The lifecycle implementation has been read and credited, but this report does not certify its overlapping holds, whole-round timing or real browser background behavior. Its post-push review remains due.
- This is a source, visual and content audit, not full listening, safety fact verification, full-round regression, production parity or classroom acceptance. No new automated test suite was run for this comparison. Earlier focused test evidence belongs to the existing upgrade log.

Reference: Plants **355c45f**, accepted by the user after classroom review. Its v6 blueprint is at `E:/Projects/Codex/plants-weekly-game/docs/blueprint-v6.0/START-HERE.md`. The portable package is `E:/Projects/Deliverables/Blueprint-v6.0/Curriculum-Game-Blueprint-v6.0-Plants-completed-2026-11-08.zip`.

The supplied blueprint and historical handoffs describe standards and prior work; they do not grant new publication or paid-generation permission. Current user decisions take precedence.

## What is already fixed — preserve it

| Checkpoint | Existing work | Remaining boundary |
|---|---|---|
| 1a09ad4 / ed8c3f7 | Eight distinct spelling misses, free repeats, punctuation shown, M/F letter priority, input guards and terminal protection | Correct successful-with-misses scoring, meaningful clue and approved Transport artwork still needed |
| Same batch | Flip mismatches remain visible until the next selection; resolved pairs remain visible; concealed labels removed from accessibility tree | New curriculum pools, feasible small counts and setup artwork still needed |
| Same batch | Back/Home/Escape distinctions; meaningless Flip setup progress hidden | Maintain this behavior in all new nested routes |
| Same batch | Supervised, workspace-aware preview on 4251 with source refresh/recovery | Preserve it; do not start ad hoc conflicting servers |
| 112a006 | Owned active-time delayed work, navigation cleanup, visibility/page holds, overlapping named holds and effect muting | Teacher UI is not implemented; focused post-push lifecycle checks remain due; new animation still needs GSAP/MotionPath |

The old initial audit contains superseded statements such as “no concept selected,” “no full redraw approved” and “no visibility controller.” Use the newer decisions and checkpoint above when planning. Do not rewrite historical evidence to pretend it was known earlier.

## Capability gap against the twelve-slot contract

| Slot | Transport now | Work required |
|---:|---|---|
| 1 Meet the Words | Meet the Vehicles, 30 fixed-sequence entries | Category/collection choice, large semantic pictures, Previous/Next/history, curriculum scope and clear practice progress |
| 2 Sort It | Land/water/air classification | Authored criteria, eligible memberships and contextual artwork; do not force spacecraft or overlapping purposes into misleading choices |
| 3 Detective | Locked Sound Detective placeholder | Implement visual Silhouette/Pixel/Mosaic; 120 nonrepeating tiles, 30/45/60 seconds, active-time holds and fair guessing; remove locked legacy route or migrate it |
| 4 Which One Is It? | Playable, basic picture toggle | Independent target/answer picture controls under Teacher, persistent stable choices and meaningful close distractors |
| 5 Knowledge & Safety | Eight questions, seven sampled per run, text/emoji cues | Reviewed stable-ID questions, three defensible choices, explanation and actual scenario art |
| 6 Theme spelling | Ice Cream Meltdown | Transport-specific approved visual metaphor, identifiable clue and successful-round scoring alignment |
| 7 Flip the Tiles | Playable and comparison behavior repaired | Illustrated compact setup, feasible scoped counts, generously sized artwork and accurate counts |
| 8 Spin the Wheel | All 30 markers, clipped edge icons, text-only selected view | Category/All routes, readable batching, fair queue, full-bank coverage and large selected teaching picture |
| 9 Media | Missing | Real Printables/Books/Videos; honest Songs deferral; nested navigation and playback controls |
| 10 Transport Games | Missing | Dispatch first, plus the separately requested driving game; feature latest substantive game above standard tiles |
| 11 Phonics & Sight Words | Missing | Port approved shared foundations and author honest topic sound/reading plans; separate deferred series expansion |
| 12 Read, Draw & Talk | Missing | Authored short readings, relevant art and concise teacher-led prompts; honest off-screen drawing/talk |

Transport currently exposes eight menu positions and seven playable entries. Four new menu positions plus replacement of the locked slot produce twelve; the feature banner is an extra entry point, not slot thirteen. Plants' three applied games are useful benchmarks, not a requirement to clone three garden games.

## Screen-by-screen visual findings

Priority **P1** means required before calling this v6 upgrade complete; **P2** means important polish or depth after its dependency is settled. No current catastrophic P0 blocker was established by this audit.

| ID / priority | Screen and evidence | Required correction / acceptance |
|---|---|---|
| VIS-01 P1 | Launch: large white rectangular bus-emoji control over flat cartoon scenery | New illustrated Transport identity, real circular Explore control, individual Sound/Fullscreen/Teacher artwork; retain clear single action |
| VIS-02 P1 | Menu: platform emoji dominate eight generic tiles | Twelve picture-led tiles in fixed order; coherent topic palette/type; direct illustrated Dispatch banner when it exists |
| VIS-03 P1 | Learn: heading/blank bands overpower car; phone screenshot still puts learning content far down the card | Enlarge actual visible vehicle, reduce heading/empty bands, keep useful definition and hearing/navigation together; check actual alpha bounds rather than image element size |
| VIS-04 P1 | Sort: small vehicle and generic category illustrations | Make vehicle and meaningful road/rail/water/air context the focal teaching pair; group prompt, choices and feedback |
| VIS-05 P1 | Identify: generic text-heavy presentation and inconsistent picture scale | Large balanced choices with clear target; picture hiding collapses unused space without rerolling |
| VIS-06 P1 | Safety: traffic/seatbelt/crossing situations represented by emoji/text | Purpose-built safe scene artwork at readable phone/projector scale; teach the situation, not a decorative symbol |
| VIS-07 P1 | Spelling: unrelated ice-cream scene; no useful vehicle picture clue in reviewed state | Approved Transport metaphor and substantial clue; keyboard, status and animation coexist without empty panel bands |
| VIS-08 P1 | Flip setup: three pink text boxes, little theme identity | Full-width, content-height illustrated choices for up to 10/20/30 words; honest actual eligible counts; no giant empty card |
| VIS-09 P1 | Wheel: 30 tiny markers, icons cut by circumference | Inset/fit readable markers, batch if necessary; never lose a word merely to fit artwork |
| VIS-10 P1 | Wheel result: giant “YACHT,” blank card, no selected teaching picture | Large current artwork, readable word/definition, Hear/Next grouped with the subject |
| VIS-11 P1 | Shared card/shell: fixed inner maximums and translucent blank areas reveal ghost town scenery | Use available outer width; activity-specific height; light coherent surfaces, avoid backdrop noise through teaching content |
| VIS-12 P1 | Background: flattened scene with baked clouds; parade mixes water/air vehicles along road-level movement | Four registered planes and independent actors; clear road/rail/water/air contacts, direction and purposeful travel |
| VIS-13 P2 | Results, empty scopes, tiny pools and future nested pages | Apply the same full-width/content-height rule to every state; completion has clear next/replay/parent actions and meaningful counters |

Desktop evidence files include `transport-learn-desktop.png`, `transport-flip-setup-desktop.png`, `transport-wheel-desktop.png` and `transport-wheel-selected-desktop.png`. Phone evidence is specifically `transport-menu-phone-frame.png` and `transport-learn-phone-frame.png`. The separately captured `transport-learn-phone.png` used an ineffective viewport override and is **not phone evidence**; it is excluded from the delivery package.

### Visual overhaul brief

Keep a distinct Transport world: places, routes, vehicles and useful journeys. Match Plants' craftsmanship and legibility rather than copying green garden colours or botanical props. Present three comparable art directions for the overall overhaul before final production. Dispatch is already the selected game; its next creative gate is the detailed layout/movement preview, not three new game pitches.

The production list must include:

1. Four actual camera-aligned scenery planes: clean sky, distant town/landscape, navigable middle ground with road/rail/water, foreground framing. UI and actors remain separate. Moving clouds require clean sky backing.
2. Purposeful actor sets with measured facing, contacts/pivots, turn/walk/drive states where required, supported paths and correct occlusion. Generate real approved bitmap assets for the established style; do not replace missing artwork with emoji or rushed code drawings.
3. Launch/brand, Explore, Sound, Fullscreen, Teacher, twelve menu icons, category/collection icons, feature banner and genuine resource/topic thumbnails. Reuse coherent accepted controls if appropriate.
4. Approved individual teaching subjects and contextual comparisons, safety scenes, Dispatch/driving assets, spelling states and media art. Exact counts follow the curriculum and approved briefs, not an arbitrary image quota.
5. Source prompts/references, originals, dimensions/hashes, licensing, derivatives, alpha bounds, anchors and keep/repair/reject decisions.

Motion must use GSAP and MotionPath for coordinated curves, responsive paths, reduced-motion equivalents, owned cleanup and independent hidden/Teacher holds. Prefer transformed images/opacity over repainting the whole scene. Preview complete loops at phone scale, including contact, dwell, exit and restart. Do not add a visible Pause button.

## Vehicle artwork audit — all 60 variants reviewed

There are 30 `emoji-codex` PNGs (512-square) and 30 `emoji-user` PNGs (1254-square). Neither folder name establishes provenance or quality. `vehicleEmojiPath()` currently alternates styles by round and vehicle index. That is an implementation shortcut, not a reviewed alternate-example curriculum.

| ID / priority | Concrete finding | Required action |
|---|---|---|
| ART-01 P1 | `space shuttle` uses a winged shuttle in one bank and `rocket_ship.png`, an upright generic cartoon rocket, in the other | Separate concepts or select a correct canonical shuttle; no silent rocket/shuttle interchange |
| ART-02 P1 | `rickshaw` alternates a pulled cart and motorised auto-rickshaw, while definition describes pulled/bicycle cart | Deliberately label pedal/pulled/auto variants; align definition, image, sort membership and speech |
| ART-03 P1 | Train includes a face-bearing toy/Thomas-like engine; codex ambulance/glider also have faces; styles vary from toy to semi-realistic | Pick a coherent teaching-art direction; replace distracting faces/toy geometry for factual identification and retain originals as source history |
| ART-04 P1 | Bus/school bus are both yellow; van/minibus and boat/speedboat/ferry have overlapping visual cues | Author clear canonical examples and context; avoid unfair same-category distractors without visible distinctions |
| ART-05 P1 | Kick-scooter imagery with motor-or-foot definition | Separate motor scooter/kick scooter where taught, or narrow definition and label |
| ART-06 P1 | Generic icons and picture boxes hide useful visible size | Derive presentation from whole-subject bounds; contain without stretch, excessive internal whitespace or cropped wheels/rotors |
| ART-07 P2 | Provenance/acceptance for old banks absent from checkout | Recover known sources/licenses and record unknowns; do not invent ownership or treat folder name as approval |

Every current label was visually covered: car, bus, bicycle, motorcycle, scooter, train, subway (metro), taxi, truck, van, tram, minibus, school bus, police car, ambulance, fire engine, tractor, rickshaw, skateboard, boat, ship, ferry, speedboat, yacht, jet ski, airplane, helicopter, hot air balloon, glider and space shuttle. The two full-page bank screenshots retain both variants for all labels.

Recommendation: rebuild the interface/environment coherently and standardise the teaching library through explicit per-entry decisions. Do not automatically discard an accurate, useful whole-subject original; do not keep a wrong image simply because its file loads. The full visual overhaul is approved as work scope, while its creative/asset approval stages remain required.

## Curriculum and teaching depth

| ID / priority | Gap | Deliverable / completion criterion |
|---|---|---|
| CUR-01 P1 | 30 vehicle labels versus Plants' 130 useful words | Plan at least 120 useful reachable concepts where supported: at least 90 additions to the current 30, adjusted for merged/corrected entries; no alias or heading padding |
| CUR-02 P1 | Labels/filenames act as identity | Stable IDs; display labels, aliases and canonical spelling separated; definitions/examples, alt text, categories, levels, lessons, collections and activity eligibility authored |
| CUR-03 P1 | No levels, six-lesson mapping or collections | Level 1/2/3/All, six flexible undated lessons and meaningful collections; consistent intersection across relevant activities |
| CUR-04 P1 | Only land/water/air metadata | Distinguish browsing categories from authored sorting rules: surface, purpose, passenger/cargo, human/engine-powered etc.; review overlaps and space travel |
| CUR-05 P1 | Definitions are often encyclopedia-style or misleadingly universal | Child-readable useful examples, locale review of yellow school buses, scooter/rickshaw terminology and subway/metro alias; fact-check new technical/safety claims against primary sources |
| CUR-06 P1 | Eight unillustrated safety records | Review wording, adult role and scenario context, especially crossing/reversing; stable question/choice IDs, three defensible choices and clear explanation; no invented safety advice |
| CUR-07 P1 | No readings or topic sound plans | Authored short text, picture and draw/talk prompts; explicit approved sound-out/spelling/word-reading eligibility rather than filename guessing |

Proposed six lesson organisers, subject to the teacher's curriculum: (1) everyday journeys; (2) road vehicles, people and places; (3) rail and connected routes; (4) water travel and harbours; (5) air/space and terminals; (6) helpful vehicles, cargo and safe journeys. Candidate additions should include wheels/doors/wings/rotors, drivers/passengers/pedestrians, station/platform/track/bridge/harbour, tickets/stops/routes, loading/boarding/steering and safe actions. This is a planning direction, not an accepted final 120-word syllabus or automatic phonics list.

## Behavior, Teacher and state work

| ID / priority | Source/behavior gap | Required correction |
|---|---|---|
| ENG-01 P1 | No Teacher modal or curriculum scopes | Top-right Teacher; draft/apply/cancel; old attempt saved under old scope; focus containment, phone scroll, Escape and no input leak |
| ENG-02 P1 | No fair exhaustion queues or attempt restoration | Queue by activity, exact eligible pool and relevant rules; return unplayed reservations on exit, preserve answered work; tiny-pool/empty recovery without silent widening |
| ENG-03 P1 | Learn increments score for Next; spelling rewards only zero-miss wins | Separate practice progress from assessment; score a valid independent win once even with allowed errors; assisted reveals/replays do not duplicate stars |
| ENG-04 P1 | Single identification image toggle | Independent target/answer controls; choices/task/score remain unchanged when toggled; text layout uses freed space |
| ENG-05 P1 | Learn lacks category/history; Wheel lacks category/batching | Complete scoped routes and stable Previous/Next/history; all eligible entries reachable before repeating |
| ENG-06 P1 | Locked audio Detective and no visual reveal controller | Implement v6 visual modes with eligible images, neutral concealed descriptions, 120-tile mosaic, correct hold/guess/timing and practice/score distinction |
| ENG-07 P1 | Images are background divs; learning subjects absent as semantic images in reviewed AX state | Useful accessible image descriptions; answer-neutral clues until revealed; hidden Flip faces remain concealed |
| ENG-08 P1 | Lifecycle is newly implemented, not fully verified | Post-push review for overlapping holds, delayed work, mute, navigation, terminal narration, no catch-up and cleanup; preserve the controller rather than building another |
| ENG-09 P2 | Monolithic data/controller/rendering will become hard to extend | Extract small content, eligibility, queue/session, audio and per-mode modules as needed; do not spend the overhaul on an unrequested framework migration |
| ENG-10 P1 | New routes and saved versions not defined | Explicit migration for locked Detective/replaced spelling and future nested games; Home launches, Back goes to parent, feature banner opens intended game directly |

## Audio, media and printing

| ID / priority | Current gap | Required output |
|---|---|---|
| AUD-01 P1 | Browser speech synthesis plus Web Audio tones; no local narration bank | Reuse approved shared clips/resolver and exact pronunciation/gain metadata; generate genuinely missing Amy en-GB narration only after text review and a new authorised cost cap |
| AUD-02 P1 | No complete playback-text inventory | Inventory names, definitions, prompts, feedback, safety explanations, game instructions, reading/book pages and films by stable key; check reuse before synthesis |
| AUD-03 P1 | No topic sound plans or sound-out library | Review plans separately from recorded bytes; preserve approved cuts/gains/attribution; do not claim generic TTS is sound-out teaching |
| AUD-04 P1 | Listening acceptance absent | Full listening at real playback paths; wrong/missing clips, truncation, overlap, volume, mute, hidden/Teacher and completed-clip resume reviewed |
| MED-01 P1 | No genuine Media resources | Real coherent book(s), local film(s), appropriate posters, readable pages and English captions; quantity follows lesson coverage, not blind copying Plants counts |
| MED-02 P1 | No printables | Full bank and useful collection packs, every layout on actual A4: 1 large card, 2 horizontal A5 halves, 4 cards portrait, 8 cards in 4 columns × 2 rows landscape |
| MED-03 P1 | No topic print design/generator | Transport-appropriate substantial border/word band, large images, printer-safe margins, external cut guides; derive PDFs/metadata from canonical content |
| MED-04 P1 | No resource nested-state behavior | Actual Open/Download links; accurate counts/sizes/dates; book Hear/Previous/Next/bookmark, video captions/seek/end/mute; no learner-facing transcripts |
| MED-05 Deferred | Songs; expanded Phonics/Word Families | Keep explicit series backlog, not falsely completed and not an unexpected blocker for this accepted release scope |

Do not reuse the Plants 666-clip count or its US$1 spending approval for Transport. No Transport paid synthesis has been authorised. The exact job size/cost follows the expanded content inventory and exact-text reuse.

The shared expansion backlog remains: merge consonant blends and sound families into one category/page/button; distinguish Topic CVC (CVCC); create a separate reviewed Word Families library (for example -ap and -en with useful real words), associated spelling/blending/listening functions and missing Polly audio. This report does not certify that all of this already exists in Short Vowels.

## Applied-game delivery plan

**Transport Dispatch — selected first.** Detailed preview must show depot/destination layout, route surfaces, suitable vehicle/purpose choices, one complete delivery, unsuitable-choice correction, feedback/completion, difficulty and independent length where useful. Show desktop/phone readability, vehicle turns and actual stop/route contact. Avoid a passive “select answer then watch decorative travel” quiz: the player should make meaningful dispatch/route decisions.

**Interactive driving — explicitly requested separately.** Preserve a controllable vehicle/character world with arrow keys and mouse/tap travel, readable top-down contact and a useful transport objective. Brief mission, route rules, collision/correction, difficulty, camera, shoo-equivalent action if relevant and full reset before assets. Do not copy Patrol birds/crops simply because the controls are similar.

**Build the Journey and Safe Street — liked for later.** Keep them on the roadmap; do not silently turn all four concepts into mandatory first-release scope. Confirm sequencing when the first two are concrete. Safe Street needs especially careful reviewed crossing scenarios and should not reward rushing through unsafe traffic.

Each approved game needs tap and keyboard access, meaningful correction, success, replay/reset, settings persistence, phone control coexistence, hidden/Teacher holds, reduced motion and owned teardown. Difficulty must change decisions/layout/pressure, not only a badge. Preview actual hardest movement/contact before final assets.

## Ordered implementation batches

1. **Use this audit; retain recent repairs.** Confirm branch/current state, read v6 and selected concepts. Finish focused post-push review of 112a006; fix discovered lifecycle defects in a committed/pushed batch before retesting. Keep preview 4251 and Plants 4250 intact.
2. **Foundations plus creative previews.** Stable content schema, proposed curriculum/collections, Teacher drafts/scopes, fair queues/session adapters. In parallel as work streams, prepare three comparable Transport visual directions and the selected Dispatch detailed movement preview. Do not create final assets before approval.
3. **Approved visual system and existing eight slots.** Produce/show approved scenery/UI assets; rebuild launch/menu/header; implement visual Detective and repair existing modes' image hierarchy, spelling scoring/clue, Identify controls, Wheel selected view and compact Flip setup. Preserve the repaired input/matching invariants.
4. **Curriculum, teaching art and narration.** Expand useful concepts in reviewed batches, fix canonical/alias/art mismatches, add context art/readings and explicit eligibility. Inventory/reuse audio and request only the actual missing paid batch. Validate content at the authorised post-push stage.
5. **Applied games.** Dispatch assets/implementation after its approvals; then the separately requested driving activity with its own preview/asset gates. Add direct feature banner and nested Games navigation. Other liked games remain visible roadmap choices.
6. **Resource completion.** Genuine books/films/captions, four A4 outputs for full bank/collections, resource/topic art and actual downloads. Add shared Phonics baseline and Read/Draw/Talk with honest draft/deferred labels.
7. **Every-screen pass and release.** Review launch/menu, each setup/play/feedback/completion/replay/empty state, Teacher and media subpages at laptop, phone and short landscape; commit/push before tests; fix affected failures, then obtain release authorisation, deploy and check live routes/media/downloads. User classroom sign-off closes the release.

Do not stop after each trivial screen. Group useful independent work into reviewable batches, keep the preview updated, preserve approval boundaries for new creative production and report actual blockers clearly.

## Release definition

- All twelve capabilities are reachable in order, with real resources or explicitly agreed deferrals; latest applied banner routes directly.
- Curriculum breadth is useful and honest; pictures, words, definitions, questions and narration agree. Complete art/library audit records acceptance rather than only HTTP success.
- Every main teaching subject/board makes proper use of space; short setups remain full-width and content-height; no unreadable phone art or arbitrary white bands.
- Teacher scopes, tiny pools, queues/history, scoring/input, navigation and replay/reset work across every mode. No visible Pause.
- Post-push functional/visual/content checks cover changed code, full animation cycles, hidden/Teacher overlap, reduced motion, physical-letter shortcuts, audio and complete media playback.
- All four actual-size A4 layouts and full-bank/category downloads are reviewed locally and live; classroom printer checks remain the user's final physical check.
- Existing Pages project **transport** is deployed only when authorised; verify the actual public URL **https://transport-town-7b0.pages.dev/** and **https://ludimi.org/transport/** where in scope. Do not infer `transport.pages.dev`, change shared Workers or update Ludimi pins without the relevant release instruction.
- Record exact build/deployment, deferrals, rollback and classroom acceptance in the current handoff. Do not mark Transport finished merely because Plants is finished.

## Handoff identifiers and rules

Transport local: `E:/Projects/Codex/transport-town`; preview **http://127.0.0.1:4251/**. Plants local: `E:/Projects/Codex/plants-weekly-game`; preview **http://127.0.0.1:4250/**; completed reference, not a new edit target. Current naming registry: `E:/Projects/GAME-NAMING-REGISTRY.json`.

This report adds documentation only. No application source, accepted Plants assets, live deployment, paid audio or account settings were changed for the comparison. The user will carry the report to the Transport chat; no duplicate audit or cross-chat implementation dispatch is needed.
