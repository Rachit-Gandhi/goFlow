# Design Decisions

- [x] Storage: Postgres with relational tables for the WebFlow Graph (segments + transitions) and JSONB for raw event payloads. No S3. See [ADR-0001](../docs/adr/0001-postgres-for-graph-storage.md).
- [x] Backend is an MCP server (not an OpenAI API proxy). Each WebFlow Graph is dynamically registered as a named MCP tool. See [ADR-0002](../docs/adr/0002-dynamic-mcp-tool-registration.md).
- [x] Segmentation runs async in the background after raw flow ingest. Raw flow is unavailable for replay until the segmentation job completes.
- [x] Replay is client-side for now: MCP replay tool returns DFS-ordered event sequence; caller executes locally. Server-side headless Chromium is a future option.
- [x] Ownership model: flows are owned by a User or Org. Users can promote flows to Org scope. Org members see all promoted flows in the MCP tool manifest.
- [ ] Dockerfile + restart scripts for VPS deployment
- [ ] GitHub OAuth for user auth + org membership
- [ ] Signed JSON docs for peer sharing across orgs
