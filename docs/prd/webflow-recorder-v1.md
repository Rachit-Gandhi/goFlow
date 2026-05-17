# PRD: WebFlow Recorder V1

## Problem Statement

goFlow needs a browser extension that can record a real user session in a web application, especially an SPA, as a raw WebFlow. The recorded WebFlow must include user actions, DOM events and updates, network intents, navigations, and embedded iframe interactions so it can later become a segmented WebFlow Graph.

The throwaway prototype proved that manual segmentation is the right first interaction model, but it also exposed a workflow problem: reopening the toolbar popup after every browser interaction breaks recording flow. V1 needs a persistent recorder workspace, not a transient popup.

Missing iframe capture is not acceptable for V1. Many target applications embed meaningful workflows inside iframes, so a WebFlow that cannot observe same-origin or permitted iframe interactions is incomplete.

## Solution

Build a production V1 recorder extension that:

- Opens a persistent recorder workspace as a docked or detachable extension surface.
- Starts and stops recording without requiring repeated toolbar popup interaction.
- Records a raw linear WebFlow from the active tab.
- Captures top-frame and iframe user actions where Chrome extension permissions allow access.
- Captures DOM snapshots, DOM mutations, navigation changes, and network intents.
- Lets the user manually segment the raw event stream into ordered Segments.
- Exports or persists a WebFlow JSON document that preserves both the raw event stream and the user-authored linear segmentation.

The V1 output remains a linear segmented WebFlow. Full LLM Segmentation into a reusable WebFlow Graph, Transition inference, MCP tool registration, and replay execution are downstream concerns.

## User Stories

1. As a goFlow user, I want to start recording from the extension, so that I can capture a browser workflow while performing it naturally.
2. As a goFlow user, I want the recorder UI to stay visible in a docked or detachable surface, so that I do not need to reopen the extension popup repeatedly.
3. As a goFlow user, I want to stop recording from the persistent recorder workspace, so that I can finish a WebFlow without losing context.
4. As a goFlow user, I want to see whether recording is active, so that I do not accidentally miss part of a workflow.
5. As a goFlow user, I want to see the active tab being recorded, so that I know which browser context is producing the WebFlow.
6. As a goFlow user, I want the recorder to capture page navigations, so that login redirects and OAuth handoffs are represented in the WebFlow.
7. As a goFlow user, I want the recorder to capture SPA route changes, so that client-side navigation is represented even when the page does not reload.
8. As a goFlow user, I want the recorder to capture clicks, so that button and link interactions are represented.
9. As a goFlow user, I want the recorder to capture form input changes, so that typed values and selected options are represented.
10. As a goFlow user, I want the recorder to avoid storing raw password values, so that sensitive credentials are not leaked into the WebFlow JSON.
11. As a goFlow user, I want the recorder to capture form submissions, so that meaningful commit points are represented.
12. As a goFlow user, I want the recorder to capture keyboard submission actions, so that Enter-driven workflows are represented.
13. As a goFlow user, I want the recorder to capture iframe interactions, so that embedded workflows are not missing from the WebFlow.
14. As a goFlow user, I want iframe events to include frame identity and parent context, so that later replay can target the right frame.
15. As a goFlow user, I want the recorder to show inaccessible iframe gaps, so that I know when browser permissions or cross-origin isolation prevented capture.
16. As a goFlow user, I want an initial DOM snapshot when recording starts, so that the WebFlow has a baseline page state.
17. As a goFlow user, I want DOM mutations recorded after the initial snapshot, so that dynamic UI changes in SPAs are represented.
18. As a goFlow user, I want network intents captured, so that API calls associated with user actions are available to later segmentation and replay logic.
19. As a goFlow user, I want network intents correlated with nearby user actions when possible, so that a Segment can explain both action and effect.
20. As a goFlow user, I want a raw event stream view, so that I can inspect what was captured.
21. As a goFlow user, I want to create Segments manually, so that I can decide how the WebFlow should be divided.
22. As a goFlow user, I want to rename Segments, so that each Segment has meaningful intent.
23. As a goFlow user, I want to reorder Segments, so that the linear flow matches how I understand the workflow.
24. As a goFlow user, I want to assign raw events to Segments, so that each Segment keeps its replay payload.
25. As a goFlow user, I want to move an event between Segments, so that I can correct segmentation mistakes.
26. As a goFlow user, I want to leave events unsegmented temporarily, so that I can sort uncertain events later.
27. As a goFlow user, I want to see the current linear segmented WebFlow JSON, so that I can validate the artifact before saving.
28. As a goFlow user, I want to save or export the WebFlow JSON, so that it can be ingested by the backend later.
29. As a goFlow user, I want the recording state to survive recorder UI reloads, so that the WebFlow is not lost by closing the panel.
30. As a goFlow user, I want a clear reset action, so that I can discard a bad recording and start again.
31. As a goFlow developer, I want a stable WebFlow JSON contract, so that backend ingest and future replay work can build against it.
32. As a goFlow developer, I want content capture separated from state assembly, so that capture logic can be tested without the UI.
33. As a goFlow developer, I want segmentation editing separated from event capture, so that manual segmentation can evolve without destabilizing recording.
34. As a goFlow developer, I want iframe capture tested with a fixture page, so that regressions are caught before release.
35. As a goFlow developer, I want SPA navigation tested with a fixture page, so that route changes do not silently disappear.

