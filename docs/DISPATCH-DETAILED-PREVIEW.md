# Dispatch — Miniature World detailed preview

8 November 2026. User explicitly selected C, Miniature World. This is the detailed-layout/movement approval stage. No final scenery planes, actor sheets, teaching assets or runtime implementation have been produced. Existing local game remains on 4251; this proposal does not replace it. The separate mouse/tap/arrow driving game stays a distinct planned Games activity.

## Current shell correction

The user rejected the separate boxed/dark-header presentation as inconsistent with the games' home screens. The full-bleed shared-shell revision is now the current local review at http://127.0.0.1:4251/review/. It follows direct inspection of deployed Our Town and Plants. The earlier illustrated board remains provenance for Miniature World composition and Dispatch actions; its enclosing shell is superseded, not approved. Review source/provisional-art limits are in review/PROVENANCE.md. Dispatch movement semantics and the separate driving-game plan remain.

## Layout and visual language

Use the selected matte hand-painted miniature world: warm cream, navy structure, clear yellow bus, restrained red rail/van and blue ferry. High, fixed slightly elevated camera; clear road, rail and water support. Desktop has compact utility header, one mission strip, large dominant world, compact vehicle/route choices and one contextual primary action. Phone uses a taller recomposed board, retaining depot, station and routes rather than squeezing the landscape. Primary controls remain immediately below the board, with deliberate page scrolling where necessary. No visible Pause or learner transcript; no extra top-level slot.

Illustrated desktop/phone review: artwork/previews/2026-11-08-miniature-world/dispatch-layout-corrected.png. It proposes composition and style, not approved route geometry, final typography or individual assets. The first render's Van thumbnail was wrong; its corrected sibling uses an actual road panel van. Preserve both with status in manifest.json. Capacity labels are authored examples for these mission vehicles, not universal claims about vans/buses.

Interactive movement study: docs/previews/miniature-dispatch-layout-motion.html; corresponding inline version in this chat. Schematic markers demonstrate interaction/contact/state timing without pretending to be finished Miniature World sprites. Desktop/Phone controls change the actual component width; Teacher holds the scene, edits draft difficulty/reduced motion, Close/Escape discards, Apply restarts deliberately. This is not the production curriculum Teacher modal.

## Mission and state sequence

Objective: take six passengers from depot to station using a suitable vehicle, surface and available route. Player chooses Bus (12 seats), Van (2 seats) or Ferry (water), loads at the depot, chooses bridge or town bypass, dispatches, then explicitly unloads on arrival.

1. Choose: unsuitable vehicle stays at depot. Van gives capacity feedback; Ferry gives surface feedback. The learner can correct freely.
2. Board: six passenger markers leave the pavement queue toward the stopped bus door, one after another over about 1.3 seconds. The bus remains supported and stationary.
3. Plan: Easy permits both genuine road alternatives. Medium has a clearly closed bridge; choosing it leaves the bus at depot and permits correction. Bypass remains valid. The world and task stay stable while choosing.
4. Travel: dispatch follows the chosen road, with rounded curves and facing derived from travel tangent. Preview journey defaults to 7 active seconds, independently reviewable from 4–12 seconds. Smooth acceleration/braking; no unsupported shortcuts across buildings/water. No decorative train/ferry animation in this study.
5. Stop: wheels/support anchor settles at the station stopping bay; bus stays still for the explicit Unload action. No teleport to an unrelated word card.
6. Unload: passengers move from the stopped door onto the platform, staggered, about 1.4 seconds. Completion counts all six; a valid independent delivery earns once. Corrections do not create duplicate rewards.

Hard changes the route task: six aboard at depot, two additional passengers at school, then eight at station. It requires a visible intermediate stop and explicit Collect/Continue actions. The eight fit the authored 12-seat bus. Difficulty changes actual decisions/stops. Production round length is separately proposed as 3/5/7 deliveries; this study demonstrates one complete delivery, not a fully implemented multi-mission session.

