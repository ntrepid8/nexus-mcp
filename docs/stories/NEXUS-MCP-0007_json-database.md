# NEXUS-MCP-0007: Simple Database Layer (JSON-based)

## Description
Provide support for sharing structured data via JSON files. Expose basic CRUD tools for agents to query and update tabular or key-value state.

## Requirements
- Define the `kb://database/{table}` resource.
- Implement the `query_database(table, filter)` tool.
- Implement the `update_database(table, data)` tool.
- Support JSON files stored in a dedicated `db/` directory within the managed repository.

## Dependencies
- NEXUS-MCP-0002: Basic Local Resource & Tool Implementation
- NEXUS-MCP-0004: Automated Commit & Push on Write
