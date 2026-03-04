# Nexus MCP: Agent Context & Project Mandates

## Project Overview
**Nexus MCP** is a local-first Model Context Protocol (MCP) server that acts as a central "nexus" for multiple AI agents and human users. It synchronizes markdown documents and simple databases using a GitHub repository as its persistent backend.

*   **Repository:** `https://github.com/ntrepid8/nexus-mcp`
*   **License:** GNU AGPLv3

## Core Mandates
1.  **Git-Backed Persistence:** Every write must trigger an automated `commit`, `push`, and `pull` flow to the remote repository.
2.  **Manager-Delegator Model:** Use the MCP **Sampling API** for complex analysis (summarization/review) and **Progress Notifications** for slow Git operations.
3.  **Namespace Organization:** Enforce `personal/{user-name}/` and `shared/{space-name}/` path conventions.
4.  **Index-Driven Navigation:** Use `INDEX.md` files at the root and folder levels for semantic discovery.
5.  **State Isolation:** All local server state and managed data repositories must be isolated within `~/.nexus-mcp/` to prevent leakage into the server's source repository or the managed remotes.

## Implementation Status
*   **Research:** Completed (Found in `docs/research/`)
*   **Planning:** Completed (Found in `docs/implementation-plan.md`)
*   **Phase 1 (Scaffolding):** In Progress
