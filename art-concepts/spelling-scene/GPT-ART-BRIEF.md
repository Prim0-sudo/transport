# Departure signal: final art brief for ChatGPT (2026-11-09)

Why ChatGPT: it can look at the preview pictures and edit them. Figma's tool takes text only. Editing the existing backplate keeps every layer lined up, so the animation code keeps working.

How to use:
- Start a new ChatGPT chat. Upload the reference files named in each step.
- Paste each prompt as written, one per message. Save each result with the exact file name given.
- Put the files in `G:\My Drive\1.   Coding Hardware Software\Transport spelling scene concepts 2026-11-09\gpt-art\`.
- If a result changes the camera, the size or the lamp positions, ask it to try again: "Keep the exact same framing and positions as the uploaded picture."
- Claude then cuts out the magenta, lines everything up and builds the animation.

Same for every picture: children's picture-book art in soft coloured-pencil and gouache texture, like `train-at-the-platform.png`. No text, letters or numbers anywhere.

## Upload once at the start

- `preview/src/backplate-original.png` (the station)
- `preview/train.png` (the draft train)
- `transport-style-reference.png` (Transport's painted train at the platform)
- `preview-screenshot.png` (how the scene looks in the game)

First message:

> I'm making an animated scene for a children's spelling game. The scene is a country station with a signal gantry of 8 lamps, and a train that arrives, waits, departs on a win, and breaks down with smoke on a loss. I'll ask you for separate layers. Every layer must keep the exact framing, size (1536 x 1024) and positions of backplate-original.png, so the layers stack perfectly. Match the coloured-pencil and gouache style of transport-style-reference.png. Never add text, letters or numbers. Reply "ready".

## The scene layers (edits of backplate-original.png)

1. `layer-1-sky.png`
   > Edit backplate-original.png. Keep only the sky: remove the hills, trees, station, gantry, platform, rails and grass, and fill the whole picture with the same soft clear blue sky, a little lighter towards the bottom. No clouds. Same size.

2. `layer-2-background.png`
   > Edit backplate-original.png. Keep only the distant hills, trees, fence and the station building with its canopy. Paint everything else, including the sky, as flat pure magenta (#FF00FF). Fill in the parts of the hills and trees that the gantry legs hid, so nothing has holes. Same size and positions.

3. `layer-3-track-and-gantry.png`
   > Edit backplate-original.png. Keep only the platform, the brick platform wall, the rails and gravel, and the green signal gantry with its 8 unlit lamps, all in exactly the same positions. Paint everything else, including the sky, hills, trees, station and grass, as flat pure magenta (#FF00FF). Same size.

4. `layer-4-foreground.png`
   > Edit backplate-original.png. Keep only the strip of grass and wild flowers along the bottom edge, and make its top edge a little taller and more uneven, with some grass blades. Paint everything else as flat pure magenta (#FF00FF). Same size.

## The moving pieces (new pictures on magenta)

5. `train-body.png`
   > Repaint train.png in the coloured-pencil and gouache style of transport-style-reference.png: a friendly red-and-cream two-carriage passenger train, exactly side-on, facing right, the same shape and size as train.png. Leave out the wheels: show the empty dark wheel arches where they go. Flat pure magenta (#FF00FF) background, with no ground and no shadow.

6. `wheel.png`
   > Paint one train wheel in the same style, seen exactly side-on as a perfect circle: dark grey steel, a hub in the middle and 6 spokes, so turning it is easy to see. Centre it on a 512 x 512 picture with flat pure magenta (#FF00FF) background.

7. `lamp-unlit.png`, `lamp-red.png`, `lamp-green.png` (three messages)
   > Paint one round railway signal lamp, face-on, matching the lamps on the gantry in backplate-original.png: a black rim and a small hood on top. This one is [UNLIT: dark charcoal glass / LIT RED: glowing bright red glass with a soft red glow / LIT GREEN: glowing bright green glass with a soft green glow]. Centred on a 512 x 512 picture with flat pure magenta (#FF00FF) background.

8. `smoke.png` (optional: the current smoke already works)
   > Paint three separate puffs of dark grey engine smoke in the same style, small, medium and large in one row, not touching, on flat pure magenta (#FF00FF).

9. `clouds.png` (optional: slow clouds drifting across the sky)
   > Paint three separate soft white clouds in the same style, different sizes, in one row, not touching, on flat pure magenta (#FF00FF).

## Checks Claude does when the files arrive

- The layers stack with no gaps or seams, and the lamp centres still match (x 295 to 1075, y about 200).
- The magenta is cut out with no pink rims, checked on white and on dark.
- The wheel turns cleanly, and the train body's wheel arches line up with the wheel positions.
- The phone (375 wide), tablet and PC layouts, the reduced-motion view, and the win, lose and next-word sequences.
