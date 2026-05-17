# ADR-0002: Dynamic MCP tool registration per WebFlow Graph

## Status

Accepted

## Context

The Go backend is an MCP server. LLM clients (Claude, Cursor, etc.) connect to it to discover and execute WebFlow Graphs. The question was whether to expose flows as a fixed set of generic tools (`list_flows`, `replay_flow(id)`) or as dynamically registered per-flow tools.

## Decision

Each WebFlow Graph is registered as a distinct named MCP tool (e.g., `run_login_flow`, `run_checkout_flow`). Tool name and description are derived from the flow's Segment descriptions. The tool manifest is updated whenever a flow is added, removed, or promoted from user to org scope.

## Rationale

The MCP protocol is designed for dynamic tool registration. Dynamic tools let the LLM reason and act in one step ("I need to log in → call `run_login_flow`") rather than a two-step discovery pattern ("call `list_flows` → find id → call `replay_flow(id)`"). The two-step pattern adds latency and forces the LLM to parse a list on every invocation.

The alternative (static generic tools) would make the MCP server functionally equivalent to a REST API — the LLM loses the ability to reason about flows by name.

## Consequences

- The server must implement MCP tool list refresh on flow create/delete/promote events
- Tool names must be unique and stable — a flow rename changes the tool name, which breaks any agent that cached it
- Org-promoted flows appear in the tool list for all org members; user-private flows appear only for that user's session
- Replay tool execution returns the DFS-ordered event sequence to the caller; local execution (client-side) is the initial target, server-side headless replay is a future option
