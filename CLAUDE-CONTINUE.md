# Transport — continuation notes for Claude

Written 2026-11-09 at the end of a Claude session. Read this first, then the existing HANDOFF.md (Codex-era) for background only. Claude is now the main developer. Codex produced the Painted Field Guide art.

10 November 2026 artwork handoff. The new classroom covers, completion medal, Safety scenes and choices, vehicle part insets, and modular Dispatch map art have a single integration guide in the [artwork report](docs/ARTWORK-REPORT-2026-11-10.md). Use its ID mappings and check the artwork gallery before wiring. The existing coastal Spelling scene and menu artwork are already on `main`.

## Approved menu and Dispatch artwork

The user approved all twelve Miniature World activity illustrations and the separate Dispatch feature banner. Start with [the menu art handoff](artwork/menu/miniature-world-v1/REVIEW.md) and its [mode-to-image ledger](artwork/menu/miniature-world-v1/manifest.json). The three approved pilot originals stay in their original folder and are referenced by the ledger. Wire the images into the existing native menu buttons and banner, retain direct Dispatch navigation, and check the actual desktop and 390 × 844 phone menu. The artwork review's sizing and edge checks are already recorded.

The first Dispatch scenery and sprite batch was approved separately. Its [asset handoff](artwork/dispatch/miniature-world-pilot-v1/REVIEW.md) and [production brief](docs/DISPATCH-ART-PRODUCTION-BRIEF.md) record bridge joins, road clipping, sprite facing and the proposed water-side ferry berth contacts. Keep the procedural road graph and the existing dispatch actions.

The full ten-vehicle overhead fleet is approved for integration. The [fleet handoff](artwork/dispatch/miniature-world-fleet-v1/REVIEW.md) and [asset ledger](artwork/dispatch/miniature-world-fleet-v1/manifest.json) map Dispatch IDs to the seven new PNGs and the existing school bus, taxi, and ferry. Use the recorded pivots, proposed phone sizes, and boarding or loading contacts as starting points. Check stopped alignment and the full turning footprint, especially for the tractor and trailer, on the dense 5 × 5 map. Keep the ferry on its water route and the bicycle as a choice card. The artwork is approved; map and movement checks follow wiring.

## Where things stand

Branch `main` on github.com/Prim0-sudo/transport, pushed and in sync. Work on `main` and push to `main`: the owner does not want work left on side branches (the old `codex/v6-upgrade-2026-11-08` branch is fully merged and kept only as history).

Commits made by Claude this round (newest last):

| Commit | What |
|---|---|
| aee127e | A4 flashcard printables (1/2/4/8 per page) and Read, Draw & Talk cards |
| fbac432 | Plants phonics ported to Phonics & Sight Words |
| 6bae53f | Transport Dispatch game + featured banner on the activity menu |
| 177dcc0 | Dispatch v2: random towns in 3 sizes, 3 difficulties, jobs/rounds, stars, best scores |
| 6e04ee4 | Banner only on the activity menu, not the landing page |
| ffaabb5 | Printable PDFs + these notes |
| d23e839 | Merged Codex's `codex/transport-art-restart` (Painted Field Guide art) into main |
| (art) | Wired the new art into the app (see below) |
| 44267de | Media page rebuilt to the Plants layout |
| 7123726 | Meet the Words matched to Plants |
| (next) | Sort It matched to Plants |

## Painted Field Guide art (wired in 2026-11-09)

Source: Codex's art ledger `docs/content/TRANSPORT-FIELD-GUIDE-ART-LEDGER.json`, scene ledger `docs/content/TRANSPORT-FIELD-GUIDE-SCENES.json`, and the Blueprint v6.0 ART-AND-ANIMATION.md checks they cite.

