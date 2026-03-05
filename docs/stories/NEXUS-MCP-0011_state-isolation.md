# NEXUS-MCP-0011: State Isolation & Metadata Tracking (~/.nexus-mcp/state/)

## Description
Establish a hidden state directory (`~/.nexus-mcp/state/`) to store branch-to-PR metadata, recommendation history, and other internal server state. Keep this separate from the data directory.

## Requirements
- Ensure that state files are stored locally and are NOT part of the managed Git repository.
- Implement a JSON-based schema for mapping local branches to remote PR IDs.
- Record "Recommendation History" to track past advice given by agents.

## Dependencies
- NEXUS-MCP-0001: Initial Project Scaffolding
- NEXUS-MCP-0009: Sampling API for Complex Tasks (Summarization)
