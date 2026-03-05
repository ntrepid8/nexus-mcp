import { describe, it, expect } from "vitest";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { NexusServer } from "./index.js";

describe("NexusServer", () => {
  it("should list ping and version tools", async () => {
    const server = new NexusServer();
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    const client = new Client({ name: "test-client", version: "1.0.0" }, {});
    
    const internalServer = (server as any).server as Server;
    await Promise.all([
      internalServer.connect(serverTransport),
      client.connect(clientTransport)
    ]);

    const result = await client.listTools();

    expect(result.tools).toContainEqual(expect.objectContaining({ name: "ping" }));
    expect(result.tools).toContainEqual(expect.objectContaining({ name: "version" }));
  });

  it("should respond to ping tool", async () => {
    const server = new NexusServer();
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    const client = new Client({ name: "test-client", version: "1.0.0" }, {});
    
    const internalServer = (server as any).server as Server;
    await Promise.all([
      internalServer.connect(serverTransport),
      client.connect(clientTransport)
    ]);

    const result = await client.callTool({
      name: "ping",
      arguments: {},
    });

    expect(result.content).toContainEqual({ type: "text", text: "pong" });
  });

  it("should respond to version tool", async () => {
    const server = new NexusServer();
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    const client = new Client({ name: "test-client", version: "1.0.0" }, {});
    
    const internalServer = (server as any).server as Server;
    await Promise.all([
      internalServer.connect(serverTransport),
      client.connect(clientTransport)
    ]);

    const result = await client.callTool({
      name: "version",
      arguments: {},
    });

    expect(result.content).toContainEqual({ type: "text", text: "nexus-mcp v0.1.0" });
  });
});
