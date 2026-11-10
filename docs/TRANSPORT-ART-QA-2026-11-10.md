# Transport art QA and wiring handoff

Checked the running Transport Town app from `main` on 10 November 2026. Art follows the approved Miniature World direction, the Dispatch art brief and the Plants Blueprint artwork contract. The vocabulary, teaching scenes and their data were left in place.

| Browser viewport | What the 12 activity entry screens showed |
| --- | --- |
| 320 × 568 | Images loaded. Knowledge & Safety and Media overflowed horizontally. |
| 390 × 844 | Images loaded. No horizontal overflow. |
| 844 × 390 | Images loaded. No horizontal overflow. |
| 768 × 1024 | Images loaded. No horizontal overflow. |
| 1280 × 800 | Images loaded. No horizontal overflow. |
| 1920 × 1080 | Images loaded. No horizontal overflow. |

Phone spot checks included the illustrated menu, Safety picture choices, the tyre highlight in Scene Explorer, a skateboard Detective silhouette and the steering-wheel vocabulary card. The steering-wheel context inset was missing once, then rendered after reloading and reopening Vehicle parts on tablet and phone. Its index and scene image were present. Dispatch was opened at all three map sizes (9, 16 and 25 crossings), including a Hard 25-crossing map and an Easy taxi route. This is a responsive entry-screen and gameplay spot check, not a manual playthrough of every word or route.

## Artwork ready to place

All five runtime PNGs are in `site/dist/images/dispatch-map/`. The road, bridge, pier and berth are web exports of the approved map pilot art. The fire marker is a new illustration to replace the map emoji. Its full-size 1254 × 1254 transparent PNG is committed under `artwork/dispatch/miniature-world-map-v1/originals/`. The [export ledger](content/TRANSPORT-DISPATCH-ART-QA-LEDGER.json) records source and runtime hashes, dimensions, transparency, crop coordinates and the fire prompt. The five PNGs were inspected on white and dark green. The fire reads at 18 and 22 px.

| Runtime art | Claude placement |
| --- | --- |
| `road-surface.png` | Sample once in board coordinates and clip the texture to the live road network. Keep kerbs, lane marks, route selection, hints and closures on top. The swatch is intentionally opaque. |
| `bridge-deck.png` | Align the midpoint of each open short edge with the road entry and exit. Fit or rotate over the existing bridge span without changing the route geometry. |
| `dock-pier.png` | Place top centre at the north shore contact and bottom centre at the ferry gangway contact. Keep the dock node, actor stop and passenger walk distinct. |
| `island-berth.png` | Align left centre to the water contact and the right sandstone pad to the island shore. Check clearance between the stopped ferry, passengers and berth. |
| `incident-fire.png` | Replace the flame emoji in the existing Dispatch map incident marker. Start at 18–22 CSS px and retain its trigger, position, hide/show behaviour and reduced-motion support. |

## What Claude should implement and recheck

1. Place the five assets above using the existing Dispatch route and contact geometry. Verify the smallest and largest maps at 390 × 844 and at desktop width. Run one bridge crossing and one ferry job through boarding, sailing and unloading. Check that the path still meets the deck and that route feedback stays visible. Preserve the map exports in the build if the runtime directory is regenerated.
2. At 320 × 568, let the Knowledge & Safety picture options wrap or stack. In Media, allow the card and printable selector to shrink within their grid track and let tabs wrap where needed. Recheck both with a full-width phone browser and no sideways scroll.
3. Reproduce the intermittent steering-wheel inset on cold and restored Meet the Words sessions. Confirm the first eligible part card gets its inset as soon as the index loads, without resetting the lesson or replacing the isolated part picture. It worked on both phone and tablet after reload, so no replacement image is needed.

For future art batches, check for live placeholders before generating replacements. An approved master, a runtime image served by the app and a correctly placed image are separate checks. Record each independently. For map art, include the contact points and a proof at actual marker size so the person wiring it can verify alignment without guessing.
