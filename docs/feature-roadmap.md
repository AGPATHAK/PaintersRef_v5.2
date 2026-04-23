# Feature Roadmap

This roadmap ranks future work by painter value and implementation risk. Core Lab should remain stable while AI Studio is added gradually.

## Phase 1: Highest ROI

### AI Simplify

Goal:

- turn busy references into clearer painting references
- reduce small distracting detail
- preserve the focal subject and lighting

Expected outputs:

- one simplified reference variant
- optional before/after comparison
- exportable current view

Why first:

- directly supports observation, drawing, and value planning
- has a clear success/failure test
- avoids broad style-generation scope

### AI Composition Variants

Goal:

- generate a small set of composition alternatives from the same reference
- test crop, spacing, focal placement, and clutter reduction

Expected outputs:

- 2 to 4 variants
- original shown beside variants
- ability to select one as a working reference for later Core Lab processing

Guardrails:

- preserve subject identity
- avoid dramatic invented scenes
- no unlimited variant button

### AI Painting Plan

Goal:

- generate short text suggestions for how a painter might approach the reference

Possible output:

- likely focal area
- main value groups
- suggested simplifications
- possible order of washes or passes
- caution notes such as "avoid over-detailing background"

Guardrails:

- suggestions only
- no prescriptive scoring
- no claim that the plan is correct

## Phase 2

### AI Atmosphere / Value-Key Variants

Goal:

- test mood and value-key changes before painting

Examples:

- lighter high-key version
- quieter overcast version
- stronger shadow-mass version
- simplified evening atmosphere

Guardrails:

- keep scene readable
- avoid decorative effects
- preserve focal subject

### Style-Essence Presets

Goal:

- offer broad painterly planning tendencies without imitation

Examples:

- economical wash planning
- broad tonal masses
- restrained detail
- strong silhouette design
- watercolor-friendly simplification

Allowed framing:

- "Wesson-like economy"
- "Seago-like tonal restraint"
- "Homer-like clarity of masses"

Avoid:

- direct imitation
- living artist mimicry
- finished painting generation

## Phase 3

### Critique Studio Module

Goal:

- let painters upload an in-progress painting and receive reference-aware critique support

Possible tools:

- value comparison overlay
- composition balance notes
- focal clarity notes
- drawing alignment hints
- warm/cool balance observations

Guardrails:

- separate from Core Lab
- clearly optional
- supportive language
- painter remains the decision-maker
- no automatic "fix my painting" generation

