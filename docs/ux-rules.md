# UX Rules

Painter's Ref Lab should remain elegant, calm, and practical. AI Studio must not clutter the main interface.

## Interface Priority

Deterministic outputs appear first.

Recommended order:

1. Baseline
2. Composition
3. Observation
4. Drawing
5. Painting
6. Exports
7. AI Studio

AI Studio should be a separate panel, tab, or collapsed section. It should not interrupt the Core Lab workflow.

## AI Studio Placement

AI tools should be hidden behind a clear entry point:

- `AI Studio`
- `Optional AI Tools`
- `Reference Transform`

Avoid placing AI buttons inside every deterministic panel.

## AI Action Design

AI actions should be explicit.

Good labels:

- `Simplify Reference`
- `Create Composition Variants`
- `Emphasize Focal Area`
- `Suggest Painting Plan`

Avoid labels:

- `Make Art`
- `Generate Painting`
- `Create Masterpiece`
- `Style It`

## Default View

After loading an image, the app should still show deterministic controls first. AI Studio should not open automatically.

## Comparison Rules

Every AI output should be shown with context:

- original reference
- task label
- generated variant
- optional notes
- select / discard controls

The painter should always be able to return to the original or a deterministic study.

## Visual Design Rules

- keep the sidebar compact
- avoid large AI banners
- avoid novelty colors for AI features
- use the same typography and spacing system as Core Lab
- keep progress states quiet but visible
- do not use hype language in the UI

## Copywriting Rules

Use painter-facing language.

Preferred:

- "Simplify busy detail"
- "Test composition"
- "Compare value key"
- "Use as reference"
- "Suggested plan"

Avoid:

- "AI magic"
- "Instant artwork"
- "Generate masterpiece"
- "Transform into painting"
- "Make it in the style of..."

## Cost And Latency UX

AI actions may take time and may cost money. The UI should make this clear without creating anxiety.

Required states:

- ready
- generating
- complete
- failed
- retry available

Avoid automatic repeated generation.

## Privacy UX

Before the first AI action, clearly indicate that AI Studio may send the selected image to a cloud/API service. Keep this message short and plain.

Core Lab should remain available without cloud processing.

