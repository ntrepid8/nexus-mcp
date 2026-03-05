# NEXUS-MCP-0004: Automated Commit & Push on Write

## Description
Modify the `write_document` tool to automatically stage, commit, and push changes to the remote repository whenever a document is updated.

## Requirements
- Support an optional `message` argument for descriptive commits.
- If no message is provided, use a default like "Agent updated {path}".
- Execute `git add`, `git commit`, and `git push` in sequence after the local write.
- Log commit activity.

## Dependencies
- NEXUS-MCP-0002: Basic Local Resource & Tool Implementation
- NEXUS-MCP-0003: Local Directory Git Initialization & Remote Configuration
