# NEXUS-MCP-0012: LRU Compaction Strategy for State Pruning

## Description
Implement a maintenance task to prune old state files and metadata from the `~/.nexus-mcp/state/` directory using a Least Recently Used (LRU) policy.

## Requirements
- Periodically (e.g., on startup) scan the state directory.
- Identify and delete metadata files that haven't been accessed for a configurable period (e.g., 30 days).
- Ensure that active PR-to-branch mappings are NOT pruned.

## Dependencies
- NEXUS-MCP-0011: State Isolation & Metadata Tracking (~/.nexus-mcp/state/)
