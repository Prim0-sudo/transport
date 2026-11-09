# Departure Signal artwork handoff

**Status: awaiting artwork approval.** The four painted planes and five actor/state PNGs are ready for review. No files in the game or the movement preview were changed.

Start with the [artwork gallery](review.html). It stacks the actual PNGs and has stills for ready, four misses, breakdown and a clear track. Each separate asset is visible on cream and navy. The [unlit composite](review-composite.png) is a review image only. Use `rgba/` for implementation; `magenta/` holds the named, opaque chroma-key exports requested for Drive. The sky is opaque in both sets.

- **Source and registration:** [Claude’s brief](../../../art-concepts/spelling-scene/GPT-ART-BRIEF.md), the [movement preview](../../../art-concepts/spelling-scene/preview/index.html), and the [Plants v6 artwork contract](../../../../plants-weekly-game/docs/blueprint-v6.0/ART-AND-ANIMATION.md) guided the art. Keep all four planes on the same 1536 × 1024 camera. The background has paint beneath the gantry legs; the grass plane overlaps the gravel. Keep the wheels and train between the stage and foreground.
- **Train:** The wheel-less body uses the original 1315 × 379 actor frame. All eight centers, the stopped origin, the wheel sprite size and pivot, the rail contact line and the smoke vent are in [registration.json](registration.json). Draw the wheels behind the body. Apply actor translation to the common parent; derive wheel rotation from travel distance and the visible wheel radius so the train does not slide on departure.
- **Signals:** The gantry has its painted unlit housings. Place the red or green art inside each housing as a circular lens overlay, using the *glass* centers and crop from the registration file. These differ slightly from the movement preview’s CSS glow centers. All three independent lamp PNGs share the same lens registration. Keep textual miss feedback available alongside the colours.
- **Smoke and motion:** Reuse the three existing preview puffs, listed in the ledger. Emit from the measured leading-car roof vent, with the reduced-motion plume in a stable pose. No clouds are needed for this scene. Preserve distinct-miss counting, immediate Next, keyboard priority and teardown in the app.

Checked the existing preview’s eight-miss breakdown, reset and win controls, and inspected the final composite at desktop and a 375-pixel browser frame. Checked signal counts in the review stills, wheel contact, layer overlap, alpha and asset dimensions. Real app movement, reduced-motion changes, responsive behavior, reset and scoring still need integration checks.

[Asset ledger](manifest.json) · [Exact built-in ImageGen prompts](prompts.json) · [Registration](registration.json)
