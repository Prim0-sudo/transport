# Transport Town coastal station

Open `index.html` from this folder and select **Play scene**. The three moment buttons and scrubber are for review. **Phone framing** lets you see the narrower crop from a desktop.

The PNG masters and exact prompts are in `originals/` and `art-ledger.json`. The browser uses the 20 registered derivatives in `art/`. `placement.js` records the source coordinates and `preview.js` is the motion reference. The sky, coastal distance, lower stage and foreground exit trees share a 1536 × 1024 camera. The coast and lower stage are registered exports of the same environment painting. Keep those two aligned.

## Motion and contacts

| Actor | Registration and sequence |
| --- | --- |
| Train | Left engine, two passenger coaches, right engine. The left engine leads into the station from the right. Stop at 4.25 s with the wheels at source y=731. Dwell at the platform. The right engine leads out to the right from 13 s. Preserve orientation and coupler spacing throughout. |
| Bus | Parked at x=545 with tyre support at y=917. Open the door, board three people in order at the front threshold (approximately x=745, y=898), close the door, and leave right from 8.65 s. Play one departure per landing visit. |
| Ferry | Approach from the right and stop at x=725 by 5.8 s. Waterline y=520. Set the gangway between the stone quay and the door at approximately x=909, y=510. Board two people between 9 s and 11.76 s. Remove the gangway and close the door before moving left at 12.35 s. |
| Plane | Use the far-left runway for the landing, straight ground roll and climb. The phone crop shows a short part of its flight. |

The passenger atlases show two painted characters. Eight runtime frames share a fixed feet baseline. The preview uses those poses for five passengers. The bus and ferry door panels use their own painted images and stay attached to the vehicle group. Review the threshold and gangway at walking speed.

## App integration for Claude

The owner approved the painted motion preview. Pull Transport `main` and wire the art into the existing landing scene and Explore action. Use the existing local GSAP and MotionPathPlugin. Use linear route geometry for the road and rails, and reuse the preview's normalized curved flight path. The preview's controls are for inspection. Use the app's existing controls and navigation.

Maintain the owner’s current Teacher and reduced-motion behavior. Hold the timeline while hidden or while Teacher is open, resume from the same point, and clean up timers, observers and animation on navigation. Use the stationary docked frame for reduced motion. Check the door and foot contacts, train reversal, ferry clearance, scene reset on re-entry, and the Explore hit area at 390 × 844 and desktop size. Keep the runtime source and placement linked to the ledger.
