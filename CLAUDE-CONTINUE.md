# Transport — continuation notes for Claude

Written 2026-11-09 at the end of a Claude session. Read this first, then the existing HANDOFF.md (Codex-era) for background only. Claude is now the main developer; ChatGPT makes the images.

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
| (this one) | Printable PDFs + these notes |

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

## Open work (owner decides order)

1. **Media page layout is wrong** (owner flagged it). It must match Plants: tabs Printables / Books / Videos / Songs, picture rows with Open / Download buttons, and a "Print layout" dropdown. Transport currently uses big card buttons for layout and plain list cards. Copy the Plants Media page structure (`C:\Users\User\Documents\Claude\plants`).
2. Media content: books, videos, songs.
3. **Alphabet sounds: the owner is recording the 26 sounds themself.** Kokoro/Polly attempts were rejected. Do not regenerate; install the recordings when provided.
4. Paid narration (Polly via AWS console) needs a cost estimate and owner OK first.
5. New art from ChatGPT: transparent runtime images, replace the 30 cartoon pictures, then rebuild the flashcard PDFs in `site/dist/printables` (they are generated from current art and will be replaced), Dispatch scenery and top-down vehicle sprites.
6. The separate driving game (Garden Patrol-style controls) after Dispatch, per the upgrade plan.

## Owner's working style (short)

- Plain-language replies, no file names or code formatting in chat unless asked.
- Explain what you will do before doing it; give opinions on ideas.
- Commit and push when a task is done; never ask "commit/push?".
- Play-test yourself in the browser; don't hand verification to the owner.
- Never commit credentials or env files; explain before installing dependencies.
