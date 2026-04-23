# Source Doc Revisions

These revisions define how the existing source documents should evolve as Painter's Ref Lab adds an optional AI Studio layer.

## Source Doc 1: Design Philosophy & Scope Boundaries

Painter's Ref Lab remains a minimal, artist-first reference preparation tool. Its purpose is to help painters see, simplify, compare, and plan.

### Allowed

- deterministic local studies for value, drawing, temperature, and export
- limited AI-assisted reference transformation
- AI simplification of busy references
- AI planning variants for composition, focal emphasis, value key, and atmosphere
- concise painting-plan suggestions
- critique support for in-progress work, if clearly separated from Core Lab
- cloud/API use when it is optional, labeled, and gracefully unavailable

### Not Allowed

- one-click finished paintings
- open-ended style generators
- social-media art factories
- prompts designed to imitate living artists
- unlimited variant generation without purpose
- AI tools that obscure the original reference
- AI features that crowd the main workflow

### Boundary Statement

AI may help prepare a better reference. It must not become the painter.

## Source Doc 2: Processing Strategy

The project should use a hybrid pipeline.

```text
Load Image
  -> Deterministic Analysis
  -> Optional AI Transform Layer
  -> Compare Views
  -> Export
```

### Deterministic Analysis

The deterministic layer remains the foundation:

- fit image to canvas
- generate grayscale
- generate notan / posterized studies
- generate tonal masks
- generate temperature masks
- generate outline sketch
- generate composition crops
- prepare export sheets

### Optional AI Transform Layer

The AI layer should receive a clear task, source image, and bounded preset. It should return one or more reference variants, not final art.

Possible AI tasks:

- simplify reference
- remove clutter
- test composition arrangement
- emphasize focal point
- adjust atmosphere or value key
- create watercolor-friendly planning reference

### Compare Views

AI results should appear in a comparison gallery beside the original and relevant Core Lab studies. The painter decides what is useful.

### Export

Export should remain simple:

- current view
- deterministic study sheets
- selected AI variant sheet, if enabled later

## Source Doc 3: Visual Output Guidelines

All outputs should serve painting decisions.

### Core Lab Output Criteria

- clear value structure
- stable repeatable results
- readable outlines
- useful masks
- printable exports
- no unnecessary decoration

### AI Output Criteria

AI outputs should be judged by painterly usefulness, not photorealism.

Good AI outputs:

- preserve the focal subject
- simplify busy detail into readable masses
- keep large shapes clear
- reduce clutter without inventing distracting new content
- preserve the reference's basic lighting logic
- support watercolor-friendly planning where requested
- make composition alternatives easy to compare

Poor AI outputs:

- add fake texture clutter
- over-stylize the reference
- alter the subject too much
- create decorative effects instead of useful simplification
- hide the main value structure
- make the scene harder to paint
- look impressive but provide no better painting plan

## Source Doc 5: Development & Testing Strategy

Roll out AI in controlled stages.

### Phase 1: Deterministic Stable

Keep the current Core Lab reliable.

Testing focus:

- image load
- grid overlay
- grayscale
- notan
- masks
- outline
- composition crops
- exports
- PWA caching

### Phase 2: AI Simplify

Add the smallest useful AI feature first: simplifying busy references.

Testing focus:

- upload flow
- API unavailable fallback
- latency states
- before/after comparison
- preservation of focal subject
- usefulness for drawing and value planning

### Phase 3: AI Variants

Add bounded variants after simplify is stable.

Testing focus:

- composition variants
- focal emphasis variants
- atmosphere / value-key variants
- variant history
- clear selection and discard behavior
- export of selected variants

### Phase 4: AI Critique Tools

Add critique tools only as a separate optional module.

Testing focus:

- in-progress painting upload
- overlay clarity
- non-prescriptive critique wording
- privacy expectations
- separation from reference-generation tools

## Source Doc 6: Failure Modes

AI adds new failure modes that must be designed around.

### Prompt Drift

The output may move away from the requested task.

Mitigation:

- use fixed task presets
- keep prompts narrow
- display the original beside every AI result

### Over-Stylization

The output may become a painting-like image instead of a usable reference.

Mitigation:

- avoid style-heavy prompts
- prefer "simplify for painting reference" language
- reject outputs that add excessive texture or decorative marks

### Latency Confusion

The user may not know whether the app is working.

Mitigation:

- show clear progress states
- keep deterministic tools usable while AI runs when possible
- provide cancel or retry affordances

### Inconsistent Outputs

AI results may vary between runs.

Mitigation:

- label AI results as generated variants
- keep generation history during the session
- let the painter discard weak results easily

### API Cost Creep

Repeated variants can create unexpected cost.

Mitigation:

- make AI actions explicit
- avoid auto-generation
- show generation count or cost warnings if applicable
- default to one or a small set of variants

### Privacy Misunderstanding

AI features may require sending an image to an external API.

Mitigation:

- clearly label cloud/API features
- keep Core Lab local
- require explicit user action before AI processing

