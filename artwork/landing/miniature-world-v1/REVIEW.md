# Asset review — 8 November 2026

Reference consulted: Plants blueprint-v6.0/ART-AND-ANIMATION.md, especially Four genuine layers, Registration and motion brief, and Approval stages. This is an actual asset-production batch authorized by the user, not another concept or disposable mockup.

Local review: http://127.0.0.1:4251/review/landing-assets/

## Files and inspection

Four full-frame scene originals are exactly 1672 × 941: opaque clear sky, alpha distant landscape, alpha town stage and alpha foreground. They were inspected assembled at the same camera. Hiding actors exposes clean road, railway, harbour water and runway, without baked vehicles or clouds. The backing extends beneath later layers. The centre stays open for the existing title/Explore structure.

Separate alpha actors: yellow bus, red railcar in side-quarter and front-quarter views, cream/navy ferry, cream/navy airplane, and one independent cloud. The front railcar view improves static fit to the nearer curve. All were inspected on the browser checkerboard at the source review board's desktop size. This is static contact/art inspection, not full route certification.

The train source preview appeared to have a coloured glow. A background-extraction edit was saved separately, then actual browser compositing established clean visible alpha edges. Some hidden RGB remains outside the visible silhouette, where alpha is zero; do not infer a visible halo from hidden RGB alone. Train/cloud maximum alpha is 254; originals remain unmodified. Native sprite dimensions vary and are recorded in the manifest; no sprite was stretched to a scenery canvas or cropped by an opportunistic atlas.

## Registration and remaining implementation work

Manifest bounds/hashes are measured. Wheel contact points, pivots, waterline landmarks and static rest rectangles are authored pixel annotations; they still require whole-cycle checks when implementation is authorized. The two train views are independent native angles, not a calibrated continuous-turn atlas. Do not rotate one flat sprite around the whole railway or assume arbitrary turning/take-off states exist.

During future implementation, retain fixed actor support points, calibrate each allowed route segment and view transition, register ferry waterline occlusion, and check perspective/scale as actors move. Review responsive crops/motion envelopes with the real title and Explore overlay. Use GSAP/MotionPath with reduced-motion equivalents, Teacher/hidden-tab holds and owned cleanup. No motion controller, phone landing-camera acceptance or physical-device test is claimed by this asset batch.

## Delivery boundary and verification

Nothing in site/dist or review/index.html, style.css or shell.js was changed in this batch. Only the existing localhost server gained an explicitly allowlisted route to the actual asset board/files. Production deployment and landing integration did not occur. The separate interactive driving game remains planned.

Source was committed/pushed before focused code checks. Server syntax passed. Asset board, bus image and manifest returned 200; superseded train source and README routes returned 403. The browser showed the four planes and all six actor files; actor visibility was toggled to inspect clean scenery. The temporary desktop viewport override was reset. No image was generated to stand in for a layered assembly: evidence images are browser screenshots of the actual files.

Evidence: assembled-review.png and vehicles-review.png. Asset status remains production candidate pending user approval. Exact prompts are in prompts.json, actor-prompts.json, train-repair-prompt.json and train-front-prompt.json, repeated per asset in manifest.json alongside source paths and SHA-256 hashes. Method: built-in image_gen throughout; no paid API/CLI workflow.