- All 121 words use `images/vocabulary/<word-id>.png` (transparent). The 30 original words get it in `curriculum.js`; the same PNG is the Detective silhouette (`cutout`).
- Menu cards, category cards and Sort group pictures use vocabulary PNGs; teaching-category cards use the new scene PNGs.
- `scripts/build-teaching-library.mjs` now builds all 24 scenes straight from the scene ledger (its viewBox, labels, notes, paths, initial target first). The 3 hand-traced pilot scenes in `standard-data.js` are gone; the first 3 ledger scenes are the quick buttons.
- Removed: old emoji/category/ice-cream pictures, `teaching-bounds.js` (crop boxes for the old cut-outs).
- Kept on purpose: the Miniature World landing layers and `transport-town-bg.png`. Codex's branch deleted them, but nothing replaces them yet and the landing would break.
- Flashcard PDFs rebuilt from the new originals (40 packs), owner-chosen style 2 (2026-11-09): word in the navy band (no category), picture fitted by its visible outline into a large cream circle with a navy ring, definition underneath. `create-flashcards.ps1 -PreviewDir <dir>` renders sample cards in all three styles.
- Checked at 390x844: every picture URL loads, all 24 scenes and 121 highlights sit inside their pictures, all activities open with no broken images or console errors.
- Size note: the vocabulary PNGs are ~53 MB and the scenes ~50 MB in total; worth compressing (WebP) before release.

Commit identity: `git -c user.name=Prim0-sudo -c user.email=Prim0-sudo@users.noreply.github.com commit ...`, message ending with the Co-Authored-By Claude line.

## Run and test

- No install or build. `npm start` (or `node scripts/serve.mjs`) serves `site/dist` on http://127.0.0.1:4251.
- The server has an allowlist regex: any new file type/path returns 403 until it is added in `scripts/serve.mjs`. Restart the server after editing it.
- Tests: `node --test tests/*.test.mjs` (30 pass).
- Preview at 390x844 (phone first).
- If the browser pane is hidden, the app pauses. For automated play, override `document.hidden`/`visibilityState`, and set the view's `media = {matches:true}` (reduced motion) so animations finish instantly. `TransportDispatch._view()` exposes the live view.

## Dispatch (site/dist/dispatch-view.js + dispatch.css)

- Setup screen: map size (small 3x3 / medium 4x4 / large 5x5 crossings), level (easy/medium/hard), jobs per round (3/5/7), rounds (1/3/5). Saved in localStorage `transport-dispatch-setup`; best scores in `transport-dispatch-best`.
- Town generator: grid, river between middle columns with 2-3 bridges, random streets removed while staying connected, places on crossings, dock on the bottom row, island reached by ferry.
- Each job: pick the right vehicle (easy 2 choices, medium 3, hard 4; wrong picks explain why), then tap crossings to plan the route, then Go (GSAP MotionPath).
- Medium/Hard: roadworks closure on the shortest route. Hard: extra round closures, fuel limit (shortest + 2) and an extra "via" stop (dashed gold ring).
- Stars: right vehicle first time, no closed roads tried, shortest route.
- Automated play of all 9 size/level combos (189 jobs) all reached 3 stars; route length grows from ~2 roads (small easy) to ~6.4 (large hard).

## Meet the Words (matched to Plants 2026-11-09)

- Groups page: "Which words shall we meet?", Groups met/total tracker (localStorage transport-learn-groups-met), tinted cards with pill word counts, 4 columns on tablet. Transport Scenes card kept (Transport extra).
- Word page: 12 words per set, Listen button (reads the example sentence), score shown, definition only on the card, gold 3D buttons with navy Next word / Finish.
- Results (all games): Activity complete, Wonderful travelling!, N stars (Plants rule), score / total, message; Learn shows Next session. Bus picture stands in for completion art.
- Game screen now top-aligned (was centred, left a gap under the top bar); phone header is two rows.
- Missing art vs Plants: painted All words cover, completion picture, painted group covers (Transport uses single vocabulary pictures), close-up detail insets on part words, painted menu-card art.

## Sort It (matched to Plants 2026-11-09)

- Four rules like Plants: Land/water/air, People/engine power, plus new Rails or road? and People or loads? (notes say what is left out). Session variants now rule:<id> for any rule except surfaces.
- Rule cards: pictures, title, count, About this rule (description + notes), Play; Change teaching selection button.
- Rounds: Round n/10 label, Listen text button (all quiz games), no helper line or repeated name under the picture, picture height 30dvh so the round fits a PC screen, picture-over-label answer cards.
- Feedback (all quiz games): green Correct! <word>: <reason> bar with Next, yellow Not that one. Try again! bar, small confetti on correct.
- Missing art: none new; vocabulary PNGs have wide transparent margins so small icons look tiny (a trimmed icon set would help).

## Detective (matched to Plants 2026-11-09)

