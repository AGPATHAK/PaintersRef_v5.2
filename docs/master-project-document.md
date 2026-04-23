# Master Project Document

Painter's Ref Lab is a browser-based preparation tool for painters. It helps an artist convert a reference image into practical study material for composition, observation, drawing, value planning, color temperature study, and export.

The product should remain disciplined. It is not an AI art generator, a style-copying tool, or a replacement for painter judgment. Its purpose is to make visual preparation faster, clearer, and more useful while leaving all artistic decisions with the painter.

## Product Identity

Painter's Ref Lab is an intelligent painter's preparation tool.

It supports the early and middle stages of painting:

- choosing and testing composition
- simplifying visual complexity
- seeing value relationships
- preparing drawing aids
- comparing temperature and tonal structures
- exporting reference sheets for studio use

It should not produce finished paintings for the user.

## Two-Zone Product Model

The app is organized into two conceptual zones.

### A. Core Lab: Deterministic And Local

The Core Lab contains the current local browser tools. These tools should remain fast, predictable, and independent of any cloud service.

Core Lab features include:

- local image loading
- grid overlay
- grayscale study
- 3-value notan / posterization
- light, midtone, and shadow masks
- warm, cool, and neutral masks
- squint / value-mass observation
- outline sketch / edge detection
- mirror check
- composition crop studies
- palette note assistance
- current-view export
- composite export sheets

Core Lab principles:

- deterministic output
- local-first processing where possible
- no account or API dependency for basic use
- fast feedback
- simple controls
- stable baseline for comparison against optional AI outputs

### B. AI Studio: Optional Cloud/API Layer

AI Studio is an optional extension for painter-reference assistance. It may use modern image-model workflows, such as OpenAI `gpt-image-2` or Responses-based pipelines where configured, but should sit behind a clear boundary.

AI Studio features may include:

- simplifying busy references into clearer painting references
- removing visual clutter that distracts from the painting idea
- generating bounded composition variants
- creating focal-point emphasis variants
- testing atmosphere or value-key variants
- producing watercolor-friendly reference transforms
- generating concise painting-plan suggestions
- supporting critique overlays for in-progress paintings in a future optional module

AI Studio principles:

- optional, never required for core use
- clearly labeled as cloud/API assisted
- bounded prompts and preset tasks
- no open-ended art generation surface
- outputs compared against the original and Core Lab studies
- painterly usefulness is more important than novelty

## Intended Workflow

Recommended product flow:

1. Load a reference image.
2. Review the original in Core Lab.
3. Use deterministic studies first: grid, composition, squint, grayscale, notan, masks, outline.
4. Optionally open AI Studio for a specific reference-preparation task.
5. Compare AI variants with the original and deterministic views.
6. Keep, discard, or export selected studies.
7. Use the results as studio reference, not as final artwork.

## What The App Should Protect

Painter's Ref Lab should protect:

- the painter's point of interest
- the source image's basic identity
- readable value masses
- drawing usefulness
- workflow clarity
- speed
- trust in deterministic outputs

AI additions must not compromise the current Core Lab experience.

## What The App Should Avoid

Avoid:

- one-click finished painting generation
- generic prompt playgrounds
- endless style lists
- social-media content generation
- complex editing suites
- Photoshop-like tool sprawl
- AI outputs that replace the need to observe, choose, simplify, and paint
