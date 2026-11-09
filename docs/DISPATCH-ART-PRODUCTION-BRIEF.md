# Dispatch scenery and vehicle registration · review draft

Based on Claude’s Dispatch at local main `7d14b5b`, Blueprint v6 [Applied Games](../../plants-weekly-game/docs/blueprint-v6.0/APPLIED-GAMES.md), [Art and Animation](../../plants-weekly-game/docs/blueprint-v6.0/ART-AND-ANIMATION.md), and the previously selected Miniature World direction. This brief is for layout and movement review. The app and final bitmap assets are outside this batch.

The review traces two generated maps from the current browser app. The road sample uses a real 3 × 3 map and a valid station → depot → bridge → police station → school route. The ferry sample uses a real 5 × 5 map with its four live closure markers and a proposed water-only path. In the live game I completed a taxi delivery and a ferry delivery, each through choosing, loading, travel, arrival, and explicit unloading. The ferry was observed on the 390 × 844 viewport, where the live map’s interior measured 317 × 334 pixels. The earlier fixed-town study remains historical.

## Scenery placement

Use a high, nearly overhead painted miniature style, with warm neutral ground, muted greens and slate roads. Keep buildings compact and roads and water distinct. Preserve Claude’s normalized map geometry and every available or closed edge. The map is procedural, so Claude assembles the artwork from registered pieces.

| Plane | Production components | Placement rule |
|---|---|---|
| Backplate | Quiet opaque land texture with clean backing | Full map. Neutral beyond the active road grid. |
| Far terrain | Low-contrast plots, grass, banks and water texture | Land and water clipped by the live geometry. No fixed river width or fixed coastline baked into a bitmap. |
| Play surface | Road and kerb textures, bridge deck and rails, pier, island berth and compact landmarks | Roads follow the same edges used for route decisions. Clip the bridge decoration to each real crossing; split rails if foreground occlusion is needed. Landmarks attach to their current node and must fit clear of hit areas. |
| Foreground | Sparse trees and verge details | Off the driveable surface and clear of touch targets. Hide details first when the city is crowded. |

Controls, route hints, closures, destination rings, labels, people/cargo and vehicles remain independent. Art overlays are pointer-transparent. Claude retains the existing native route controls and the meaning of the feedback. The wide map uses the current 1.7 ratio and the phone map uses the taller 0.95 ratio. Projection of ground follows the map. Vehicle sprites retain their own proportions and rotate in screen space, rather than stretching with the board.

## Motion contacts for the pilot

- **School bus:** front points east in the master file. Register centre pivot, front axle and kerb-side door. Stop at the loading node before boarding, follow the existing road centre through the bridge and into the turn, then hold at the school while unloading. A Hard pickup uses the same stationary door contact and then resumes the remaining route. Show the nose and windscreen clearly at small size; the sprite needs no text.
- **Ferry:** east-facing master, centre pivot, bow and gangway contact. Use separate road-side waiting and water-side berth anchors. The current ferry marker starts on the road-side node and the current route ends at the centre of the island. For the proposed artwork Claude should send the hull from water berth to water berth, with the pier/gangway supplying the passenger connection at each end. Island and dock anchors must be derived from the actual shoreline and sprite footprint. Keep the bow, stern and turning envelope off land. The illustration uses a nominal west-side island berth; it does not define a universal coordinate.
- **Taxi:** shorter east-facing car master with the same centre/door convention. Use it as the scale comparison against the bus and a check that a short vehicle still reads at the dense phone scale.

Starting displayed lengths for the study are about 36 px for the bus and 32 px for the ferry at the measured 317 px phone board, then about 48 px and 43 px on the wide sample. These are review targets. Establish a maximum width from the projected road/berth width, a maximum length from the shortest local segment, and a maximum corner sweep from the road geometry. Revisit scale on the densest 5 × 5 city and for the tractor with its trailer. Use one proportion-preserving sprite scale per active board. Preserve the same scale through boarding, driving, the turn and arrival.

Each approved moving sprite needs a transparent source master, a proportion-preserving runtime derivative, source orientation, visible bounds, pivot, contact anchors, approved scaling range, draw order and source/runtime hashes. Stage GSAP/MotionPath curves against the generated path; use screen-space tangents for facing, hold under Teacher or when hidden, and clear owned movement when leaving the job. Reduced motion should show the same correct stop and unloading state without the journey. The replay in the study is an art review control; the app keeps its own session, scoring and restart behavior.

The current game has ten deliverable vehicle types: bus, school bus, taxi, van, truck, tractor, ambulance, fire engine, police car and ferry. Bicycle is a choice distractor in the current mission templates. Existing Painted Field Guide pictures remain the large chooser illustrations. The moving set needs the overhead view and its own anchors.

**Approval checkpoint:** confirm the quiet modular scenery, relative bus/ferry size and water-only ferry docking. The proposed first production batch is the road/kerb and bridge treatment, the pier/berth pair, and the school bus, taxi and ferry pilot sprites. Show the actual assets for review before Claude wires them into the app. Keep the separate interactive driving game on its own art and controls brief.
