# NEXUS-MCP-0006: INDEX.md Semantic Discovery Implementation

## Description
Implement functionality to automatically recognize and utilize `INDEX.md` files at the root and folder levels for semantic discovery. Use these files as maps for the knowledge base.

## Requirements
- Scan for `INDEX.md` when searching or listing resources.
- Expose a `kb://index/` resource to read the root index.
- Ensure that updates to the knowledge base (e.g., adding a new file) also recommend an update to the corresponding `INDEX.md`.

## Dependencies
- NEXUS-MCP-0002: Basic Local Resource & Tool Implementation
