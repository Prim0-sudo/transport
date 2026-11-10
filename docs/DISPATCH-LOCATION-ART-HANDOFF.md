# Dispatch location sprites for Claude

Read this handoff and [the Dispatch art brief](DISPATCH-ART-PRODUCTION-BRIEF.md). The 13 new Miniature World paintings use the existing roadside plot layout. The [Plants art blueprint](../../plants-weekly-game/docs/blueprint-v6.0/ART-AND-ANIMATION.md) is the reference for individual transparent art, original and export traceability, and checking in-game legibility.

- [Sprite review sheet](../artwork/dispatch/miniature-world-landmarks-v2/contact-sheet.png)
- [Asset manifest](../artwork/dispatch/miniature-world-landmarks-v2/manifest.json) with the exact prompts, original PNGs, runtime WebPs, visible bounds and SHA-256 hashes
- Runtime images in `site/dist/images/dispatch-map/landmarks-v2/`

## Copy-paste implementation prompt

> In Transport on `main`, read `docs/DISPATCH-LOCATION-ART-HANDOFF.md`, the v2 landmark manifest and the Dispatch art brief. Wire all 13 new transparent location sprites into the actual Dispatch game. In `site/dist/dispatch-view.js`, update the shared `landmark(place)` lookup to load `images/dispatch-map/landmarks-v2/landmark-${place}.webp`. This covers `depot`, `school`, `station`, `hospital`, `dock`, `fire`, `building`, `farm`, `shop`, `houses`, `police`, `park` and `island`. The same lookup handles the island. Keep the existing label and crossing controls and the pointer-transparent `.dw-plot` placement. The exports are already padded and centered for `object-fit: contain`.
>
> Keep roadside lot positions and driveways, route hit targets, roads, bridges, terrain, cargo, vehicles, fire and roadworks markers, and ferry motion and boarding contacts. The dock sprite is the ticket hut on land. The island sprite is the lighthouse landmark at the existing island center. The pier and berth remain separate. Keep versioned paths so the prior art stays available for comparison. Update art checks so every `PLACES` ID resolves to a v2 export and its recorded hash, including the island. Check the running app on port 4251 at desktop and 390 × 844, including the 5 × 5 city and maps with different river positions. Verify landmark silhouettes stay on land and the full path from selecting a vehicle to unloading still works for one road delivery and one ferry job. Report the result and any layout issue with screenshots.

## Registration

The runtime files use a centered square canvas. The anchor is `[96, 96]` on the 192 × 192 canvas, measured from the top-left. Front faces generally look toward the bottom of the screen. The export's square maps to the existing plot dimensions in CSS pixels. Entrances are visual cues. The existing `lot.apron` and pier/berth anchors define passenger and cargo movement.
