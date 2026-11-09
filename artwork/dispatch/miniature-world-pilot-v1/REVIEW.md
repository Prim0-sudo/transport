# Dispatch Miniature World · first artwork batch

The user approved the map-fit and motion preview, then approved the seven selected assets on 9 November 2026. The selected raster originals are shown in [review.html](review.html). Exact generation prompts, source hashes, alpha modes and visible bounds are in [manifest.json](manifest.json). The approved assets are ready for Claude's app handoff.

| Asset | Selected master | Registration proposal |
|---|---|---|
| Road surface | road-surface.png | Opaque map-space texture clipped to live roads. Keep kerbs, markings, closure and route geometry above it. Use one map-wide texture sample to avoid repeat seams. |
| Bridge deck | bridge-deck-v2.png | West and east entries at the centre of each short edge. The driveable deck is the area between the two timber rails. Overlay lane marks from the live edge. |
| Dock pier | dock-pier.png | Shore contact at top-centre and gangway contact at bottom-centre. Join to the stopped ferry's boarding gap. |
| Island berth | island-berth.png | Water contact at left-centre and shore contact at the sandstone pad on the right. Preserve deck clearance. |
| School bus | school-bus-v2.png | East-facing plan sprite. Pivot at visible centre. Front axle near the forward wheel tabs. Place kerb-side boarding just behind that axle on the lower edge. |
| Taxi | taxi-v2.png | East-facing plan sprite. Pivot at visible centre. Rear passenger contact on the lower edge behind the midpoint. |
| Ferry | ferry.png | East-facing plan sprite. Pivot at visible centre. Boarding gap sits on the upper edge, about one quarter of the visible length from the stern. |

Visible bounds are measured on the unchanged source pixels above alpha 32. Contact points in the table are placement references, with final numeric fit and route clearance to be checked in the integrated map. The bus and taxi have different proportions and should keep them through turns. Their original side and oblique drafts are superseded, as is the bridge draft with stone strips across its entrances. The three superseded originals are preserved in this folder and marked accordingly.

The full-size masters are for review and asset provenance. Claude should derive proportion-preserving runtime sizes after approval, then verify contact on both map aspect ratios, open bridge crossings, closure readability and the ferry's water-only berth-to-berth movement. See the [production brief](../../../docs/DISPATCH-ART-PRODUCTION-BRIEF.md).
