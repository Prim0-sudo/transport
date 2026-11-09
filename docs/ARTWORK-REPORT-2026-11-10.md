# Transport Town artwork report · 10 November 2026

The classroom and Dispatch art packs fill the outstanding visual gaps in the current activities. The packs use the approved Miniature World direction and the existing activity and curriculum IDs. The new work is available in the [artwork gallery](../artwork/classroom/miniature-world-v1/review.html).

| Area | Deliverable | App status |
|---|---|---|
| Meet the Words and Spin the Wheel | Ten painted category covers, including All words, and a separate Transport Scenes entry illustration | Ready for the cover registry |
| Shared results screen | One brass railway medal illustration for activity completion | Ready to replace the generic bus picture |
| Transport Games | One dedicated Driving game card illustration | Ready for the existing Coming soon card |
| Knowledge & Safety | Eight painted question scenes and art for all 24 choices. Twenty answer pictures are new, and four exact subjects come from the approved vocabulary bank | Ready for question and choice ID lookup |
| Vehicle parts | Twenty detail inset placements derived from the existing scene and highlight registry | Ready to accompany the individual part pictures |
| Transport Dispatch | Thirteen destination illustrations, two quiet material fills, and one painted roadworks barrier. The earlier road, bridge, dock pier, and island berth masters complete the modular scenery pack | Ready for placement on the generated board |
| Existing approved art | Twelve menu tiles and Dispatch banner, 121 vocabulary pictures, 24 teaching scenes, ten Dispatch vehicle sprites, and the Departure Signal coastal artwork | Already in the app. Claude's coastal integration is `7f3d9aa`, with the smoke follow-up in `3464402` |

The batch contains 57 new PNG masters. The [classroom ledger](../artwork/classroom/miniature-world-v1/manifest.json) and [Dispatch ledger](../artwork/dispatch/miniature-world-map-v1/manifest.json) map each illustration to an app ID or use and record its exact ImageGen prompt, references, source dimensions, transparency, visible bounds, and SHA-256. Both packs are ready for artwork review and wiring.

To open the gallery from a checkout, run `python -m http.server 4266 --bind 127.0.0.1` from the repository root, then open the [local artwork review](http://127.0.0.1:4266/artwork/classroom/miniature-world-v1/review.html). The game preview is separate at [port 4251](http://127.0.0.1:4251/).

## Classroom wiring

- Map the category IDs `all`, `land`, `water`, `air`, `space`, `part`, `place`, `person`, `action`, and `safety` to the new covers in the shared category view. The separate `scenes` cover belongs on the Transport Scenes entry. Keep each individual teaching scene available in its scene browser. Use the completion medal on the shared results screen.
- Use the Steering wheel illustration on the existing Driving game card in Transport Games. Keep its Coming soon status while the driving game is in planning.
- Use the stable `safety.<question>` ID for the question scene and `safety.<question>.choice-N` for each answer picture. Answer order can be shuffled and restored, so the choice image must follow its ID rather than its visible position. Keep each answer label, the picture toggles, and feedback available. The four reused choices are the seat belt, helmet, life jacket, and pedestrian crossing.
- Pair the 20 vehicle part insets with the existing word pictures. The [inset data](../artwork/classroom/miniature-world-v1/part-insets.json) carries the source scene and hash, source and crop viewBoxes, and the original highlight path and fill rule. Render the image and path in the same SVG coordinate space. This keeps the tyre ring distinct from the wheel and avoids new highlights drifting off the actual part.
- Use proportion-preserving WebP exports as appropriate. For transparent images, leave space around the visible bounds and retain alpha. Verify category labels and counts, the results picture, the red-only question light, and all Safety choices at 390 × 844. Check that the Show pictures controls still work after an incorrect choice and a resumed session.

## Dispatch wiring

Draw the land and water samples through the current map geometry. Use a single board-space texture sample and clip the water to the existing river and harbour paths. Keep the existing road network, closure state, paths, and hit areas as the source of truth. Use the new landmark image for each `PLACES` ID and the barrier art for the current roadworks marker. Preserve the live labels. The dock terminal and island are land illustrations. Use the separately approved pier and berth assets to meet the ferry at water-side points. [Road, bridge, pier, and berth registration](../artwork/dispatch/miniature-world-pilot-v1/REVIEW.md)

Place destination art next to the node or inside its current marker, with a provisional 26–32 px visible footprint at phone size. Maintain a clear corridor for the moving vehicles and hide decorative details first if the dense board gets crowded. Verify a closed bridge, an open bridge, a road pickup and delivery, and the ferry route at both desktop and phone aspect ratios. The landmarks and swatches are modular source art and need this fit check in the running map.

## References and boundaries

The gallery check loaded every picture and showed all 81 entries. I reviewed the new illustrations on cream and navy, checked the map landmarks at 30 px, and verified that the 390-pixel browser frame had no horizontal overflow. The file check verified PNG dimensions, alpha, and hashes, along with all 20 inset crops and their source scene hashes. The gallery is separate from the game. Runtime placement and play checks follow wiring.

The work follows the Plants Blueprint v6 artwork and layout rules. Plants uses recognisable group pictures, a separate completion treatment, and painted teaching choices. Transport's accepted menu and Painted Field Guide set provided the style and factual picture references. Road and crossing pictures were checked against the UK Highway Code, with NHTSA and the U.S. Coast Guard consulted for the vehicle and water safety depictions. [Pedestrian rules](https://www.gov.uk/guidance/the-highway-code/rules-for-pedestrians-1-to-35) · [Vehicle signals](https://www.gov.uk/guidance/the-highway-code/light-signals-controlling-traffic) · [Child safety](https://www.nhtsa.gov/road-safety/child-safety) · [Life jackets](https://www.uscgboating.org/content/frequently-asked-questions.php)

The art pass covers the current activities. The landing scene remains governed by the existing stop instruction. The separate driving game needs its own playable brief before art placement. Media books, videos, and songs require their own content plans. The classroom and map packs are handed to Claude for app wiring.