Restart repeats this delivery and removes pending movement, leaving prior earned reward intact. Replay demonstrates the journey and earns nothing extra. Teacher scope/difficulty changes deliberately start a new configured attempt. Show movement end is an author-review control outside the product UI; using it marks the run assisted and cannot earn a reward.

## Input, lifecycle and phone equivalents

All choices/actions are native buttons with keyboard focus and touch access; Tab/Enter/Space work. Dispatch is route planning, not the separate direct-driving activity. The driving game's arrow-key and mouse/tap steering remains explicitly planned, with its own brief/preview/assets later.

GSAP owns boarding/travel/unloading timelines; MotionPathPlugin follows curved paths. A ResizeObserver maps normalised contacts into the real board size. Independent Teacher/hidden holds retain current state/time; final release resumes only unfinished work. Reduced motion changes current movement to an equivalent terminal state and retains the delivery decisions. Restart and removal kill owned timelines, observers/listeners and late updates. No new speech is generated; narration inventory/approved local audio comes later.

## Asset plan after detailed-preview approval

Four genuine registered environment planes from one camera: (1) clean sky/backing; (2) distant coast/town/airfield; (3) navigable middle stage with road/rail/water/stop surfaces; (4) foreground framing/occlusion. UI, road closure, passengers, bus/van/ferry and any other actors remain separate. The flattened review painting is not those four planes.

Measure support/tyre contacts, native facing, scale, door, platform endpoints, masks and draw order. A 3D-looking vehicle needs consistent directional poses: do not rotate a single perspective painting like the schematic marker. Prove boarding door contact, a curved turn and final stopping alignment before producing the remaining approved set. Keep shadows independent where needed; no baked moving actors/clouds under overlays. Record exact prompts, originals, hashes, dimensions, derivatives and decisions as each production asset is created.

## Approval boundary

User is reviewing composition, gameplay sequence, correction, movement pacing, phone arrangement and the proposed difficulty/length split. Approval of this detailed preview permits the next actual-asset production/review stage; it is not final asset approval or deployment permission. Exact actor art and whole-cycle contact will be reviewed again once real assets exist. Songs and Phonics/Word Families expansion remain explicit series backlog.

## Focused review evidence

Preview code/docs were committed and pushed as 3c5b2cc before checks. Spacing correction 3af5183 moved passenger count clear of the route; 86275e4 replaced native form submission (blocked by the review iframe sandbox) with an explicit Apply action. Each correction was pushed before its affected recheck. Runtime site/dist was not changed.

- JavaScript parsing passed. Actual in-app-browser preview exercised Van capacity/Ferry surface correction, six-passenger boarding, closed-bridge correction, bypass dispatch, station stopping and unloading, and one earned delivery in Medium with normal motion.
- Teacher opened during travel; the actor transform remained unchanged while open. Close resumed the unfinished journey. No real hidden-tab or OS-preference claim follows; those hooks are implemented but not physically certified here.
- Hard with the explicit reduced-motion preview collected two at school, continued with eight and unloaded all eight. Easy accepted the bridge; a subsequent replay used the alternate bypass and retained one earned delivery without adding another. These are preview interactions, not Transport runtime regression or final sprite acceptance.
- Phone mode measured 390 CSS px, scrollWidth 390 and zero horizontally overflowing controls. Passenger count no longer overlaps the route. Desktop reset to the initial Medium/normal-motion state. Captured warning/error log was empty after the final review.
- Preview uses schematic markers and a flattened illustrated composition. Native-facing/contact quality of real directional sprites, four actual planes, complete physical-device checks and production narration remain future gates. No final assets, paid speech or deployment occurred.

Built-in concept/layout prompts and reference/edit chain: artwork/previews/2026-11-08-miniature-world/PROMPTS.md. User approval of the detailed proposal is still pending.
