# Codex Implementation Notes

These notes are for later implementation. They define the intended architecture before AI Studio is added.

## Architecture Principles

- Keep deterministic modules independent.
- Do not make Core Lab depend on AI services.
- Add AI through a service wrapper.
- Keep AI outputs in explicit variant history.
- Show AI results in a comparison gallery.
- Fail gracefully when API access is unavailable.
- Never auto-send an image to a cloud service.
- Keep all AI actions user-initiated.

## Proposed Pipeline

```text
imageInput
  -> core deterministic processors
  -> optional aiService task
  -> compareGallery
  -> selected working reference
  -> export
```

## Suggested File Organization

```text
/modules
  grayscale.js
  posterize.js
  masks.js
  edgeDetect.js

/services
  aiService.js

/ui
  compareGallery.js
  promptPresets.js
```

## Module Responsibilities

### `/modules/grayscale.js`

Owns grayscale conversion and value-study helpers.

### `/modules/posterize.js`

Owns notan and limited-value posterization.

### `/modules/masks.js`

Owns tonal masks and temperature masks.

### `/modules/edgeDetect.js`

Owns outline sketch and simplification controls.

### `/services/aiService.js`

Owns all API interaction.

The initial provider can be an OpenAI image-model or Responses workflow, such as `gpt-image-2` where available, but provider details should remain inside this service.

Responsibilities:

- accept a source image or canvas
- accept a bounded task preset
- call the configured AI provider
- return normalized variant objects
- handle errors, timeouts, and unavailable API states

The rest of the app should not know provider-specific details.

### `/ui/compareGallery.js`

Owns display and selection of generated variants.

Responsibilities:

- show original and generated variants
- label outputs clearly
- allow selecting a variant as the working reference
- allow discarding variants
- preserve comparison context

### `/ui/promptPresets.js`

Owns bounded AI task wording.

Preset examples:

- `simplifyReference`
- `removeClutter`
- `compositionVariants`
- `focalEmphasis`
- `watercolorReference`
- `atmosphereValueKey`
- `paintingPlan`

## Variant State Shape

Suggested state structure:

```js
{
  ai: {
    enabled: false,
    status: "idle",
    activeTask: null,
    variants: [
      {
        id: "variant-1",
        task: "simplifyReference",
        label: "Simplified Reference",
        imageCanvas: null,
        textNotes: "",
        createdAt: 0,
        source: "ai"
      }
    ],
    selectedVariantId: null,
    error: ""
  }
}
```

## Graceful Fallback

If the API is unavailable:

- keep Core Lab fully usable
- show a concise message
- do not hide deterministic tools
- allow retry
- preserve any already-generated variants

## Security And Privacy Notes

- AI Studio must be opt-in.
- Explain when an image may leave the browser.
- Do not store API keys in client-side source for public deployment.
- Use a server-side proxy or user-provided key strategy before enabling public AI calls.
- Avoid logging uploaded images.
