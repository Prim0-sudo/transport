# Miniature World landing integration — 8 November 2026

User approved the actual scenery/vehicle assets and authorized landing implementation in this chat. Consulted blueprint-v6.0/ART-AND-ANIMATION.md and MASTER-CURRICULUM-GAME-BLUEPRINT.md section 2, plus Plants src/core/landing-scene.js lifecycle and camera/contact handling. Used GSAP Core, Timeline and Plugins skills; current official MotionPath/context documentation checked. Existing local vendor bytes retained with their license headers.

The actual game entry at http://127.0.0.1:4251/ now uses the shared clean launch/title/circular Explore/transparent utility structure. The approved upgrade preview at /review/ shares the same production landing controller and assets. Explore reveals each entry's existing menu; Home returns to launch. This landing batch does not implement the remaining curriculum/menu slots or final Dispatch game. The separate interactive driving game remains planned.

Four source planes are registered under a shared 1672 × 941 camera. Static sky fills the outer viewport. Portrait phones show the complete town at the bottom with continuous sky above; desktop/landscape uses the shared cover camera. All actor routes remain in source coordinates and scale with the camera, preserving phase on resize. An airfield/depot occluder reuses source-traced regions of the actual scenery, not regenerated artwork.

Owned GSAP/MotionPath timelines provide a slow depot-bay manoeuvre, a bounded reversing railcar station movement, gentle ferry berth drift, a runway taxi/climb/upper-sky flight and continuous offscreen-to-offscreen clouds. These intentionally respect the approved native views instead of spinning flat vehicle images around unsupported turns. The optional railcar side view remains an approved spare, not a falsely calibrated turning atlas.

Navigation kills/reverts owned timelines and shows stable rest art. Hidden tabs and page-cache holds pause/resume in place. Teacher holds are independent. Device reduced-motion changes and the Teacher Reduce landing movement control revert to a still complete scene. Resize changes only the shared camera, without restarting journeys. Image decoding is awaited and late callbacks are ignored after destruction. No visible Pause control or runtime image/speech generation is added.

Validation is recorded after this useful implementation batch is committed and pushed, following the user's workflow. No public deployment authorized or made.
