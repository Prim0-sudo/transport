# Transport Town Miniature World menu · artwork handoff

On 9 November 2026 the user approved the Meet the Words, Detective and Spin the Wheel pilot, then approved the full twelve-tile set and Dispatch banner. This package is ready for Claude to integrate on `main`.

Open [the full art review](review.html). Each tile or the banner opens the original PNG. The review preserves Plants' feature-above-grid structure and the Transport activity order. The three approved originals are referenced from the [pilot folder](../miniature-world-pilot-v1/REVIEW.md) without re-encoding or duplication. All ten additions are individual transparent PNGs. The [asset ledger](manifest.json) gives exact prompts, generation IDs, dimensions, SHA-256 hashes, border-alpha measurements, visible bounds, and the existing mode IDs to use for wiring.

The first four tiles read as a field guide, sorting trays, a clue under a magnifier, and a picture selection. The middle row reads as safety guidance, a departure word, a matching pair, and a spinner. The last row reads as media, a game route, letter sounds, and reading/drawing/discussion. The Dispatch artwork shows an overhead yellow bus, timber bridge and destination pin. Its title and supporting line stay native text.

## Checks performed on the artwork review

- Four columns on the desktop board with all twelve tiles and the feature in order.
- Two columns at a simulated 390 × 844 viewport. The page had no horizontal overflow.
- Visual inspection on cream and navy. Both spelling and phonics lettering were legible, and the art showed complete silhouettes in the tiles.
- The transparent source pixels are unchanged. The review uses measured visible bounds as the view box while preserving aspect ratio.
- No browser warning/error logs during the review. These checks apply to the artwork board. The integrated app still needs Claude's browser pass.

## Integration after approval

Keep the existing native buttons, labels, keyboard focus, routes, and menu-only Dispatch feature. Replace the vocabulary image lookup for these menu buttons with the explicit mode mapping in the ledger. Use the banner art in the existing direct Dispatch entry. Preserve enough vertical room for the portrait spinner and enough width for the wider open book and map. Treat image bounds as placement metadata and preserve proportions. Derive appropriately sized runtime assets from the selected originals only after approval and record their hashes. Check the actual menu on desktop and at 390 × 844, including long labels and the banner's direct entry.
