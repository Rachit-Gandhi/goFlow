# Domain Docs

How the engineering skills should consume this repo's domain documentation when exploring the codebase.

## Before exploring, read these

- **`CONTEXT.md`** at the repo root — domain glossary (WebFlow, Segment, Transition, MCP Server, etc.)
- **`docs/adr/`** — read ADRs that touch the area you're about to work in

If any of these files don't exist, **proceed silently**. Don't flag their absence; don't suggest creating them upfront. The producer skill (`/grill-with-docs`) creates them lazily when terms or decisions actually get resolved.

## File structure

Single-context repo:

```
/
├── CONTEXT.md
├── docs/
│   └── adr/
│       ├── 0001-postgres-for-graph-storage.md
│       └── 0002-dynamic-mcp-tool-registration.md
├── chrome_goFlow/        ← Chrome extension (current)
├── goFlow_backend/       ← Go MCP server (in progress)
└── ...                   ← other extension targets may be added (Firefox, Safari, etc.)
```

Note: the top-level folder structure is still evolving (Firefox, Safari, and other extension targets may be added). The domain docs layout at the root is stable regardless.

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name), use the term as defined in `CONTEXT.md`. Don't drift to synonyms the glossary explicitly avoids.

If the concept you need isn't in the glossary yet, that's a signal — either you're inventing language the project doesn't use (reconsider) or there's a real gap (note it for `/grill-with-docs`).

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently overriding:

> _Contradicts ADR-0001 (postgres for graph storage) — but worth reopening because…_
