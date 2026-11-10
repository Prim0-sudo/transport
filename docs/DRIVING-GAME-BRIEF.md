# Transport driving game brief (2026-11-10)

Status: brief and three concepts ready; owner picks one before any layout preview or final art. Nothing is wired into the app.

## Brief

- Learning goal: use transport words in action (drive, steer, turn, stop, reverse, park) and road-safety rules (red means stop, wait at crossings, give way to emergency vehicles, look out for cyclists).
- Player: young learners on a classroom tablet first, then PC, then phone.
- Controls: arrow keys move in map directions (up is up the screen); tap or click a road square to drive there along the road. No timer pressure on the easy level.
- World: Miniature World top-down town, reusing the Dispatch map textures and landmarks.
- Mistakes: driving through a red light or at a crossing with people on it stops the car with a short, kind explanation, then lets the player try again. No lives lost.
- Difficulty: Easy (few lights, no traffic), Medium (lights and crossings), Hard (cyclists, emergency vehicle, one-way roads). Round length chosen separately.
- Finish: complete a set number of trips; replay and reset always available; no visible Pause button (hidden-tab and Teacher holds only).
- Motion: GSAP with MotionPath for turns at corners; reduced-motion jumps square to square.

## Three concepts

| | A. Road Safety Drive | B. Taxi Rounds | C. Park and Go |
|---|---|---|---|
| Aim | Reach the named place safely | Pick up passengers and drop them at the places they ask for | Follow spoken action words to move and park |
| Main action | Drive; stop at red lights and crossings; let cyclists and ambulances pass | Drive to a waiting passenger, then to their destination | Hear "turn left", "reverse", "park" and do it |
| Words used | Safety and place words | Place and person words | Action words |
| Hardest part | Lights changing while you wait | Choosing the best route | Reversing into a parking space |

Recommendation: A, with B's passengers as its trips (each trip is "take this passenger to the station"), so one game covers safety, places and people. C fits better as a later Hard level.

## Sprite options (Figma, Miniature World style)

- artwork/driving-options/cars-v1.png: player car in red with a cream roof, blue with a white stripe, or green with a roof rack.
- artwork/driving-options/helpers-v1.png: cyclist with helmet and vest, pedestrian, traffic light on red, traffic light on green.
- These are option sheets only. After the owner picks, each chosen sprite is regenerated alone on a transparent background, front pointing right, and checked at 26 to 37 pixels like the Dispatch fleet.
