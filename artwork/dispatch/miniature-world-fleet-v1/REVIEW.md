# Dispatch Miniature World fleet review

The user approved the seven new overhead originals on 9 November 2026. [The gallery](review.html) opens each full-size PNG and shows the ten moving vehicles at proposed phone map sizes. The previously approved school bus, taxi, and ferry are referenced from the [pilot batch](../miniature-world-pilot-v1/REVIEW.md). The bicycle appears in choice cards, so it has no moving sprite in this set.

| Dispatch ID | Artwork | Proposed phone length | Contact reference |
|---|---|---:|---|
| bus | City bus with ivory roof, teal flanks, and a flat front | 36 px | Front passenger door on the kerb side |
| van | Terracotta parcel van | 29 px | Kerb-side cargo access near the rear |
| truck | Green flatbed lorry with two strapped brick loads | 34 px | Cargo bed edge behind its midpoint |
| tractor | Olive tractor and hitched vegetable trailer | 37 px | Load area on the trailer, approached from the kerb side |
| ambulance | Ivory ambulance with a blue roof marking | 30 px | Rear doors at the left end |
| fire-engine | Red fire engine with a stowed roof ladder | 35 px | Kerb-side crew door behind the cab |
| police-car | Blue and ivory patrol car with a roof light bar | 27 px | Kerb-side passenger door behind the light bar |

The originals are transparent, east-facing plan views. The [asset ledger](manifest.json) records the exact prompts and pilot references, source hashes, alpha measurements, visible bounds, and proposed centre pivots. All seven were checked on cream and navy. The gallery was also checked at a 390 × 844 viewport.

Derive runtime sizes from the approved originals. Preserve each vehicle's proportions and rotate around its own pivot. The contact references indicate where boarding or loading should meet the sprite. Fit those points in the actual stopped pose and verify clearance on the dense 5 × 5 map. The tractor and trailer are a single straight unit for the current one-actor animation. Check its full swept footprint around turns, and verify the ferry's contacts on the water route. The gallery checks the artwork and scale samples. The integrated map and motion pass follow wiring. See the [Dispatch production brief](../../../docs/DISPATCH-ART-PRODUCTION-BRIEF.md).