- Setup: Reveal and Time side by side with labels inline, navy Start Detective; the warning and Change selection / Games only show when the selection cannot play.
- Round: Picture n/10 label, left-aligned title, no helper line, Reveal and Time shown (locked) above the picture, picture left with a navy frame, gold control column right (Start reveal toggles to Stop reveal), answers under the buttons.
- Wrong guess uses the yellow feedback bar; solved shows the green bar with Next, or See results on the last picture.
- Layout keeps two columns down to 761px (tablet) and fits 768x1024, 1280x800 and 375x812 without scrolling; phone hides the locked settings row.
- Missing art: none new; the mosaic only covers the vehicle (trimmed to its outline), so wide vehicles show a short grid in a tall frame.

## Which One Is It? (matched to Plants 2026-11-09)

- Prompt is Find the picture for <word>. (screen and Listen), left-aligned, no helper.
- In-round Hide/Show answer pictures and Hide/Show middle picture buttons, shared with the Teacher panel picture settings; locked once answered. Answer pictures are hidden by class, so wrong guesses survive a switch.
- Middle picture sits in a framed tile; the name no longer pops up under it after a correct answer.
- Phone: three answer cards across, picture over label. Fits 768x1024, 1280x800 and 375x812 including the feedback bar.
- Missing art: none new.

## Knowledge & Safety (matched to Plants 2026-11-09)

- Question n/7 label, left-aligned question, no helper line.
- In-round Show question picture / Show answer pictures checkboxes, shared with the Teacher panel picture settings.
- Question pictures: traffic light, crossing signal and road art for the three road questions (was a generic vehicle); others keep their vehicle.
- Fits 768x1024 and 1280x800 with feedback; phone fits before answering, the long reversing-car feedback scrolls about 100px.
- Missing art: painted answer pictures (answers are still emoji; Plants uses painted pictures), a red-only traffic light (current art shows all three lights), scene art for seat, life jacket and reversing questions.
- Plants plays 10 of 10 questions; Transport plays 7 of 8 (left as is).

## Spelling (matched to Plants 2026-11-09)
- Header "Word n/10"; title and helper hidden; big framed clue picture with a round 🔊 button.
- Letter slots, 8 lights, "n / 8 wrong guesses", 9-column keyboard (green right, faded orange wrong).
- "Great letter!" on a right letter; win "You spelled “X”!", lose "The word was “X”. Let’s try another word!"; button Next word / Finish.
- Removed the definition text and "Reveal word for practice" (Plants has neither).
- Missing: an animated hero scene like Plants' dandelion (owner to pick from variations).

## Flip the Tiles (matched to Plants 2026-11-10)
- Setup: "Choose your matching game" (left), no subtitle or Choose chip; cream cards with a navy face-down tile behind a gold-framed picture tile, Up to N words, N tiles. Phone stacks them as rows like Plants.
- Board: numbered navy tiles (Tile n for screen readers), bigger pictures, Score pill and Matches n/N, Turns counter under the board.
- Finish: green bar You found every matching pair! with See results (was a bare Finish game button).
- Fits 768x1024 (all sizes), 1280x800 (all sizes; 20-tile board capped at 790px), phone 4/5/6 columns (20-tile board scrolls ~55px, like Plants).
- Missing art: none new.

## Spin the Wheel (matched to Plants 2026-11-10)
- Groups page: "Which words shall we spin?" (left), no subtitle, Meet the Words group cards, Groups 0/N and score pill; unfinished last row centred (also on Meet the Words).
- Wheel: up to 12 words a session (was 8), no helper line, Words n/12, score pill shown; pictures 15% on 12-word wheels; wheel capped by screen height so 1280x800 no longer scrolls.
- Reading card: picture, uppercase name, meaning box, gold Hear the word and navy Next (was Hear word / Hear meaning / Next word over the old stage).
- Finish: You read this group of Transport words!
- Fits 768x1024, 1280x800 and 375x812. Missing art: none new.

## Transport Games (matched to Plants Games 2026-11-10)
- Menu: big cream picture cards with the title only (was text buttons with descriptions), no helper line. Dispatch uses dispatch-banner.webp; Driving game is a disabled card marked Coming soon, using transport-games.webp until it has its own art.
- Fits 1280x800, 768x1024 and 375x812 (phone stacks the cards). Missing art: a Driving game card picture.

