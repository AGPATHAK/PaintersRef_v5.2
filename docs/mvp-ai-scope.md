# MVP AI Scope

This document defines the strict first AI release scope for Painter's Ref Lab.

AI Studio must remain optional. Core Lab must continue to work without API access.

## MVP Purpose

Use AI only to help painters prepare better references.

The first release should answer three practical questions:

- Can a busy reference be simplified into more paintable masses?
- Can a few composition alternatives help the painter choose a better design?
- Can short text notes help the painter start with a clearer plan?

## Allowed In MVP

### AI Simplify

Generate one simplified reference variant from the selected working image.

Requirements:

- preserve the focal subject
- reduce small clutter
- keep value masses readable
- avoid finished-painting effects
- show result beside original/current reference

### AI Composition Variants

Generate up to 3 composition variants.

Requirements:

- maximum 3 variants per request
- preserve subject identity
- avoid dramatic invented content
- allow select/discard
- compare against original and current composition

### AI Painting Plan Text Analysis

Generate concise text notes for painting preparation.

Allowed note types:

- focal area suggestion
- major value groups
- simplification suggestions
- likely painting sequence
- caution notes

Requirements:

- no chat interface
- no claim of correctness
- painter-facing language

### Graceful API Error Handling

Required before any AI feature is considered usable.

Requirements:

- clear unavailable/error state
- retry option
- Core Lab remains usable
- no loss of loaded image or deterministic outputs
- no automatic repeated requests

## Not In MVP

- freeform prompting
- style cloning
- prompts to imitate living artists
- one-click finished paintings
- critique of finished paintings
- chat interface
- cloud-synced history
- user accounts
- social sharing
- unlimited variant generation
- automatic AI calls after image load
- AI edits inside every workflow panel

## MVP UX Rules

- AI Studio is hidden in a separate optional panel/tab.
- Deterministic outputs remain visible first.
- AI actions are explicit button clicks.
- Each AI result is labeled as a generated reference variant.
- Original and deterministic views stay available for comparison.
- The user can discard generated variants.
- Privacy note appears before first cloud/API action.

## MVP Success Criteria

- A painter can use Core Lab exactly as before.
- AI Simplify produces at least occasionally useful painting references during real testing.
- Composition variants are limited, readable, and easy to compare.
- Painting Plan notes are concise and not prescriptive.
- Slow or failed API calls do not damage trust in the app.
- The feature still feels like Painter's Ref Lab, not a generic AI image tool.