## Implementation Decisions

- Build a persistent recorder workspace. The toolbar action should become a launcher/status entry point, not the main editing surface.
- Prefer a Chrome side panel or detachable extension window for the recorder workspace. The user requirement is a persistent docked/separable workflow surface; exact Chrome API choice can follow platform constraints.
- Keep manual segmentation for V1. LLM Segmentation remains a later processing step.
- Treat V1 output as a raw WebFlow with manual linear Segment assignments, not as the final WebFlow Graph.
- Capture content scripts in all accessible frames. Iframe events must carry frame metadata, including frame id, parent frame id when available, frame URL, top-level tab id, and a frame path or equivalent target path.
- Same-origin and extension-accessible iframe capture is required. Inaccessible frames must be represented as explicit capture gaps instead of silently ignored.
- Capture a baseline DOM snapshot at recording start. Use extension APIs such as offscreen documents if needed because service workers do not have DOM access.
- Capture DOM mutations after the baseline snapshot. Mutation records should be compact enough for JSON storage but rich enough to explain UI state changes.
- Capture user actions as structured events with timestamp, URL, document title, frame metadata, selector candidates, target metadata, text label, coordinates when useful, and sanitized value data.
- Capture network intents separately from raw browser traffic. V1 should prioritize fetch, XHR, form submit, and navigation intent over full response-body capture.
- Redact password-like and secret-like values at capture time.
- Preserve raw event order globally. Segments reference or contain ordered raw events.
- Store active recording state in extension storage so the panel can reload without losing the WebFlow.
- Export a JSON artifact that includes recorder metadata, raw events, Segments, and unsegmented events.
- Use this prototype-derived state shape as the starting decision, trimmed to the durable contract:

```json
{
  "recording": true,
  "activeSegmentId": "seg_*",
  "segments": [{ "id": "seg_*", "name": "Segment 1" }],
  "events": [{ "id": "evt_*", "type": "click", "segmentId": "seg_*" }]
}
```

Major modules to build or modify:

- Recorder workspace: persistent docked/detachable UI for recording status, raw event inspection, manual segmentation, and export.
- Capture coordinator: background/service-worker state machine that starts/stops recording, injects capture scripts, stores state, and assembles the WebFlow.
- Frame-aware content capture: content scripts that run in top frame and accessible iframes and emit normalized user, DOM, and SPA navigation events.
- Network intent capture: instrumentation for user-initiated navigation, form submissions, fetch, and XHR intent metadata.
- WebFlow event model: shared schema for raw events, frame identity, DOM snapshots, network intents, Segments, and export.
- Export/persistence adapter: saves the current WebFlow JSON locally and prepares the same contract for backend ingest.

## Testing Decisions

- Tests should assert externally visible behavior: what events are captured, how they are segmented, and what JSON is exported. They should not assert private function names or internal storage layout unless that layout is the public WebFlow contract.
- Add fixture pages for top-frame recording, SPA route changes, same-origin iframe capture, and inaccessible iframe reporting.
- Test the capture coordinator with simulated start/stop/reload flows.
- Test frame-aware capture by verifying iframe events include frame metadata and appear in the global event stream.
- Test manual segmentation by creating, renaming, reordering, deleting, and assigning events to Segments, then asserting the exported JSON.
- Test sensitive value redaction for password fields and secret-like inputs.
- Test network intent capture with fetch, XHR, form submit, and navigation fixtures.
- Test export by validating the WebFlow JSON against the V1 contract.

## Out of Scope

- Automatic LLM Segmentation into a WebFlow Graph.
- Transition inference.
- Backend ingest implementation.
- MCP tool registration for saved flows.
- Puppeteer replay execution.
- Org sharing, promotion, and teams auth.
- Signed WebFlow JSON.
- Capturing cross-origin iframe internals when Chrome extension permissions and browser isolation make them inaccessible. V1 must still report these as capture gaps.

## Further Notes

- The prototype validated manual segmentation and the basic event-to-segment model.
- The prototype popup UX is not acceptable as the main recorder surface because repeated popup reopening interrupts the recording workflow.
- The first production version should optimize for faithful capture and clean manual segmentation over visual polish.