## Phonics & Sight Words (matched to Plants 2026-11-10)
- Menu: six gold buttons in a 3-column grid, no descriptions or helper, header Reading practice (was text cards with descriptions).
- New sixth section Listen & Read (Plants has it): the 18 Read/Draw/Talk sentences with picture, Find a sentence + Group filters, Hear sentence / Stop reading, word highlight from the browser voice, Previous / Next sentence.
- No recorded Transport sentences exist (narration manifest is empty), so it uses the browser en-GB voice; Plants uses recorded Amy clips. Missing audio: 18 sentence recordings.
- Fits 768x1024; 1280x800 and phone scroll on the reading card like the existing Sound & Blend card does.

## Read, Draw & Talk (matched to Plants 2026-11-10)
- Layout: picture with the sentence as its caption, beside Draw and Talk sections (stacked on phone); no separate word label; title Read, Draw & Talk, Reading card n/18, score pill = cards explored.
- Buttons: Previous (off on card 1), Hear sentence, Mark as explored (shows Card explored. Share your idea when you are ready.), navy Next; last card says See results and opens results (You explored this group of reading cards!). No more wrap-around.
- Also removed the old .reading-word rule, which would have made Listen & Read sentence words uppercase.
- Fits 768x1024 and 1280x800; phone scrolls ~95px (button row wraps). Missing art: none (uses vehicle pictures; Plants has some own scene pictures).

## Menu (matched to Plants 2026-11-10)
- Order, title, featured game banner and picture cards already matched Plants.
- Added the Plants Continue tag: a small navy pill in the top-right corner of any card with a saved unfinished attempt for the current word choice (refreshed each time the menu opens). Card size unchanged.
- Naming left for the owner: Plants calls its spelling game after its scene (Dandelion Drift) and uses plain Detective; Transport keeps Transport Spelling and Transport Detective.

## Classroom and Dispatch art (wired 2026-11-10)

- Source: Codex packs artwork/classroom/miniature-world-v1 and artwork/dispatch/miniature-world-map-v1 (guide docs/ARTWORK-REPORT-2026-11-10.md).
- Runtime WebP exports: site/dist/images/classroom/ (41 + runtime-manifest.json) and site/dist/images/dispatch-map/ (16 + runtime-manifest.json); transparent art cropped to visibleBounds + 3%.
- Classroom: category covers (standard-data.js), Scenes cover, Driving card, completion medal, Safety question scenes + per-choice-ID answer pictures (four reused vocabulary pictures), part insets (SVG crop + original highlight, images/classroom/part-insets.json).
- Dispatch: land texture on the board, water texture via board-space SVG pattern clipped to .dw-water (fitTextures keeps tiles square), painted landmark per PLACES ID inside the marker circle, roadworks barrier art for closures. Roads, closures, paths and hit areas unchanged.
- Checked at 768x1024, 1280x800, 390x844: no overflow, all images load, ferry job runs to completion.

## Queued by owner (after every activity matches Plants)

- Plants presentation: design a full-topic PPT for the Plants game covering every category (everything the videos cover, plus more), and add a separate Media tab called Presentation for it.

## Open work (owner decides order)

1. Media page now matches Plants (2026-11-09): Printables / Books / Videos / Songs tabs (from hubs.media.groups), "Print layout" dropdown (default 4 per sheet), picture rows with Open and Download. Books, Videos and Songs show "No … yet." until content exists.
2. Media content: books, videos, songs.
3. **Alphabet sounds: the owner is recording the 26 sounds themself.** Kokoro/Polly attempts were rejected. Do not regenerate; install the recordings when provided.
4. Paid narration (Polly via AWS console) needs a cost estimate and owner OK first.
5. More art: Dispatch scenery and top-down vehicle sprites (word pictures and scenes are done; see above).
6. The separate driving game (Garden Patrol-style controls) after Dispatch, per the upgrade plan.

## Owner's working style (short)

- Plain-language replies, no file names or code formatting in chat unless asked.
- Explain what you will do before doing it; give opinions on ideas.
- Commit and push when a task is done; never ask "commit/push?".
- Play-test yourself in the browser; don't hand verification to the owner.
- Never commit credentials or env files; explain before installing dependencies.
