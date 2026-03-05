# NEXUS-MCP-0002: Basic Local Resource & Tool Implementation (Read/Write)

## Description
Implement the fundamental MCP resources and tools for reading and writing markdown documents in a local directory (e.g., `~/.nexus-mcp/data/`).

## Requirements
- Define the `kb://documents/{path}` resource.
- Implement the `read_document(path)` tool to read files from the local directory.
- Implement the `write_document(path, content)` tool to save files to the local directory.
- Ensure proper path sanitization to prevent directory traversal.

## Dependencies
- NEXUS-MCP-0001: Initial Project Scaffolding
