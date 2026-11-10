# Transport phone artwork audit

Checked the running Transport Town app from `main` at 390 × 844, starting from `d5675e3`. The reference was the approved Painted Field Guide direction and the Plants Blueprint v6.0 artwork contract.

- **Meet the Words:** Navigated All words using the real card and Next session buttons. Reached 121 distinct picture URLs, including the 20 cards with part insets. Every main image loaded and fit the viewport. Reviewed the isolated cutouts on white and dark green for teaching meaning, framing and edge quality.
- **Transport Scenes:** Opened all 24 scenes and pressed all 121 labels. Each selected the right button and description and activated a distinct SVG path over a loaded image. The overlay and image matched in size and position. Reviewed the paths against their subjects at the app's 334 px scene image width. The cycling mix-up was visible in this pass even though every button worked.

## Art repairs

| Art | Repair |
| --- | --- |
| `safety.traffic-light` | Shows the top red lamp lit, with amber and green off. |
| `safety.crossing-signal` | Shows the red standing person lit and the lower walking display off. |
| Street and crossing scene | The vehicle signal shows red only. The green pedestrian signal remains visible, and scene dimensions and highlight coordinates are unchanged. |
| Cycling equipment scene | Swapped the two misassigned traced contours. Reflector selects the amber bicycle reflector and Reflective vest selects the vest. |

The unchanged runtime paths point to the corrected PNGs. The two word masters are 1254 × 1254 RGBA PNGs and their runtime copies are 720 × 720 RGBA PNGs. The [word ledger](content/TRANSPORT-FIELD-GUIDE-ART-LEDGER.json) and [scene ledger](content/TRANSPORT-FIELD-GUIDE-SCENES.json) record the prompts, hashes and provenance. The scene library was regenerated from its art ledger. Only the two corrected SVG path strings changed in the generated library.

## Handoff for Claude

In **Meet the Words → Transport Scenes → Street and crossing → Crossing signal**, the selected picture shows a green walking person. The existing description says “This red figure means wait.” Update that description to match the scene, while retaining the advice to check for traffic before crossing. The isolated Crossing signal word card intentionally shows a different state, red for wait.
