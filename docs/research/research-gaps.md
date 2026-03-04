# Research Gaps: Agentic Knowledge Base MCP Server

This document outlines the technical and architectural gaps identified during the planning phase, along with discussion notes on how to address them.

## 1. Authentication & Multi-User Identity Consistency
*   **The Gap:** Ensuring that the identity used for Git operations (commits) matches the identity used for GitHub API operations (PR reviews/approvals).
*   **Notes:**
    *   **Local-First Advantage:** For local usage, the MCP server can leverage existing developer infrastructure (SSH keys, `git-credential-manager`) for `push`/`pull` operations.
    *   **Agent Tokens:** Individual agents (Claude, Gemini) can provide their own `GITHUB_TOKEN` via environment variables in their MCP configuration.
    *   **The "SaaS" Bridge:** A significant gap remains in how to transition to the **Paid/Cloud Tier**. If a user is offline, a local-only server cannot facilitate cross-user background synchronization. The cloud tier will need a robust way to manage delegated tokens to mirror repositories and synchronize state across distributed agents.

## 2. Conflict Resolution Strategy
*   **The Gap:** How to handle Git merge conflicts when multiple agents (or a human and an agent) edit the same markdown file or database simultaneously.
*   **Discussion Notes & Strategy:**
    *   **Standard PR Workflow:** The MCP server will prioritize a "Rebase-and-Push" workflow. If a push fails due to remote changes, the server will attempt to rebase the local branch onto the latest remote state.
    *   **Manual Fallback:** If a rebase fails due to a hard conflict, the server will notify the user/agent and provide an option for the human to resolve the conflict manually.
    *   **Paid Tier Enhancements:** More advanced, fully automated conflict resolution—such as LLM-based structural merging or proactive "Advisory Locking" (preventing simultaneous edits before they happen)—will be explored as part of a future paid tier.

## 3. Semantic Search & Categorization (Index-Driven)
*   **The Gap:** How the server quickly finds specific content types (e.g., "Claude Code Skills") without reading every file.
*   **Discussion Notes & Strategy:**
    *   **Distributed Indexing:** The repository will utilize `INDEX.md` files at the root and within sub-folders. These files will act as a directory and metadata manifest.
    *   **Agent Responsibility:** When an agent modifies or adds a markdown file, it is responsible for updating the corresponding `INDEX.md` as part of the same Pull Request.
    *   **Server Role:** The MCP server will provide tools to "read index" to allow agents to navigate the knowledge base efficiently.
    *   **Paid Tier Enhancement:** Automated "Index Sync" (where the server handles index updates) and advanced vector-based semantic search will be considered for the paid tier.

## 4. Asynchronous Protocol Management (Manager-Delegator Model)
*   **The Gap:** MCP tool calls are typically synchronous, but Git operations and PR analysis can be slow.
*   **Discussion Notes & Strategy:**
    *   **Sampling API:** The MCP server will utilize the **Sampling API** to delegate long-running or complex tasks (like summarizing a large diff or generating review advice) back to the LLM as a sub-agent.
    *   **Progress Notifications:** For any task expected to take >2 seconds, the server will emit `notifications/progress` updates to keep the human user informed and prevent client timeouts.
    *   **Background Jobs:** Extremely long tasks (e.g., initial repository clone or deep re-indexing) will be handled as background jobs with a `job_id`, allowing the agent to poll for status or receive an unsolicited notification upon completion.

## 5. Mapping Local State to Remote PRs (Metadata-Mapping & Compaction)
*   **The Gap:** The MCP server needs a reliable way to map local branches and files to active GitHub Pull Request IDs.
*   **Discussion Notes & Strategy:**
    *   **Local State Cache:** The server will maintain a hidden `.mcp-state/` directory containing a `pr-cache.json` that maps local branch names to GitHub PR IDs and statuses.
    *   **Contextual Metadata:** Tools like `read_document` will return metadata headers (e.g., `X-MCP-PR-ID`) so agents are immediately aware of the PR context for the file they are reading.
    *   **LRU Compaction:** To prevent metadata bloat, the server will implement a **Least Recently Used (LRU)** compaction strategy. Metadata for closed PRs or deleted branches will be purged or moved to a compressed `history.log` after a configurable TTL (e.g., 30 days).
    *   **Maintenance Task:** A background maintenance task will periodically verify local branch existence and prune stale metadata to ensure performant lookups.
