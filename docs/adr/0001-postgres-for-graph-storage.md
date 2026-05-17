# ADR-0001: Postgres (relational + JSONB) for WebFlow Graph storage

## Status

Accepted

## Context

The primary data structure is a WebFlow Graph — a directed graph of reusable Segments connected by conditional Transitions. Segments are shared across multiple flows (e.g., a login segment appears in 20 flows). The dominant read path is DFS traversal for replay. The backend README proposed "postgres with jsonb OR S3 + SQL database."

## Decision

Use Postgres with:
- Relational tables for graph structure (`segments`, `transitions`, `flows`, `flow_roots`)
- JSONB column on `segments` for the `raw_events` payload (variable-structure event sequence)
- Standard columns for structured fields (`description`, `owner_id`, `owner_type`, `condition_name`)

Do not use S3.

## Rationale

This is a graph traversal problem, not a blob storage problem. Relational adjacency tables with Postgres recursive CTEs support DFS natively. JSONB handles the variable raw event payload without a separate object store. S3 + SQL would split the graph across two systems, requiring a join between a database query and an object store fetch on every DFS step — unnecessary complexity at this scale. S3 becomes relevant only if raw event payloads consistently exceed ~1MB per segment.

## Consequences

- DFS queries use recursive CTEs or application-level traversal with indexed foreign key lookups
- Raw event payloads are stored inline in Postgres — monitor row sizes if flows grow large
- Revisit S3 offload for `raw_events` if average segment payload exceeds 500KB
