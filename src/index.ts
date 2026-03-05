#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

/**
 * Nexus MCP Server
 * Initial scaffolding with a simple ping/version tool.
 */
export class NexusServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: "nexus-mcp",
        version: "0.1.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
    
    // Error handling
    this.server.onerror = (error) => console.error("[MCP Error]", error);
    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "ping",
            description: "Check if the Nexus MCP server is responsive",
            inputSchema: {
              type: "object",
              properties: {},
            },
          },
          {
            name: "version",
            description: "Get the version of the Nexus MCP server",
            inputSchema: {
              type: "object",
              properties: {},
            },
          },
        ],
      };
    });

    // Handle tool execution
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name } = request.params;

      switch (name) {
        case "ping":
          return {
            content: [{ type: "text", text: "pong" }],
          };
        case "version":
          return {
            content: [{ type: "text", text: "nexus-mcp v0.1.0" }],
          };
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  async run(transport?: StdioServerTransport) {
    const serverTransport = transport || new StdioServerTransport();
    await this.server.connect(serverTransport);
    console.error("Nexus MCP server running");
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const server = new NexusServer();
  server.run().catch((error) => {
    console.error("Fatal error running server:", error);
    process.exit(1);
  });
}
