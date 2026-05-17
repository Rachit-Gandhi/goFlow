# goFlow Domain Glossary

## WebFlow

A recorded user session captured by the browser extension. Starts as a raw linear sequence of DOM events, network intents, and user actions. After segmentation, becomes a **WebFlow Graph**.

## WebFlow Graph

The structured, reusable form of a WebFlow. A directed graph where nodes are **Segments** and edges are **Transitions**. The primary artifact stored and served by the backend.

## Segment

A node in a WebFlow Graph. Represents a semantically coherent unit of user behaviour (e.g., "log in with email/password"). Holds two payloads:
- `description`: LLM-generated natural-language summary, used for agent reasoning
- `raw_events`: the original recorded DOM/network/action events, used for replay

Segments are reusable across multiple WebFlow Graphs (e.g., a login segment shared by 20 flows).

## Transition

A directed edge in a WebFlow Graph connecting two Segments. Carries:
- `condition_name`: a label assigned by the LLM during segmentation
- `condition_type`: either `input` (resolved against caller-supplied data at runtime) or `selector` (matched against a named condition)

At replay time, the DFS traversal picks an outgoing Transition by matching runtime inputs against the edge's condition.

## Segmentation

The one-time LLM processing step that converts a raw WebFlow into a WebFlow Graph. Breaks the linear event sequence into Segments and infers Transitions between them.

## Replay

DFS traversal of a WebFlow Graph, executing each Segment's `raw_events` via a puppeteer harness. Branch selection at each Transition is driven by caller-supplied inputs or named condition selectors.

## MCP Server

The Go backend. Exposes the WebFlow Graph store as an MCP (Model Context Protocol) server. Authenticated users and organisations connect to it to manage their flows and invoke them as tools from LLM clients (e.g., Claude, Cursor).

## Flow

Shorthand for WebFlow Graph in conversational context. Avoid using "flow" to mean the raw recorded session — that is a WebFlow (pre-segmentation).

## Segmentation Job

An async background task triggered on raw WebFlow ingest. Calls an LLM to convert the linear event sequence into a WebFlow Graph (Segments + Transitions). The raw WebFlow is unavailable for replay until the job completes.

## Ownership

Every WebFlow Graph is owned by either a **User** or an **Org**. A User-owned flow can be promoted to an Org, making it visible to all Org members. Access control is checked against ownership + org membership on every MCP tool call.

## Org

An organisation. Groups users with shared access to a promoted flow library. Modelled after GitHub orgs — used for "teams auth."

## MCP Tool (per flow)

Each WebFlow Graph is registered as a distinct, named MCP tool on the MCP Server (e.g., `run_login_flow`). The tool manifest is updated dynamically when flows are added, removed, or promoted. Tool descriptions are derived from the Segment descriptions in the graph.
