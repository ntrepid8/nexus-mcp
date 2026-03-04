# Implementation Plan: Nexus MCP

## 1. Overview
**Nexus MCP** is a local Node.js-based Model Context Protocol (MCP) server specifically designed to organize, share, and persist markdown documents (and simple databases) across multiple AI agents (e.g., `gemini-cli`, `claude-code`) and multiple human users. The server uses a Git repository (hosted on GitHub) as its persistent storage backend, acting as a central "nexus" for agentic coordination and shared knowledge.

*   **Repository:** `https://github.com/ntrepid8/nexus-mcp`
*   **Local Project Path:** `/mnt/workspace/github.com/ntrepid8/nexus-mcp`

## 2. Core Architecture
*   **Runtime:** Node.js (TypeScript) using the official `@modelcontextprotocol/sdk`.
*   **Protocol:** Exposes resources (documents/databases) and tools (read, write, search, create) via MCP.
*   **Storage Backend:** Local filesystem acting as a working directory, strictly synchronized with a configured remote GitHub repository (separate from the server source repo).
*   **Git Integration:** Automated commit, push, and pull operations to ensure state is persisted and shared without manual user intervention.
*   **Async Management:** **Manager-Delegator Model** using the MCP **Sampling API** to delegate complex tasks (like summarization) back to the LLM as sub-agents, and **Progress Notifications** for long-running operations.
*   **State Tracking:** A hidden local `.mcp-state/` folder within the repository to store **branch-to-PR metadata**, recommendation history, and a **Least Recently Used (LRU)** compaction strategy to prune stale data. **Note: This directory MUST be added to the `.gitignore` to prevent local metadata from leaking to the remote.**

## 3. Key Features

### 3.1 GitHub-Backed Persistence
Nexus MCP is configured with a local path and a GitHub remote URL for the knowledge base.
*   **On Read:** The server can optionally fetch the latest changes from the remote to ensure agents have the most up-to-date context.
*   **On Write:** When an agent updates a markdown file or database, the server automatically stages, commits (with a descriptive message like "Agent updated my-plan.md"), and pushes the change to GitHub.

### 3.2 Semantic Awareness & Content Types
The server will not just treat files as raw text; it will be "aware" of the content's purpose based on directory structures or markdown frontmatter.
*   **Specific Schemas:** It will recognize structured content like **"Claude Code Skills"**, "Gemini Prompts", "Agent Plans", or "Memory Blocks".
*   **Categorization:** When an agent queries for "available skills", the server will specifically filter and return documents categorized under that schema, rather than returning raw repository search results.

### 3.3 Note: Simple Database Support
*While the primary focus is markdown documents, Nexus MCP is designed to organize and share simple databases.*
*   **Tiering:** This feature is intended for a **paid tier** of service.
*   **Implementation:** This could be implemented via lightweight JSON files, CSVs, or a local SQLite database that is committed to the repository.
*   **Use Case:** Allowing agents to share tabular data, key-value state (like a shared task queue or a registry of known entities), or structured memory that is difficult to parse reliably from plain markdown.

### 3.4 Multi-Agent and Multi-User Collaboration
*   **Single User, Multiple Agents:** A human user can run `gemini-cli` and `claude-code` simultaneously. Both connect to Nexus MCP. If Gemini updates `my-plan.md`, Claude instantly has access to the updated plan.
*   **Multiple Users, Multiple Agents:** A team shares a GitHub repository. User A's agent updates a document. The server pushes the change. User B's MCP server pulls the change, allowing User B's agent to seamlessly continue the workflow based on the updated state.

### 3.5 Namespace Organization & Governance
The backing GitHub repository is structured into distinct namespaces to manage access and workflow:
*   **Namespace Structure:**
    *   `personal/{user-name}/`: Files owned by a specific user.
    *   `shared/{space-name}/` (e.g., `shared/team/q4-plans/`): Files shared across a group or organization.
*   **Governance Workflows:**
    *   **Personal Space:** Users can make changes via Pull Request (PR) and merge without external approval. They may optionally request reviews for feedback.
    *   **Shared Space:** All changes *require* a PR. Merging into a shared space requires approval from at least one member of that space (or a designated "owner" for sensitive shared paths).
