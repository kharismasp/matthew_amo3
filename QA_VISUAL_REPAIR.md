# Visual repair — 22 October 2026

Baseline: Matthew_AMO_Strategy_Trainer_3_Phase4_Final.zip.

## Repairs
- Rebuilt angle configurations A3/D6/M6 and the lesson from exact collinearity and equal-length constraints. Practice diagrams do not inherit lesson reveals.
- Rebuilt cube stacks from exterior voxel faces with correct camera-facing planes, occlusion order and coordinates. Five-cube stack includes a cube behind the middle cube.
- Rebuilt removed-corner and removed-face-center cubes as actual cavities; B5 uses an explicitly captioned compatible geometric model (not a verified reproduction of the absent source image).
- Replaced flat rectangles representing solids with three-face cuboid illustrations.
- Corrected overlap geometry, including the eight-sided perimeter union, square card overlap, same-height unions and cross-rectangle identities.
- Corrected nested-square ratios, equal-scale coordinate axes, grid cell shapes, photo enlargement, 12:35:37 triangle, eight-cell number frame and equal-area tile examples.
- Added an enlarge-diagram dialog with horizontal scrolling for small screens.

## Necessary answer correction
M4's unchanged arrangement has six contacts: three in the bottom row, two vertical, and one between the upper cubes. Correct surface area is 24, not 26. Updated runtime answer key, full solution and final hint.

## Source limitation
D1's original fold sequence and answer-option images are absent. The old sketch and invented option-D pattern cannot be justified. D1 is retained by ID but put on hold without answer submission; the symmetry lesson shows the fully specified square-fold exercise instead. Restoring D1 requires its actual source diagram/options.

## Validation completed
- All 55 practice entries rendered in EN and ID at desktop size: 110 inspections. No SVG text clipping or text-to-text bounding-box collisions; D1 intentionally uses a source-needed notice.
- All 55 entries rendered in EN and ID inside an actual 360-pixel iframe viewport: 110 inspections. No horizontal page overflow or SVG text clipping.
- Node checks: 55 renderers × 2 languages; no undefined/NaN output; exact equal-side angle constraints for C=20°,24°,30°; voxel surface areas 22,22,24,96,58,148.
- Browser interaction checks: M4 accepts 24, displays corrected solution; enlarged-diagram dialog opens/closes; symmetry lesson renders the source notice and complete square-fold sequence.
- Selected revised diagrams inspected visually in-browser; all 55 received rendered bounds checks, not individual manual visual approval.

Baseline QA_PHASE*.txt and CHECKPOINT.txt files are historical and predate these repairs. This report supersedes their visual claims.