*   **Agent-Assisted PR Management:**
    *   **Summarization & Advice:** The MCP server can fetch diffs from pending PRs and provide semantic summaries to agents. Beyond summarization, the agent can analyze the changes against existing project rules or context and **offer specific advice** (e.g., "Approve", "Request Changes", or "Reject").
    *   **Recommendation Engine:** The agent will flag a "Recommended Action" based on its analysis, allowing the human user to quickly select and execute the decision through the MCP interface.
    *   **Review & Approval:** Agents can present these summaries and recommendations to human users, who can then authorize the agent to **approve, request changes, or merge the PR** directly through the Nexus MCP interface.

## 4. Proposed MCP Interface

### 4.1 Resources (Read-Only Context)
*   `kb://documents/{path}`: Access a specific markdown document.
*   `kb://skills/{agent_type}`: Return all markdown documents semantically tagged as skills for a specific agent.
*   `kb://database/{table}`: Return structured records from the simple database.
*   `kb://pull-requests/pending`: List all pending PRs requiring the user's review.

### 4.2 Tools (Agent Actions)
*   `read_document(path)`: Read the contents of a markdown file. Returns metadata headers like `X-MCP-PR-ID` if the file belongs to an active PR.
*   `write_document(path, content, message)`: Create or update a document and automatically sync it to GitHub with the provided commit message.
*   `search_knowledge_base(query, category)`: Full-text or semantic search across the repository, optionally filtered by categories like "plans" or "skills".
*   `query_database(table, filter)`: Retrieve structured data from the shared database.
*   `update_database(table, data)`: Modify records in the simple database and trigger a sync.
*   `summarize_pull_request(pr_id)`: Generate a semantic summary and **recommend a review action** (Approve/Request Changes/Reject) for a specific PR.
*   `submit_pr_review(pr_id, action, comment)`: Execute a review decision (Approve, Request Changes, or Comment) on a PR.
*   `merge_pull_request(pr_id)`: Execute the merge of an approved PR.

## 5. Development Roadmap
1.  **Phase 1: Basic Node.js MCP Server:** Scaffold the server using the MCP SDK. Implement basic read/write tools for a local directory.
2.  **Phase 2: Git Synchronization:** Integrate a library like `simple-git` to handle automated pull/commit/push workflows backing the local directory.
3.  **Phase 3: Index-Driven Navigation:** Implement support for reading and interacting with `INDEX.md` files at the root and folder levels. Ensure agents include index updates in their PRs.
4.  **Phase 4: Database Integration:** Implement the simple database layer (JSON or SQLite) and expose CRUD tools for agents.
5.  **Phase 5: Conflict Resolution:** Implement a **"Rebase-and-Push"** workflow. If a push fails, the server attempts a local rebase. If a hard conflict occurs, provide a tool for the agent to notify the human for manual resolution.
6.  **Phase 6: Async Manager-Delegator:** Implement the **Sampling API** for complex sub-agent tasks and **Progress Notifications** for all asynchronous operations.
7.  **Phase 7: Metadata Tracking & Compaction:** Implement the hidden `.mcp-state/` folder with **Branch-to-PR mapping** and an **LRU pruning** maintenance task. Ensure `.mcp-state/` is added to the repository's `.gitignore`.

## 6. Monetization & Tiering
*   **Free Tier:**
    *   Basic GitHub repository-backed markdown document sharing.
    *   Single-user/multi-agent local synchronization.
    *   **Index-Driven Navigation:** Shared `INDEX.md` strategy for semantic discovery.
    *   Standard conflict handling: Rebase-and-Push with manual fallback.
*   **Paid Tier (Premium):**
    *   **Shared Simple Databases:** Access to JSON/SQLite-based structured data sharing.
    *   **Automated Indexing & Vector Search:** The server automatically maintains indices and offers advanced semantic search.
    *   **Advanced Semantic Routing:** Custom schema definitions and deep indexing.
    *   **Multi-User Enterprise Sync:** Managed cloud-based coordination for teams sharing the same repositories.
    *   **Advanced Conflict Resolution:** Proactive "Advisory Locking" and LLM-based structural "Smart Merging" of markdown and data files.
    *   **Priority Support:** Assistance with specialized agentic workflows and custom schema implementations.

## 7. Licensing
Nexus MCP is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**.

### Rationale:
*   **SaaS Protection:** AGPL ensures that any modified version used as a network service must also have its source code made available, protecting the "Paid Tier" SaaS roadmap.
*   **For-Profit Safety:** AGPL-licensed tooling does **not** "infect" proprietary data or repositories. Using Nexus MCP to manage internal documents is considered "at arm's length" usage and does not require a company to open-source its private information.
*   **Community Reciprocity:** Internal modifications used within a company remain private, but any version redistributed or provided as a service to others triggers the source-sharing requirement.
